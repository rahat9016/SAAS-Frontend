// /api/branches/roles/[id]
//   GET    → fetch one branch role
//   PATCH  → rename and/or replace its resource permissions
//   DELETE → remove the role (assigned users keep their record, role → null)
// All scoped: a Branch Admin may only touch roles in their own branch.

import { GlobalRole, Role } from "@prisma/client";
import { prisma } from "@/src/lib/prisma";
import {
  requireGlobalRole,
  rbacError,
  rbacSuccess,
  validateGrantsAgainstScope,
  type RbacUser,
  type GrantInput,
} from "@/src/lib/rbac";

type Ctx = { params: Promise<{ id: string }> };

/** Load a role and assert the admin is allowed to manage it. */
async function loadOwnedRole(admin: RbacUser, id: string) {
  const role = await prisma.role.findUnique({ where: { id } });
  if (!role || !role.branchId) return { role: null, error: rbacError("Role not found", 404) };
  if (
    admin.globalRole !== GlobalRole.SUPER_ADMIN &&
    role.branchId !== admin.branchId
  ) {
    return { role: null, error: rbacError("Access denied: role belongs to another branch", 403) };
  }
  return { role, error: null as null };
}

export async function GET(request: Request, { params }: Ctx) {
  try {
    const { user: admin, errorResponse } = await requireGlobalRole(
      request,
      GlobalRole.BRANCH_ADMIN,
      GlobalRole.SUPER_ADMIN,
    );
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const { role, error } = await loadOwnedRole(admin, id);
    if (error) return error;

    const full = await prisma.role.findUnique({
      where: { id: (role as Role).id },
      include: { resourcePermissions: true, _count: { select: { directUsers: true } } },
    });
    return rbacSuccess(full);
  } catch (e) {
    console.error("get role error:", e);
    return rbacError("Internal server error", 500);
  }
}

export async function PATCH(request: Request, { params }: Ctx) {
  try {
    const { user: admin, errorResponse } = await requireGlobalRole(
      request,
      GlobalRole.BRANCH_ADMIN,
      GlobalRole.SUPER_ADMIN,
    );
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const { role, error } = await loadOwnedRole(admin, id);
    if (error) return error;
    const owned = role as Role;

    const body = await request.json();
    const { name } = body;
    const requested: GrantInput[] | undefined = body.permissions;

    // Re-validate any new permissions against the branch's current scope.
    let grants: GrantInput[] | null = null;
    let newName: string | undefined;

    if (requested || name) {
      const branch = await prisma.branch.findUnique({
        where: { id: owned.branchId! },
        include: { branchPermissions: true },
      });
      if (!branch) return rbacError("Branch not found", 404);

      if (requested) {
        const res = validateGrantsAgainstScope(branch.branchPermissions, requested);
        if (res.error) return rbacError(res.error, 403);
        grants = res.grants;
      }
      // Namespace the name with branch code, matching create.
      if (name) newName = `${branch.code} - ${name}`;
    }

    const updated = await prisma.$transaction(async (tx) => {
      if (grants) {
        await tx.roleResourcePermission.deleteMany({ where: { roleId: owned.id } });
        if (grants.length) {
          await tx.roleResourcePermission.createMany({
            data: grants.map((g) => ({ roleId: owned.id, ...g })),
          });
        }
      }
      return tx.role.update({
        where: { id: owned.id },
        data: { ...(newName ? { name: newName } : {}) },
        include: { resourcePermissions: true },
      });
    });

    return rbacSuccess(updated);
  } catch (e: unknown) {
    if (typeof e === "object" && e && "code" in e && (e as { code: string }).code === "P2002") {
      return rbacError("A role with this name already exists", 409);
    }
    console.error("update role error:", e);
    return rbacError("Internal server error", 500);
  }
}

export async function DELETE(request: Request, { params }: Ctx) {
  try {
    const { user: admin, errorResponse } = await requireGlobalRole(
      request,
      GlobalRole.BRANCH_ADMIN,
      GlobalRole.SUPER_ADMIN,
    );
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const { role, error } = await loadOwnedRole(admin, id);
    if (error) return error;

    await prisma.role.delete({ where: { id: (role as Role).id } });
    return rbacSuccess({ id: (role as Role).id, deleted: true });
  } catch (e) {
    console.error("delete role error:", e);
    return rbacError("Internal server error", 500);
  }
}
