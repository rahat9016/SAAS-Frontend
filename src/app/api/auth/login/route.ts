// POST /api/auth/login
// Validates credentials, issues access + refresh JWTs (identity + role).
// Permissions are resolved separately via /api/auth/permissions.

import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { prisma } from "@/src/lib/prisma";
import { signTokens, fail } from "@/src/lib/auth-tokens";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return fail("Email and password are required", 400);
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return fail("Invalid credentials", 401);
    if (user.status !== "ACTIVE") return fail("Account is inactive", 403);

    const valid = await bcryptjs.compare(password, user.password);
    if (!valid) return fail("Password is incorrect", 401);

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    const name = [user.firstName, user.lastName].filter(Boolean).join(" ");
    const { accessToken, refreshToken } = signTokens({
      sub: user.id,
      email: user.email,
      name,
      role: user.role,
      branchId: user.branchId,
    });

    return NextResponse.json({
      data: {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          profilePicture: user.profilePicture,
          role: user.role,
          branchId: user.branchId,
        },
      },
    });
  } catch (e: unknown) {
    console.error("login error:", e);
    return fail("Internal server error", 500);
  }
}
