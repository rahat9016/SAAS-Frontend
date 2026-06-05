// GET /api/actions — read-only action catalog for any authenticated user
// (used by the role permission matrix). CRUD lives at /api/super-admin/actions.

import { prisma } from "@/src/lib/prisma";
import { requireAuth, rbacError, rbacSuccess } from "@/src/lib/rbac";

export async function GET(request: Request) {
  try {
    const { errorResponse } = await requireAuth(request);
    if (errorResponse) return errorResponse;

    const actions = await prisma.action.findMany({ orderBy: { createdAt: "asc" } });
    return rbacSuccess(actions);
  } catch (e) {
    console.error("list actions (public) error:", e);
    return rbacError("Internal server error", 500);
  }
}
