// GET /api/roles — read-only role list for assignment selects (auth users).
// Excludes the SUPER_ADMIN role (not assignable here). CRUD lives at
// /api/super-admin/roles.

import { prisma } from "@/src/lib/prisma";
import { requireAuth, rbacError, rbacSuccess } from "@/src/lib/rbac";

export async function GET(request: Request) {
  try {
    const { errorResponse } = await requireAuth(request);
    if (errorResponse) return errorResponse;

    const roles = await prisma.role.findMany({
      where: { isSuperAdmin: false },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
    return rbacSuccess(roles);
  } catch (e) {
    console.error("list roles (public) error:", e);
    return rbacError("Internal server error", 500);
  }
}
