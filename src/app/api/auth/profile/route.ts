// GET /api/auth/profile — current user's public profile.

import { getAuthUser, ok, fail } from "@/src/lib/auth-tokens";

export async function GET(request: Request) {
  try {
    const user = await getAuthUser(request);
    if (!user) return fail("Unauthorized", 401);
    return ok(user);
  } catch (e: unknown) {
    console.error("profile error:", e);
    return fail("Internal server error", 500);
  }
}
