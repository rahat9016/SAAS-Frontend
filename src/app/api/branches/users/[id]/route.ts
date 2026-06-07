// /api/branches/users/[id]
//   GET    → one user (with permissions)
//   PATCH  → update fields / role / status / branch / password + replace permissions
//   DELETE → remove user
// Guard: super admin, or a user with access to the "users" resource.
// Non-super-admin is restricted to users in their own branch.

import bcryptjs from "bcryptjs";
import { Roles } from "@prisma/client";
import { prisma } from "@/src/lib/prisma";
import {
  requireManage,
  rbacError,
  rbacSuccess,
  validateGrants,
  getActionKeys,
  type RbacUser,
  type GrantInput,
} from "@/src/lib/rbac";

type Ctx = { params: Promise<{ id: string }> };
const ASSIGNABLE_ROLES: Roles[] = [Roles.BRANCH_ADMIN, Roles.USER];

async function loadUser(admin: RbacUser, id: string) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return { user: null, error: rbacError("User not found", 404) };
  if (admin.role !== Roles.SUPER_ADMIN && user.branchId !== admin.branchId) {
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
        gender: true, dateOfBirth: true, role: true, status: true, branchId: true,
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
    const requested: GrantInput[] | undefined = body.permissions;

    let grants: GrantInput[] | null = null;
    if (requested) {
      const res = validateGrants(requested, await getActionKeys());
      if (res.error) return rbacError(res.error, 400);
      grants = res.grants;
    }

    // Super admin may move branch / change role; others cannot.
    const branchId = admin.role === Roles.SUPER_ADMIN ? body.branchId : undefined;
    const role =
      admin.role === Roles.SUPER_ADMIN && ASSIGNABLE_ROLES.includes(body.role)
        ? body.role
        : undefined;

    const updated = await prisma.$transaction(async (tx) => {
      if (grants) {
        await tx.userPermission.deleteMany({ where: { userId: id } });
        if (grants.length) {
          await tx.userPermission.createMany({
            data: grants.map((g) => ({ userId: id, ...g })),
          });
        }
      }
      return tx.user.update({
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
          ...(role ? { role } : {}),
        },
        select: { id: true, firstName: true, email: true, role: true, branchId: true },
      });
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
