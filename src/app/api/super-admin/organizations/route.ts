// /api/super-admin/organizations
//   GET  → list organizations (for the branch-create org selector)
//   POST → create an organization
// Super Admin only.

import { GlobalRole } from "@prisma/client";
import { prisma } from "@/src/lib/prisma";
import { requireGlobalRole, rbacError, rbacSuccess } from "@/src/lib/rbac";

export async function GET(request: Request) {
  try {
    const { errorResponse } = await requireGlobalRole(
      request,
      GlobalRole.SUPER_ADMIN,
    );
    if (errorResponse) return errorResponse;

    const orgs = await prisma.organization.findMany({
      select: { id: true, name: true, code: true, _count: { select: { branches: true } } },
      orderBy: { createdAt: "desc" },
    });
    return rbacSuccess(orgs);
  } catch (e) {
    console.error("list orgs error:", e);
    return rbacError("Internal server error", 500);
  }
}

export async function POST(request: Request) {
  try {
    const { errorResponse } = await requireGlobalRole(
      request,
      GlobalRole.SUPER_ADMIN,
    );
    if (errorResponse) return errorResponse;

    const { name, code } = await request.json();
    if (!name || !code) return rbacError("name and code are required", 400);

    const org = await prisma.organization.create({ data: { name, code } });
    return rbacSuccess(org, 201);
  } catch (e: unknown) {
    if (typeof e === "object" && e && "code" in e && (e as { code: string }).code === "P2002") {
      return rbacError("An organization with this code already exists", 409);
    }
    console.error("create org error:", e);
    return rbacError("Internal server error", 500);
  }
}
