// /api/super-admin/roles/[id]
//   GET    → fetch one global role
//   PATCH  → rename and/or replace permissions (no branch ceiling)
//   DELETE → remove the role (assigned users keep their record, role → null)
// Super admin only.

import { RoleScope } from "@prisma/client";
import { prisma } from "@/src/lib/prisma";
import {
  requireSuperAdmin,
  rbacError,
  rbacSuccess,
  validateGrantsAgainstScope,
  getActionKeys,
  type GrantInput,
} from "@/src/lib/rbac";

type Ctx = { params: Promise<{ id: string }> };

async function loadGlobalRole(id: string) {
  const role = await prisma.role.findUnique({ where: { id } });
  if (!role || role.scope !== RoleScope.SUPER_ADMIN) {
    return { role: null, error: rbacError("Role not found", 404) };
  }
  return { role, error: null as null };
}

export async function GET(request: Request, { params }: Ctx) {
  try {
    const { errorResponse } = await requireSuperAdmin(request);
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const { error } = await loadGlobalRole(id);
    if (error) return error;

    const full = await prisma.role.findUnique({
      where: { id },
      include: { resourcePermissions: true, _count: { select: { directUsers: true } } },
    });
    return rbacSuccess(full);
  } catch (e) {
    console.error("get super-admin role error:", e);
    return rbacError("Internal server error", 500);
  }
}

export async function PATCH(request: Request, { params }: Ctx) {
  try {
    const { errorResponse } = await requireSuperAdmin(request);
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const { error } = await loadGlobalRole(id);
    if (error) return error;

    const body = await request.json();
    const { name } = body;
    const requested: GrantInput[] | undefined = body.permissions;

    let grants: GrantInput[] | null = null;
    if (requested) {
      const actionKeys = await getActionKeys();
      const res = validateGrantsAgainstScope(null, requested, actionKeys);
      if (res.error) return rbacError(res.error, 400);
      grants = res.grants;
    }

    const updated = await prisma.$transaction(async (tx) => {
      if (grants) {
        await tx.roleResourcePermission.deleteMany({ where: { roleId: id } });
        if (grants.length) {
          await tx.roleResourcePermission.createMany({
            data: grants.map((g) => ({ roleId: id, ...g })),
          });
        }
      }
      return tx.role.update({
        where: { id },
        data: { ...(name ? { name } : {}) },
        include: { resourcePermissions: true },
      });
    });

    return rbacSuccess(updated);
  } catch (e: unknown) {
    if (typeof e === "object" && e && "code" in e && (e as { code: string }).code === "P2002") {
      return rbacError("A role with this name already exists", 409);
    }
    console.error("update super-admin role error:", e);
    return rbacError("Internal server error", 500);
  }
}

export async function DELETE(request: Request, { params }: Ctx) {
  try {
    const { errorResponse } = await requireSuperAdmin(request);
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const { error } = await loadGlobalRole(id);
    if (error) return error;

    await prisma.role.delete({ where: { id } });
    return rbacSuccess({ id, deleted: true });
  } catch (e) {
    console.error("delete super-admin role error:", e);
    return rbacError("Internal server error", 500);
  }
}
