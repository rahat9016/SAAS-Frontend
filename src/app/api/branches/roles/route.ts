// /api/branches/roles
//   GET  → list roles in the caller's branch (with resource permissions)
//   POST → create a reusable branch-scoped role (Branch Admin / Super Admin)
// Roles are dynamic: created/managed independently, then assigned to users.

import { GlobalRole } from "@prisma/client";
import { prisma } from "@/src/lib/prisma";
import {
  requireGlobalRole,
  rbacError,
  rbacSuccess,
  resolveTargetBranchId,
  validateGrantsAgainstScope,
  type GrantInput,
} from "@/src/lib/rbac";

export async function GET(request: Request) {
  try {
    const { user: admin, errorResponse } = await requireGlobalRole(
      request,
      GlobalRole.BRANCH_ADMIN,
      GlobalRole.SUPER_ADMIN,
    );
    if (errorResponse) return errorResponse;

    const { searchParams } = new URL(request.url);
    const branchId = resolveTargetBranchId(
      admin,
      searchParams.get("branchId") ?? undefined,
    );

    // Super Admin without a branchId filter sees all branch roles.
    const where = branchId ? { branchId } : { branchId: { not: null } };

    const roles = await prisma.role.findMany({
      where,
      include: { resourcePermissions: true, _count: { select: { directUsers: true } } },
      orderBy: { createdAt: "desc" },
    });

    return rbacSuccess(roles);
  } catch (e) {
    console.error("list roles error:", e);
    return rbacError("Internal server error", 500);
  }
}

export async function POST(request: Request) {
  try {
    const { user: admin, errorResponse } = await requireGlobalRole(
      request,
      GlobalRole.BRANCH_ADMIN,
      GlobalRole.SUPER_ADMIN,
    );
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

    const { grants, error } = validateGrantsAgainstScope(
      branch.branchPermissions,
      requested,
    );
    if (error) return rbacError(error, 403);

    const role = await prisma.role.create({
      data: {
        name: `${branch.code} - ${name}`,
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
    console.error("create role error:", e);
    return rbacError("Internal server error", 500);
  }
}
