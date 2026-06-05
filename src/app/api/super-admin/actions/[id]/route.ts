// /api/super-admin/actions/[id]
//   PATCH  → rename an action's label
//   DELETE → remove an action (built-in keys are protected)
// Super admin only.

import { prisma } from "@/src/lib/prisma";
import { requireSuperAdmin, rbacError, rbacSuccess } from "@/src/lib/rbac";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Ctx) {
  try {
    const { errorResponse } = await requireSuperAdmin(request);
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const body = await request.json();
    const label = String(body.label ?? "").trim();
    if (!label) return rbacError("label is required", 400);

    const action = await prisma.action.update({ where: { id }, data: { label } });
    return rbacSuccess(action);
  } catch (e) {
    console.error("update action error:", e);
    return rbacError("Internal server error", 500);
  }
}

export async function DELETE(request: Request, { params }: Ctx) {
  try {
    const { errorResponse } = await requireSuperAdmin(request);
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const action = await prisma.action.findUnique({ where: { id } });
    if (!action) return rbacError("Action not found", 404);
    if (action.isBuiltIn) return rbacError("Built-in actions cannot be deleted", 400);

    await prisma.action.delete({ where: { id } });
    return rbacSuccess({ id, deleted: true });
  } catch (e) {
    console.error("delete action error:", e);
    return rbacError("Internal server error", 500);
  }
}
