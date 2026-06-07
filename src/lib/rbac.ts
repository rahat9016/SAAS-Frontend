// ─── RBAC/ABAC Auth Layer ─────────────────────────────────────────
// Token = identity only. Permissions are ALWAYS re-derived from the DB.
//   - role.isSuperAdmin → bypasses everything (only SUPER_ADMIN is constant).
//   - other roles       → permissions come from per-user `UserPermission`
//     rows (resource + dynamic UPPERCASE action keys) assigned in a
//     separate screen. Non-super users are isolated to their `branchId`.

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
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

export function getListParams(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const rawLimit = parseInt(searchParams.get("limit") || "10", 10);
  const limit = rawLimit === -1 ? -1 : Math.max(1, rawLimit);
  const search = searchParams.get("search") || "";
  return { page, limit, search };
}

// ─── Dynamic action catalog ───────────────────────────────────────

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
  name: string;
  isSuperAdmin: boolean;
  roleName: string | null;
  branchId: string | null;
  // Per-user grants (resource + UPPERCASE action keys).
  permissions: { resource: string; actions: Action[] }[];
}

export async function getRbacUser(request: Request): Promise<RbacUser | null> {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const decoded = verifyToken(authHeader.slice(7));
  if (!decoded?.sub) return null;

  const [user, actionKeys] = await Promise.all([
    prisma.user.findUnique({
      where: { id: decoded.sub },
      include: { permissions: true, role: true },
    }),
    getActionKeys(),
  ]);
  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    name: [user.firstName, user.lastName].filter(Boolean).join(" "),
    isSuperAdmin: user.role?.isSuperAdmin ?? false,
    roleName: user.role?.name ?? null,
    branchId: user.branchId,
    permissions: user.permissions.map((p) => ({
      resource: p.resource,
      actions: sanitizeActions(p.actions, actionKeys),
    })),
  };
}

// ─── Permission map (O(1) lookup) ─────────────────────────────────

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

  for (const { resource, actions } of user.permissions) {
    map[resource] ??= emptyActions(allActionKeys);
    for (const a of actions) map[resource][a] = true;
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

export async function requireSuperAdmin(request: Request): Promise<GuardResult> {
  const { user, errorResponse } = await requireAuth(request);
  if (errorResponse) return { user: null, errorResponse };
  if (!user!.isSuperAdmin) {
    return { user: null, errorResponse: rbacError("Access denied: super admin only", 403) };
  }
  return { user: user!, errorResponse: null };
}

/** Guard by {resource, UPPERCASE action}. Super admin bypasses. */
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
      errorResponse: rbacError(`Access denied: requires ${action} on ${resource}`, 403),
    };
  }
  return { user: user!, errorResponse: null };
}

/** Super admin, or a user with any access (CRUD) to the resource. */
export async function requireManage(
  request: Request,
  resource: string,
): Promise<GuardResult> {
  const { user, errorResponse } = await requireAuth(request);
  if (errorResponse) return { user: null, errorResponse };
  if (user!.isSuperAdmin) return { user: user!, errorResponse: null };

  const map = buildPermissionMap(user!, await getActionKeys());
  const perms = map[resource] ?? {};
  if (!(perms.CREATE || perms.UPDATE || perms.DELETE || perms.READ)) {
    return {
      user: null,
      errorResponse: rbacError(`Access denied: requires access to ${resource}`, 403),
    };
  }
  return { user: user!, errorResponse: null };
}

/** Branch isolation: super admin sees all; others scoped to their branch. */
export function branchScopeWhere<T extends Record<string, unknown>>(
  user: RbacUser,
  base: T = {} as T,
): T & { branchId?: string } {
  if (user.isSuperAdmin) return base;
  return { ...base, branchId: user.branchId ?? "__no_branch__" };
}

// ─── Grant validation ─────────────────────────────────────────────

export interface GrantInput {
  resource: string;
  actions: string[];
}

/**
 * Validate per-user grants: resource must be known and action keys must
 * exist in the dynamic catalog. No branch ceiling — super admin decides.
 */
export function validateGrants(
  requested: GrantInput[],
  actionKeys: string[],
): { grants: GrantInput[]; error: string | null } {
  const grants: GrantInput[] = [];
  for (const p of requested) {
    if (!(RESOURCES as readonly string[]).includes(p.resource)) {
      return { grants: [], error: `Unknown resource: ${p.resource}` };
    }
    const actions = sanitizeActions(p.actions ?? [], actionKeys);
    if (actions.length) grants.push({ resource: p.resource, actions });
  }
  return { grants, error: null };
}

/** Super admin may target any branch via body; others use their own. */
export function resolveTargetBranchId(
  admin: RbacUser,
  bodyBranchId?: string,
): string | null {
  if (admin.isSuperAdmin) return bodyBranchId ?? null;
  return admin.branchId;
}

export { RESOURCES };
