import { requireAuth, success, error } from "@/src/lib/plm-api";

export async function GET(request: Request) {
  try {
    const { user, errorResponse } = await requireAuth(request);
    if (errorResponse) return errorResponse;
    return success(user);
  } catch (e: unknown) {
    console.error("Profile error:", e);
    return error("Internal server error", 500);
  }
}
