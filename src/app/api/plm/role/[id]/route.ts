import { prisma } from "@/src/lib/prisma";
import { requireRole, success, error } from "@/src/lib/plm-api";
import { NextRequest } from "next/server";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { errorResponse } = await requireRole(request, "SUPER_ADMIN");
    if (errorResponse) return errorResponse;
    const { id } = await params;

    const existing = await prisma.role.findUnique({ where: { id } });
    if (!existing) return error("Role not found", 404);
    if (existing.isBuiltIn) return error("Cannot modify built-in roles", 400);

    const body = await request.json();
    const role = await prisma.role.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.description !== undefined && { description: body.description }),
      },
    });

    // Update permissions if provided
    if (body.permissionKeys) {
      await prisma.rolePermission.deleteMany({ where: { roleId: id } });
      for (const key of body.permissionKeys) {
        const perm = await prisma.permission.findUnique({ where: { key } });
        if (perm) {
          await prisma.rolePermission.create({ data: { roleId: id, permissionId: perm.id } });
        }
      }
    }

    return success(role);
  } catch (e: unknown) {
    console.error("Role update error:", e);
    return error("Internal server error", 500);
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { errorResponse } = await requireRole(request, "SUPER_ADMIN");
    if (errorResponse) return errorResponse;
    const { id } = await params;

    const existing = await prisma.role.findUnique({ where: { id } });
    if (!existing) return error("Role not found", 404);
    if (existing.isBuiltIn) return error("Cannot delete built-in roles", 400);

    await prisma.role.delete({ where: { id } });
    return success({ message: "Role deleted" });
  } catch (e: unknown) {
    console.error("Role delete error:", e);
    return error("Internal server error", 500);
  }
}
