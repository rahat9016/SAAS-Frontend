// /api/super-admin/roles — SUPER_ADMIN-scope dynamic roles.
//   GET  → paginated list of global roles
//   POST → create a global role; grants are NOT capped (any resource × any
//          valid action key). Super admin only.

import { RoleScope } from "@prisma/client";
import { prisma } from "@/src/lib/prisma";
import {
  requireSuperAdmin,
  rbacError,
  rbacSuccess,
  rbacPaginated,
  getListParams,
  validateGrantsAgainstScope,
  getActionKeys,
  type GrantInput,
} from "@/src/lib/rbac";

export async function GET(request: Request) {
  try {
    const { errorResponse } = await requireSuperAdmin(request);
    if (errorResponse) return errorResponse;

    const { page, limit, search } = getListParams(new URL(request.url).searchParams);
    const where = {
      scope: RoleScope.SUPER_ADMIN,
      ...(search ? { name: { contains: search, mode: "insensitive" as const } } : {}),
    };

    const skip = limit === -1 ? undefined : (page - 1) * limit;
    const take = limit === -1 ? undefined : limit;

    const [roles, totalItems] = await Promise.all([
      prisma.role.findMany({
        where,
        skip,
        take,
        include: { resourcePermissions: true, _count: { select: { directUsers: true } } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.role.count({ where }),
    ]);

    return rbacPaginated(roles, totalItems, page, limit === -1 ? totalItems : limit);
  } catch (e) {
    console.error("list super-admin roles error:", e);
    return rbacError("Internal server error", 500);
  }
}

export async function POST(request: Request) {
  try {
    const { user: admin, errorResponse } = await requireSuperAdmin(request);
    if (errorResponse) return errorResponse;

    const body = await request.json();
    const { name } = body;
    const requested: GrantInput[] = body.permissions ?? [];
    if (!name) return rbacError("name is required", 400);

    const actionKeys = await getActionKeys();
    // null ceiling → no branch cap; only resource + action-key validity.
    const { grants, error } = validateGrantsAgainstScope(null, requested, actionKeys);
    if (error) return rbacError(error, 400);

    const role = await prisma.role.create({
      data: {
        name,
        scope: RoleScope.SUPER_ADMIN,
        branchId: null,
        createdBy: admin!.id,
        resourcePermissions: { create: grants },
      },
      include: { resourcePermissions: true },
    });

    return rbacSuccess(role, 201);
  } catch (e: unknown) {
    if (typeof e === "object" && e && "code" in e && (e as { code: string }).code === "P2002") {
      return rbacError("A role with this name already exists", 409);
    }
    console.error("create super-admin role error:", e);
    return rbacError("Internal server error", 500);
  }
}
