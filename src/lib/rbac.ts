// ─── RBAC/ABAC Auth Layer ─────────────────────────────────────────
// Verifies the JWT issued by /api/auth/login (shared secret in
// src/lib/auth-tokens.ts) but ALWAYS re-derives permissions from the
// database by token `sub` — the token is trusted only for identity,
// never for authorization.
//
// Roles are dynamic with two scopes:
//   - SUPER_ADMIN scope: grants verbatim, no branch ceiling.
//   - BRANCH scope:      grants capped to the branch's allowed scope.
// "Super admin" = User.isSuperAdmin (bypasses everything). Other admin
// powers are permission-driven (e.g. CRUD on the "roles"/"users" resource).

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { RoleScope } from "@prisma/client";
import { prisma } from "@/src/lib/prisma";
import {
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

/** Paginated envelope matching the frontend DataTable expectation. */
export function rbacPaginated<T>(
  data: T[],
  totalItems: number,
  page: number,
  limit: number,
) {
  return NextResponse.json({
    data,
    meta: {
      totalItems,
      itemCount: data.length,
      itemsPerPage: limit,
      totalPages: limit > 0 ? Math.ceil(totalItems / limit) : 1,
      currentPage: page,
    },
  });
}

/** Parse common list query params (page/limit/search). limit=-1 → all. */
export function getListParams(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const rawLimit = parseInt(searchParams.get("limit") || "10", 10);
  const limit = rawLimit === -1 ? -1 : Math.max(1, rawLimit);
  const search = searchParams.get("search") || "";
  return { page, limit, search };
}

// ─── Dynamic action catalog ───────────────────────────────────────

/** All valid action keys from the DB (the dynamic "attributes"). */
export async function getActionKeys(): Promise<string[]> {
  const actions = await prisma.action.findMany({ select: { key: true } });
  return actions.map((a) => a.key);
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
  isSuperAdmin: boolean;
  branchId: string | null;
  roleScope: RoleScope | null;
  // Branch's allowed scope (the ceiling for BRANCH-scope roles).
  branchScope: { resource: string; actions: Action[] }[];
  // This user's role-level grants.
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

  const [user, actionKeys] = await Promise.all([
    prisma.user.findUnique({
      where: { id: decoded.sub },
      include: {
        role: { include: { resourcePermissions: true } },
        branch: { include: { branchPermissions: true } },
      },
    }),
    getActionKeys(),
  ]);
  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    isSuperAdmin: user.isSuperAdmin,
    branchId: user.branchId,
    roleScope: user.role?.scope ?? null,
    branchScope: (user.branch?.branchPermissions ?? []).map((p) => ({
      resource: p.resource,
      actions: sanitizeActions(p.actions, actionKeys),
    })),
    roleGrants: (user.role?.resourcePermissions ?? []).map((p) => ({
      resource: p.resource,
      actions: sanitizeActions(p.actions, actionKeys),
    })),
  };
}

// ─── Permission map (O(1) lookup) ─────────────────────────────────

/**
 * Build the {resource: {action: bool}} map used for route access and
 * button visibility.
 *  - isSuperAdmin        → every resource × every action key true.
 *  - SUPER_ADMIN role    → role grants verbatim (no branch ceiling).
 *  - BRANCH role         → role grants INTERSECTED with the branch scope.
 *
 * `allActionKeys` is the dynamic action catalog (from getActionKeys()).
 */
