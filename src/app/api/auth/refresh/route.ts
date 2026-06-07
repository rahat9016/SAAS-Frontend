// POST /api/auth/refresh
// Accepts a refresh token, verifies it, re-loads the user, issues fresh tokens.

import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { verifyToken, signTokens, fail } from "@/src/lib/auth-tokens";

export async function POST(request: Request) {
  try {
    const { refreshToken } = await request.json();
    if (!refreshToken) return fail("refreshToken is required", 400);

    const decoded = verifyToken(refreshToken);
    if (!decoded) return fail("Invalid or expired refresh token", 401);

    const user = await prisma.user.findUnique({ where: { id: decoded.sub } });
    if (!user) return fail("User no longer exists", 401);

    const tokens = signTokens({
      sub: user.id,
      email: user.email,
      name: [user.firstName, user.lastName].filter(Boolean).join(" "),
      role: user.role,
      branchId: user.branchId,
    });

    return NextResponse.json({ data: tokens });
  } catch (e: unknown) {
    console.error("refresh error:", e);
    return fail("Internal server error", 500);
  }
}
