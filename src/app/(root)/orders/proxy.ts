import { isAdminRole } from "@/src/utils/UserRoleEnum";
import { NextRequest, NextResponse } from "next/server";

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split(".")[1];
    const decoded = Buffer.from(payload, "base64").toString("utf-8");
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export function GET(request: NextRequest) {
  return handleUserOnlyRoute(request);
}

function handleUserOnlyRoute(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;

  if (!accessToken) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const decoded = decodeJwtPayload(accessToken);
  const role = (decoded?.role as string) ?? undefined;

  if (isAdminRole(role)) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}
