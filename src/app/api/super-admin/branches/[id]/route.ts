// /api/super-admin/branches/[id] — Super Admin only.
//   GET    → one branch
//   PATCH  → update fields and/or status (activate/deactivate via {status})
//   DELETE → remove branch (users' branchId set null)

import { prisma } from "@/src/lib/prisma";
import { requireSuperAdmin, rbacError, rbacSuccess } from "@/src/lib/rbac";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Ctx) {
  try {
    const { errorResponse } = await requireSuperAdmin(request);
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const branch = await prisma.branch.findUnique({
      where: { id },
      include: { _count: { select: { users: true } } },
    });
    if (!branch) return rbacError("Branch not found", 404);
    return rbacSuccess(branch);
  } catch (e) {
    console.error("get branch error:", e);
    return rbacError("Internal server error", 500);
  }
}

export async function PATCH(request: Request, { params }: Ctx) {
  try {
    const { errorResponse } = await requireSuperAdmin(request);
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const body = await request.json();
    const { code, contact, country, city, area, address, status } = body;

    const branch = await prisma.branch.update({
      where: { id },
      data: {
        ...(code !== undefined ? { code: code || null } : {}),
        ...(contact !== undefined ? { contact: contact || null } : {}),
        ...(country !== undefined ? { country: country || null } : {}),
        ...(city !== undefined ? { city: city || null } : {}),
        ...(area !== undefined ? { area: area || null } : {}),
        ...(address !== undefined ? { address: address || null } : {}),
        ...(status === "ACTIVE" || status === "INACTIVE" ? { status } : {}),
      },
    });

    return rbacSuccess(branch);
  } catch (e: unknown) {
    if (typeof e === "object" && e && "code" in e && (e as { code: string }).code === "P2002") {
      return rbacError("A branch with this code already exists", 409);
    }
    console.error("update branch error:", e);
    return rbacError("Internal server error", 500);
  }
}

export async function DELETE(request: Request, { params }: Ctx) {
  try {
    const { errorResponse } = await requireSuperAdmin(request);
    if (errorResponse) return errorResponse;

    const { id } = await params;
    await prisma.branch.delete({ where: { id } });
    return rbacSuccess({ id, deleted: true });
  } catch (e) {
    console.error("delete branch error:", e);
    return rbacError("Internal server error", 500);
  }
}
