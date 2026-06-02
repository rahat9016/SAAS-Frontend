import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { verifyToken, signTokens, error } from "@/src/lib/plm-api";

/**
 * POST /api/plm/auth/refresh
 * Accepts a refresh token → verifies it → issues new access + refresh tokens.
 * The old refresh token is consumed (single-use rotation pattern).
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      return error("refreshToken is required", 400);
    }

    // Verify the refresh token
    const decoded = verifyToken(refreshToken);
    if (!decoded) {
      return error("Invalid or expired refresh token", 401);
    }

    // Fetch fresh user data from DB (ensure user still exists and roles are current)
    const user = await prisma.user.findUnique({
      where: { id: decoded.sub },
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
      return error("User no longer exists", 401);
    }

    const roles = user.userRoles.map((ur) => ur.role.name);
    const permissions = [
      ...new Set(
        user.userRoles.flatMap((ur) =>
          ur.role.permissions.map((rp) => rp.permission.key),
        ),
      ),
    ];

    // Issue new token pair (rotation)
    const tokens = signTokens({
      sub: user.id,
      email: user.email,
      name: user.name,
      roles,
      permissions,
      branchId: user.branchId,
      organizationId: user.organizationId,
    });

    return NextResponse.json({
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          roles,
          permissions,
          branchId: user.branchId,
          branchName: user.branch?.name || null,
          organizationId: user.organizationId,
          organizationName: user.organization?.name || null,
        },
      },
    });
  } catch (e: unknown) {
    console.error("Token refresh error:", e);
    return error("Internal server error", 500);
  }
}
