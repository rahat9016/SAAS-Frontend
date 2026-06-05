// /api/branches/users/[id]
//   PATCH  → update name / reassign role / reset password
//   DELETE → remove the branch user
// Guard: super admin, or a user with access to the "users" resource. A
// non-super-admin may only touch users in their own branch.

import bcryptjs from "bcryptjs";
import { prisma } from "@/src/lib/prisma";
import {
  requireManage,
  rbacError,
  rbacSuccess,
  type RbacUser,
} from "@/src/lib/rbac";

type Ctx = { params: Promise<{ id: string }> };

async function loadOwnedUser(admin: RbacUser, id: string) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return { user: null, error: rbacError("User not found", 404) };
  if (!admin.isSuperAdmin && user.branchId !== admin.branchId) {
    return { user: null, error: rbacError("Access denied: user belongs to another branch", 403) };
  }
  return { user, error: null as null };
}

export async function PATCH(request: Request, { params }: Ctx) {
  try {
    const { user: admin, errorResponse } = await requireManage(request, "users");
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const { user, error } = await loadOwnedUser(admin, id);
    if (error) return error;

    const body = await request.json();
    const { name, roleId, password } = body;

    if (roleId) {
      const role = await prisma.role.findUnique({ where: { id: roleId } });
      if (!role || role.branchId !== user!.branchId) {
        return rbacError("Role not found in this branch", 404);
      }
    }

    const updated = await prisma.user.update({
      where: { id: user!.id },
      data: {
        ...(name ? { name } : {}),
        ...(roleId ? { roleId } : {}),
        ...(password ? { password: await bcryptjs.hash(password, 10) } : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        branchId: true,
        role: { select: { id: true, name: true } },
      },
    });

    return rbacSuccess(updated);
  } catch (e) {
    console.error("update branch user error:", e);
    return rbacError("Internal server error", 500);
  }
}

export async function DELETE(request: Request, { params }: Ctx) {
  try {
    const { user: admin, errorResponse } = await requireManage(request, "users");
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const { user, error } = await loadOwnedUser(admin, id);
    if (error) return error;

    await prisma.user.delete({ where: { id: user!.id } });
    return rbacSuccess({ id: user!.id, deleted: true });
  } catch (e) {
    console.error("delete branch user error:", e);
    return rbacError("Internal server error", 500);
  }
}
