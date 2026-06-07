// /api/branches/users/[id]
//   GET    → one user (with role + branch)
//   PATCH  → update profile / role / branch / status / password (NOT permissions)
//   DELETE → remove user
// Guard: super admin, or a user with access to the "users" resource.
// Non-super-admin is restricted to users in their own branch.

import bcryptjs from "bcryptjs";
import { prisma } from "@/src/lib/prisma";
import { requireManage, rbacError, rbacSuccess, type RbacUser } from "@/src/lib/rbac";

type Ctx = { params: Promise<{ id: string }> };

async function loadUser(admin: RbacUser, id: string) {
  const user = await prisma.user.findUnique({ where: { id }, include: { role: true } });
  if (!user) return { user: null, error: rbacError("User not found", 404) };
  if (!admin.isSuperAdmin && user.branchId !== admin.branchId) {
    return { user: null, error: rbacError("Access denied: user in another branch", 403) };
  }
  return { user, error: null as null };
}

export async function GET(request: Request, { params }: Ctx) {
  try {
    const { user: admin, errorResponse } = await requireManage(request, "users");
    if (errorResponse) return errorResponse;
    const { id } = await params;
    const { error } = await loadUser(admin, id);
    if (error) return error;

    const full = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true, firstName: true, lastName: true, email: true, phone: true,
        gender: true, dateOfBirth: true, status: true, branchId: true,
        role: { select: { id: true, name: true, isSuperAdmin: true } },
        permissions: { select: { resource: true, actions: true } },
      },
    });
    return rbacSuccess(full);
  } catch (e) {
    console.error("get user error:", e);
    return rbacError("Internal server error", 500);
  }
}

export async function PATCH(request: Request, { params }: Ctx) {
  try {
    const { user: admin, errorResponse } = await requireManage(request, "users");
    if (errorResponse) return errorResponse;
    const { id } = await params;
    const { error } = await loadUser(admin, id);
    if (error) return error;

    const body = await request.json();
    const { firstName, lastName, phone, gender, dateOfBirth, password, status } = body;

    // Super admin may move branch / change role; others cannot.
    const branchId = admin.isSuperAdmin ? body.branchId : undefined;
    let roleId: string | undefined;
    if (admin.isSuperAdmin && body.roleId !== undefined) {
      if (body.roleId) {
        const role = await prisma.role.findUnique({ where: { id: body.roleId } });
        if (!role) return rbacError("Role not found", 404);
        if (role.isSuperAdmin) return rbacError("Cannot assign the SUPER_ADMIN role", 403);
      }
      roleId = body.roleId || null;
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        ...(firstName !== undefined ? { firstName } : {}),
        ...(lastName !== undefined ? { lastName: lastName || null } : {}),
        ...(phone !== undefined ? { phone: phone || null } : {}),
        ...(gender !== undefined ? { gender: gender || null } : {}),
        ...(dateOfBirth !== undefined
          ? { dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null }
          : {}),
        ...(status === "ACTIVE" || status === "INACTIVE" ? { status } : {}),
        ...(password ? { password: await bcryptjs.hash(password, 10) } : {}),
        ...(branchId !== undefined ? { branchId: branchId || null } : {}),
        ...(roleId !== undefined ? { roleId } : {}),
      },
      select: { id: true, firstName: true, email: true, roleId: true, branchId: true },
    });

    return rbacSuccess(updated);
  } catch (e: unknown) {
    if (typeof e === "object" && e && "code" in e && (e as { code: string }).code === "P2002") {
      return rbacError("Email or phone already in use", 409);
    }
    console.error("update user error:", e);
    return rbacError("Internal server error", 500);
  }
}

export async function DELETE(request: Request, { params }: Ctx) {
  try {
    const { user: admin, errorResponse } = await requireManage(request, "users");
    if (errorResponse) return errorResponse;
    const { id } = await params;
    const { error } = await loadUser(admin, id);
    if (error) return error;

    await prisma.user.delete({ where: { id } });
    return rbacSuccess({ id, deleted: true });
  } catch (e) {
    console.error("delete user error:", e);
    return rbacError("Internal server error", 500);
  }
}
