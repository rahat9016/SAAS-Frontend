import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { error, success } from "@/src/lib/plm-api";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        userRoles: {
          include: {
            role: { include: { permissions: { include: { permission: true } } } },
          },
        },
        branch: true,
        organization: true,
      },
    });

    if (!user) {
      return error("User not found", 404);
    }

    const roles = user.userRoles.map((ur) => ur.role.name);
    const permissions = [
      ...new Set(
        user.userRoles.flatMap((ur) =>
          ur.role.permissions.map((rp) => rp.permission.key)
        )
      ),
    ];

    // Split name into first and last name for IUserInformation compatibility
    const nameParts = user.name.split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const userInformation = {
      id: user.id,
      email: user.email,
      firstName,
      lastName,
      phone: null,
      profilePicture: user.avatar || null,
      isVerified: true,
      status: "ACTIVE",
      role: roles[0] || "user", // Main app expects a single role string
      plmRoles: roles,
      plmPermissions: permissions,
      branchId: user.branchId,
      branchName: user.branch?.name || null,
      organizationId: user.organizationId,
      organizationName: user.organization?.name || null,
    };

    return success(userInformation);
  } catch (e: unknown) {
    console.error("Fetch user error:", e);
    return error("Internal server error", 500);
  }
}
