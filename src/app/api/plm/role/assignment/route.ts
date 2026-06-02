import { prisma } from "@/src/lib/prisma";
import { requireRole, success, error } from "@/src/lib/plm-api";

export async function GET(request: Request) {
  try {
    const { errorResponse } = await requireRole(request, "SUPER_ADMIN");
    if (errorResponse) return errorResponse;

    const assignments = await prisma.userRole.findMany({
      include: {
        user: { select: { id: true, name: true, email: true, avatar: true, branchId: true, branch: { select: { name: true } } } },
        role: { select: { id: true, name: true } },
      },
      orderBy: { assignedAt: "desc" },
    });

    // Group by user
    const byUser: Record<string, { userId: string; userName: string; userEmail: string; userAvatar: string | null; branchId: string | null; branchName: string | null; roles: { id: string; name: string }[]; assignedAt: string }> = {};
    for (const a of assignments) {
      if (!byUser[a.user.id]) {
        byUser[a.user.id] = {
          userId: a.user.id, userName: a.user.name, userEmail: a.user.email,
          userAvatar: a.user.avatar, branchId: a.user.branchId,
          branchName: a.user.branch?.name || null,
          roles: [], assignedAt: a.assignedAt.toISOString(),
        };
      }
      byUser[a.user.id].roles.push({ id: a.role.id, name: a.role.name });
    }

    return success(Object.values(byUser));
  } catch (e: unknown) {
    console.error("Assignment list error:", e);
    return error("Internal server error", 500);
  }
}

export async function POST(request: Request) {
  try {
    const { user, errorResponse } = await requireRole(request, "SUPER_ADMIN");
    if (errorResponse) return errorResponse;

    const body = await request.json();
    const { userId, roleIds = [], branchId, userEmail } = body;

    let targetUserId = userId;

    if (!targetUserId) {
      if (!userEmail) {
        return error("userId or userEmail is required", 400);
      }
      // Only find existing user — do NOT auto-create with default password
      const existingUser = await prisma.user.findUnique({ where: { email: userEmail } });
      if (!existingUser) {
        return error("User not found. Please create the user account first before assigning roles.", 404);
      }
      if (branchId !== undefined) {
        await prisma.user.update({ where: { id: existingUser.id }, data: { branchId: branchId || null } });
      }
      targetUserId = existingUser.id;
    } else {
      // Verify user exists
      const existingUser = await prisma.user.findUnique({ where: { id: targetUserId } });
      if (!existingUser) {
        return error("User not found", 404);
      }
      // Update branch if provided for existing user
      if (branchId !== undefined) {
        await prisma.user.update({ where: { id: targetUserId }, data: { branchId: branchId || null } });
      }
    }

    if (roleIds.length === 0) return error("roleIds are required", 400);

    // Remove existing role assignments
    await prisma.userRole.deleteMany({ where: { userId: targetUserId } });

    // Create new assignments
    for (const roleId of roleIds) {
      await prisma.userRole.create({
        data: { userId: targetUserId, roleId, assignedBy: user!.id },
      });
    }

    return success({ message: "Roles assigned successfully" });
  } catch (e: unknown) {
    console.error("Assignment create error:", e);
    return error("Internal server error", 500);
  }
}

export async function DELETE(request: Request) {
  try {
    const { errorResponse } = await requireRole(request, "SUPER_ADMIN");
    if (errorResponse) return errorResponse;

    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");
    if (!userId) return error("userId is required", 400);

    // Remove existing role assignments
    await prisma.userRole.deleteMany({ where: { userId } });

    return success({ message: "Roles revoked successfully" });
  } catch (e: unknown) {
    console.error("Assignment revoke error:", e);
    return error("Internal server error", 500);
  }
}
