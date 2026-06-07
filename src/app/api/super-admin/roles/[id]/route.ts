// /api/super-admin/roles/[id] — Super admin only.
//   PATCH  → rename (UPPERCASE). Built-in roles are protected.
//   DELETE → remove (built-in protected; users' roleId set null).

import { prisma } from "@/src/lib/prisma";
import { requireSuperAdmin, rbacError, rbacSuccess } from "@/src/lib/rbac";

type Ctx = { params: Promise<{ id: string }> };
const NAME_RE = /^[A-Z][A-Z0-9_]*$/;

export async function PATCH(request: Request, { params }: Ctx) {
  try {
    const { errorResponse } = await requireSuperAdmin(request);
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const role = await prisma.role.findUnique({ where: { id } });
    if (!role) return rbacError("Role not found", 404);
    if (role.isBuiltIn) return rbacError("Built-in roles cannot be modified", 400);

    const name = String((await request.json()).name ?? "").trim().toUpperCase();
    if (!NAME_RE.test(name)) return rbacError("Invalid role name", 400);
    if (name === "SUPER_ADMIN") return rbacError("SUPER_ADMIN is reserved", 400);

    const updated = await prisma.role.update({ where: { id }, data: { name } });
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
    const { errorResponse } = await requireSuperAdmin(request);
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const role = await prisma.role.findUnique({ where: { id } });
    if (!role) return rbacError("Role not found", 404);
    if (role.isBuiltIn) return rbacError("Built-in roles cannot be deleted", 400);

    await prisma.role.delete({ where: { id } });
    return rbacSuccess({ id, deleted: true });
  } catch (e) {
    console.error("delete role error:", e);
    return rbacError("Internal server error", 500);
  }
}
