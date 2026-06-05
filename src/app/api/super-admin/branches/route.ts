// POST /api/super-admin/branches
// Super Admin only. Creates a Branch and assigns its base permission
// scope (BranchPermission). That scope is the ceiling for every Role a
// Branch Admin can later create inside the branch.

import { GlobalRole } from "@prisma/client";
import { prisma } from "@/src/lib/prisma";
import { requireGlobalRole, rbacError, rbacSuccess } from "@/src/lib/rbac";
import { RESOURCES, sanitizeActions } from "@/src/config/rbac";

interface ScopeInput {
  resource: string;
  actions: string[];
}

// GET — list all branches with their permission scope + counts.
export async function GET(request: Request) {
  try {
    const { errorResponse } = await requireGlobalRole(
      request,
      GlobalRole.SUPER_ADMIN,
    );
    if (errorResponse) return errorResponse;

    const branches = await prisma.branch.findMany({
      include: {
        branchPermissions: true,
        organization: { select: { id: true, name: true, code: true } },
        _count: { select: { users: true, roles: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return rbacSuccess(branches);
  } catch (e) {
    console.error("list branches error:", e);
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

    const body = await request.json();
    const { name, code, location, organizationId } = body;
    const permissions: ScopeInput[] = body.permissions ?? [];

    if (!name || !code || !organizationId) {
      return rbacError("name, code, and organizationId are required", 400);
    }

    // Validate resources and drop unknown actions.
    const cleanScope = permissions
      .filter((p) => (RESOURCES as readonly string[]).includes(p.resource))
      .map((p) => ({
        resource: p.resource,
        actions: sanitizeActions(p.actions ?? []),
      }));

    const branch = await prisma.branch.create({
      data: {
        name,
        code,
        location: location ?? "",
        organizationId,
        branchPermissions: {
          create: cleanScope,
        },
      },
      include: { branchPermissions: true },
    });

    return rbacSuccess(branch, 201);
  } catch (e: unknown) {
    // Unique violation on branch code
    if (typeof e === "object" && e && "code" in e && (e as { code: string }).code === "P2002") {
      return rbacError("A branch with this code already exists", 409);
    }
    console.error("create branch error:", e);
    return rbacError("Internal server error", 500);
  }
}
