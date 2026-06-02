import { prisma } from "@/src/lib/prisma";
import { requireRole, success, error } from "@/src/lib/plm-api";

export async function GET(request: Request) {
  try {
    const { errorResponse } = await requireRole(request, "SUPER_ADMIN");
    if (errorResponse) return errorResponse;

    const roles = await prisma.role.findMany({
      include: {
        permissions: { include: { permission: true } },
        _count: { select: { userRoles: true } },
      },
      orderBy: { createdAt: "asc" },
    });

    return success(roles.map((r) => ({
      id: r.id, name: r.name, description: r.description, isBuiltIn: r.isBuiltIn,
      permissions: r.permissions.map((rp) => rp.permission.key),
      userCount: r._count.userRoles,
      createdAt: r.createdAt.toISOString(),
    })));
  } catch (e: unknown) {
    console.error("Role list error:", e);
    return error("Internal server error", 500);
  }
}

export async function POST(request: Request) {
  try {
    const { user, errorResponse } = await requireRole(request, "SUPER_ADMIN");
    if (errorResponse) return errorResponse;

    const body = await request.json();
    const { name, description, permissionKeys = [] } = body;
    if (!name) return error("name is required", 400);

    const role = await prisma.role.create({
      data: { name, description: description || "", isBuiltIn: false, createdBy: user!.id },
    });

    // Assign permissions
    for (const key of permissionKeys) {
      const perm = await prisma.permission.findUnique({ where: { key } });
      if (perm) {
        await prisma.rolePermission.create({ data: { roleId: role.id, permissionId: perm.id } });
      }
    }

    return success(role);
  } catch (e: unknown) {
    console.error("Role create error:", e);
    return error("Internal server error", 500);
  }
}