export function buildPermissionMap(
  user: RbacUser,
  allActionKeys: string[],
): PermissionMap {
  const map: PermissionMap = {};
  for (const r of RESOURCES) map[r] = emptyActions(allActionKeys);

  if (user.isSuperAdmin) {
    for (const r of RESOURCES) map[r] = allActions(allActionKeys);
    return map;
  }

  // SUPER_ADMIN-scope role: grants applied verbatim (no branch ceiling).
  if (user.roleScope === RoleScope.SUPER_ADMIN) {
    for (const { resource, actions } of user.roleGrants) {
      map[resource] ??= emptyActions(allActionKeys);
      for (const a of actions) map[resource][a] = true;
    }
    return map;
  }

  // BRANCH-scope role: grants clipped to what the branch is allowed.
  const branchByResource = new Map(
    user.branchScope.map((p) => [p.resource, new Set(p.actions)]),
  );
  for (const { resource, actions } of user.roleGrants) {
    const allowed = branchByResource.get(resource);
    if (!allowed) continue; // resource outside branch scope → denied
    map[resource] ??= emptyActions(allActionKeys);
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

/** Guard: super admin only. */
export async function requireSuperAdmin(request: Request): Promise<GuardResult> {
  const { user, errorResponse } = await requireAuth(request);
  if (errorResponse) return { user: null, errorResponse };
  if (!user!.isSuperAdmin) {
    return {
      user: null,
      errorResponse: rbacError("Access denied: super admin only", 403),
    };
  }
  return { user: user!, errorResponse: null };
}

/** Guard an API route by {resource, action}. Super admin bypasses. */
export async function requireResourceAction(
  request: Request,
  resource: string,
  action: Action,
): Promise<GuardResult> {
  const { user, errorResponse } = await requireAuth(request);
  if (errorResponse) return { user: null, errorResponse };
  if (user!.isSuperAdmin) return { user: user!, errorResponse: null };

  const map = buildPermissionMap(user!, await getActionKeys());
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
 * Management guard: super admin, OR a user whose role grants any CRUD on
 * the resource (create/update/delete). Used for managing roles/users.
 */
export async function requireManage(
  request: Request,
  resource: string,
): Promise<GuardResult> {
  const { user, errorResponse } = await requireAuth(request);
  if (errorResponse) return { user: null, errorResponse };
  if (user!.isSuperAdmin) return { user: user!, errorResponse: null };

  const map = buildPermissionMap(user!, await getActionKeys());
  const perms = map[resource] ?? {};
  const canManage = perms.create || perms.update || perms.delete || perms.read;
  if (!canManage) {
    return {
      user: null,
      errorResponse: rbacError(`Access denied: requires access to ${resource}`, 403),
    };
  }
  return { user: user!, errorResponse: null };
}

/**
 * Branch isolation: super admin sees everything; everyone else is hard
 * scoped to their own branch. Spread into a Prisma `where`.
 */
export function branchScopeWhere<T extends Record<string, unknown>>(
  user: RbacUser,
  base: T = {} as T,
): T & { branchId?: string } {
  if (user.isSuperAdmin) return base;
  return { ...base, branchId: user.branchId ?? "__no_branch__" };
}

// ─── Grant validation (shared by role + user routes) ─────────────

export interface GrantInput {
  resource: string;
  actions: string[];
}

/**
 * Validate requested {resource, actions} grants.
 *  - Resource must be a known RESOURCE.
 *  - Action keys must exist in the dynamic action catalog (`actionKeys`).
 *  - If `branchPermissions` is provided (BRANCH-scope role), grants are
 *    capped to the branch's allowed scope. Pass `null` for SUPER_ADMIN
 *    scope (no ceiling — any resource × any valid action).
 */
export function validateGrantsAgainstScope(
  branchPermissions: { resource: string; actions: string[] }[] | null,
  requested: GrantInput[],
  actionKeys: string[],
): { grants: GrantInput[]; error: string | null } {
  const ceiling = branchPermissions
    ? new Map(
        branchPermissions.map((p) => [
          p.resource,
          new Set(sanitizeActions(p.actions, actionKeys)),
        ]),
      )
    : null;

  const grants: GrantInput[] = [];
  for (const p of requested) {
    if (!(RESOURCES as readonly string[]).includes(p.resource)) {
      return { grants: [], error: `Unknown resource: ${p.resource}` };
    }
    const actions = sanitizeActions(p.actions ?? [], actionKeys);
    if (ceiling) {
      const allowed = ceiling.get(p.resource);
      const exceeded = actions.filter((a) => !allowed?.has(a));
      if (exceeded.length) {
        return {
          grants: [],
          error: `Branch is not permitted to grant [${exceeded.join(", ")}] on ${p.resource}`,
        };
      }
    }
    if (actions.length) grants.push({ resource: p.resource, actions });
  }
  return { grants, error: null };
}

/**
 * Resolve which branch a managing request targets: super admin may target
 * any branch via the body; everyone else is locked to their own branch.
 */
export function resolveTargetBranchId(
  admin: RbacUser,
  bodyBranchId?: string,
): string | null {
  if (admin.isSuperAdmin) return bodyBranchId ?? null;
  return admin.branchId;
}

// Re-export for convenience in route handlers.
export { RESOURCES };
