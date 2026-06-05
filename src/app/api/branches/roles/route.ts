// /api/branches/roles — BRANCH-scope dynamic roles.
//   GET  → paginated list of branch roles (with resource permissions)
//   POST → create a branch role; grants are capped to the branch scope.
// Guard: super admin, or a user with access to the "roles" resource.

import { RoleScope } from "@prisma/client";
import { prisma } from "@/src/lib/prisma";
import {
  requireManage,
  rbacError,
  rbacSuccess,
  rbacPaginated,
  getListParams,
  resolveTargetBranchId,
  validateGrantsAgainstScope,
  getActionKeys,
  type GrantInput,
} from "@/src/lib/rbac";

export async function GET(request: Request) {
  try {
    const { user: admin, errorResponse } = await requireManage(request, "roles");
    if (errorResponse) return errorResponse;

    const { searchParams } = new URL(request.url);
    const { page, limit, search } = getListParams(searchParams);
    const branchId = resolveTargetBranchId(admin, searchParams.get("branchId") ?? undefined);

    const where = {
      scope: RoleScope.BRANCH,
      ...(branchId ? { branchId } : { branchId: { not: null } }),
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
    console.error("list branch roles error:", e);
    return rbacError("Internal server error", 500);
  }
}

export async function POST(request: Request) {
  try {
    const { user: admin, errorResponse } = await requireManage(request, "roles");
    if (errorResponse) return errorResponse;

    const body = await request.json();
    const { name } = body;
    const requested: GrantInput[] = body.permissions ?? [];
    if (!name) return rbacError("name is required", 400);

    const branchId = resolveTargetBranchId(admin, body.branchId);
    if (!branchId) return rbacError("No branch context", 400);

    const branch = await prisma.branch.findUnique({
      where: { id: branchId },
      include: { branchPermissions: true },
    });
    if (!branch) return rbacError("Branch not found", 404);

    const actionKeys = await getActionKeys();
    const { grants, error } = validateGrantsAgainstScope(
      branch.branchPermissions,
      requested,
      actionKeys,
    );
    if (error) return rbacError(error, 403);

    const role = await prisma.role.create({
      data: {
        name: `${branch.code} - ${name}`,
        scope: RoleScope.BRANCH,
        branchId: branch.id,
        createdBy: admin.id,
        resourcePermissions: { create: grants },
      },
      include: { resourcePermissions: true },
    });

    return rbacSuccess(role, 201);
  } catch (e: unknown) {
    if (typeof e === "object" && e && "code" in e && (e as { code: string }).code === "P2002") {
      return rbacError("A role with this name already exists", 409);
    }
    console.error("create branch role error:", e);
    return rbacError("Internal server error", 500);
  }
}
