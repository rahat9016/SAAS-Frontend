// POST /api/auth/login
// Validates credentials, issues access + refresh JWTs carrying identity +
// global role. Permissions are resolved separately via /api/auth/permissions.

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

    const user = await prisma.user.findUnique({
      where: { email },
      include: { branch: true, organization: true },
    });
    if (!user) return fail("Invalid credentials", 401);

    const valid = await bcryptjs.compare(password, user.password);
    if (!valid) return fail("Password is incorrect", 401);

    const { accessToken, refreshToken } = signTokens({
      sub: user.id,
      email: user.email,
      name: user.name,
      isSuperAdmin: user.isSuperAdmin,
      branchId: user.branchId,
      organizationId: user.organizationId,
    });

    return NextResponse.json({
      data: {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          isSuperAdmin: user.isSuperAdmin,
        },
      },
    });
  } catch (e: unknown) {
    console.error("login error:", e);
    return fail("Internal server error", 500);
  }
}
