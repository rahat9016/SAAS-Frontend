import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { signTokens, error, loadUserWithPermissions } from "@/src/lib/plm-api";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return error("Email and password are required", 400);
    }

    const resolved = await loadUserWithPermissions({ email });
    if (!resolved) return error("Invalid credentials", 401);
    const { user, roles, permissions } = resolved;

    const valid = await bcryptjs.compare(password, user.password);
    if (!valid) return error("Password is incorrect", 401);

    const { accessToken, refreshToken } = signTokens({
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
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        },
      },
    });
  } catch (e: unknown) {
    console.error("Login error:", e);
    return error("Internal server error", 500);
  }
}
