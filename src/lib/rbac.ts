// ─── RBAC/ABAC Auth Layer ─────────────────────────────────────────
// Verifies the JWT issued by /api/auth/login (shared secret in
// src/lib/auth-tokens.ts) but ALWAYS re-derives permissions from the
// database by token `sub` — the token is trusted only for identity,
// never for authorization.

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { GlobalRole } from "@prisma/client";
import { prisma } from "@/src/lib/prisma";
import {
  ACTIONS,
  RESOURCES,
  emptyActions,
  allActions,
  sanitizeActions,
  type Action,
  type PermissionMap,
} from "@/src/config/rbac";

const JWT_SECRET = process.env.JWT_SECRET || "plm-super-secret-key";

// ─── Response helpers ─────────────────────────────────────────────

export function rbacError(message: string, status = 400) {
  return NextResponse.json({ statusCode: status, message }, { status });
}

export function rbacSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status });
}

// ─── Token + user loading ─────────────────────────────────────────

interface TokenPayload {
  sub: string;
}

function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export interface RbacUser {
  id: string;
  email: string;
  name: string | null;
  globalRole: GlobalRole;
  branchId: string | null;
  // Branch's allowed scope (the ceiling for every role inside it).
  branchScope: { resource: string; actions: Action[] }[];
  // This user's role-level grants (subset of the branch scope).
  roleGrants: { resource: string; actions: Action[] }[];
}

/**
 * Decode the Bearer token, then load the user with their role grants
 * and branch scope straight from the DB. Returns null if unauthenticated.
 */
export async function getRbacUser(request: Request): Promise<RbacUser | null> {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const decoded = verifyToken(authHeader.slice(7));
  if (!decoded?.sub) return null;

  const user = await prisma.user.findUnique({
    where: { id: decoded.sub },
    include: {
      role: { include: { resourcePermissions: true } },
      branch: { include: { branchPermissions: true } },
    },
  });
  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    globalRole: user.globalRole,
    branchId: user.branchId,
    branchScope: (user.branch?.branchPermissions ?? []).map((p) => ({
      resource: p.resource,
      actions: sanitizeActions(p.actions),
    })),
    roleGrants: (user.role?.resourcePermissions ?? []).map((p) => ({
      resource: p.resource,
      actions: sanitizeActions(p.actions),
    })),
  };
}

// ─── Permission map (O(1) lookup) ─────────────────────────────────

/**
 * Build the {resource: {action: bool}} map the frontend uses for route
 * access and button visibility.
 *  - SUPER_ADMIN      → everything true (bypasses branch scope)
 *  - BRANCH_ADMIN     → the full branch scope (owns the branch)
 *  - BRANCH_USER      → role grants INTERSECTED with the branch scope
 */
export function buildPermissionMap(user: RbacUser): PermissionMap {
  // Start with a complete, all-false map so any resource is safe to query.
  const map: PermissionMap = {};
  for (const r of RESOURCES) map[r] = emptyActions();

  if (user.globalRole === GlobalRole.SUPER_ADMIN) {
    for (const r of RESOURCES) map[r] = allActions();
    return map;
  }

  const branchByResource = new Map(
    user.branchScope.map((p) => [p.resource, new Set(p.actions)]),
  );

  if (user.globalRole === GlobalRole.BRANCH_ADMIN) {
    for (const { resource, actions } of user.branchScope) {
      map[resource] ??= emptyActions();
      for (const a of actions) map[resource][a] = true;
    }
    return map;
  }

  // BRANCH_USER: role grants clipped to what the branch is allowed.
  for (const { resource, actions } of user.roleGrants) {
    const allowed = branchByResource.get(resource);
    if (!allowed) continue; // resource outside branch scope → denied
    map[resource] ??= emptyActions();
    for (const a of actions) {
      if (allowed.has(a)) map[resource][a] = true;
    }
  }
  return map;
}

// ─── Guards ───────────────────────────────────────────────────────

type GuardResult =
  | { user: RbacUser; errorResponse: null }
  | { user: null; errorResponse: NextResponse };

export async function requireAuth(request: Request): Promise<GuardResult> {
  const user = await getRbacUser(request);
  if (!user) return { user: null, errorResponse: rbacError("Unauthorized", 401) };
  return { user, errorResponse: null };
}

export async function requireGlobalRole(
  request: Request,
  ...roles: GlobalRole[]
): Promise<GuardResult> {
  const { user, errorResponse } = await requireAuth(request);
  if (errorResponse) return { user: null, errorResponse };
  if (!roles.includes(user!.globalRole)) {
    return {
      user: null,
      errorResponse: rbacError(
        `Access denied: requires role [${roles.join(", ")}]`,
        403,
      ),
    };
  }
  return { user: user!, errorResponse: null };
}

/** Guard an API route by {resource, action}. */
export async function requireResourceAction(
  request: Request,
  resource: string,
  action: Action,
): Promise<GuardResult> {
  const { user, errorResponse } = await requireAuth(request);
  if (errorResponse) return { user: null, errorResponse };

  const map = buildPermissionMap(user!);
  if (!map[resource]?.[action]) {
    return {
      user: null,
      errorResponse: rbacError(
        `Access denied: requires ${action} on ${resource}`,
        403,
      ),
    };
  }
  return { user: user!, errorResponse: null };
}

/**
 * Branch isolation: Super Admin sees everything; everyone else is hard
 * scoped to their own branch. Spread into a Prisma `where`.
 *   prisma.order.findMany({ where: branchScopeWhere(user, { status }) })
 */
export function branchScopeWhere<T extends Record<string, unknown>>(
  user: RbacUser,
  base: T = {} as T,
): T & { branchId?: string } {
  if (user.globalRole === GlobalRole.SUPER_ADMIN) return base;
  return { ...base, branchId: user.branchId ?? "__no_branch__" };
}

// ─── Grant validation (shared by role + user routes) ─────────────

export interface GrantInput {
  resource: string;
  actions: string[];
}

/**
 * Validate requested {resource, actions} grants against a branch's
 * allowed scope. A grant can never exceed what the branch itself was
 * given (top-down RBAC). Unknown resources/actions are rejected/dropped.
 * Returns cleaned grants, or an error message describing the violation.
 */
export function validateGrantsAgainstScope(
  branchPermissions: { resource: string; actions: string[] }[],
  requested: GrantInput[],
): { grants: GrantInput[]; error: string | null } {
  const scope = new Map(
    branchPermissions.map((p) => [p.resource, new Set(sanitizeActions(p.actions))]),
  );

  const grants: GrantInput[] = [];
  for (const p of requested) {
    if (!(RESOURCES as readonly string[]).includes(p.resource)) {
      return { grants: [], error: `Unknown resource: ${p.resource}` };
    }
    const allowed = scope.get(p.resource);
    const actions = sanitizeActions(p.actions ?? []);
    const exceeded = actions.filter((a) => !allowed?.has(a));
    if (exceeded.length) {
      return {
        grants: [],
        error: `Branch is not permitted to grant [${exceeded.join(", ")}] on ${p.resource}`,
      };
    }
    if (actions.length) grants.push({ resource: p.resource, actions });
  }
  return { grants, error: null };
}

/**
 * Resolve which branch a managing request targets: a Branch Admin is
 * locked to their own branch; a Super Admin may target any via body.
 */
export function resolveTargetBranchId(
  admin: RbacUser,
  bodyBranchId?: string,
): string | null {
  if (admin.globalRole === GlobalRole.SUPER_ADMIN) return bodyBranchId ?? null;
  return admin.branchId;
}

// Re-export for convenience in route handlers.
export { ACTIONS, RESOURCES };
