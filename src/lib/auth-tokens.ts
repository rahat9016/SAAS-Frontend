// ─── Auth Token Helpers ──────────────────────────────────────────
// JWT signing/verification + JSON response helpers for the auth and
// user route handlers. Independent of any domain (formerly in plm-api).

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/src/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "plm-super-secret-key";

// ─── Response helpers ({ data } envelope expected by the frontend) ──

export function ok<T>(data: T, meta?: Record<string, unknown>) {
  return NextResponse.json({ data, ...(meta ? { meta } : {}) });
}

export function fail(message: string, status = 400) {
  return NextResponse.json({ statusCode: status, message }, { status });
}

// ─── Token payload (identity + global role) ───────────────────────

export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  role: string; // Roles enum
  branchId: string | null;
}

export function signTokens(payload: JwtPayload) {
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
  const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
  return { accessToken, refreshToken };
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

/** Verify the Bearer token and load the user's public profile. */
export async function getAuthUser(request: Request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const decoded = verifyToken(authHeader.slice(7));
  if (!decoded) return null;

  const user = await prisma.user.findUnique({
    where: { id: decoded.sub },
    include: { branch: true },
  });
  if (!user) return null;

  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    name: [user.firstName, user.lastName].filter(Boolean).join(" "),
    email: user.email,
    phone: user.phone,
    profilePicture: user.profilePicture,
    role: user.role,
    status: user.status,
    branchId: user.branchId,
    branchCode: user.branch?.code || null,
  };
}
