// GET /api/auth/permissions
// Returns the authenticated user's O(1) permission lookup map.
// Permissions are re-derived from the DB (token is identity-only).

import {
  getRbacUser,
  buildPermissionMap,
  getActionKeys,
  rbacError,
} from "@/src/lib/rbac";

export async function GET(request: Request) {
  try {
    const user = await getRbacUser(request);
    if (!user) return rbacError("Unauthorized", 401);

    const actionKeys = await getActionKeys();
    const permissions = buildPermissionMap(user, actionKeys);

    return Response.json({
      user: {
        id: user.id,
        isSuperAdmin: user.isSuperAdmin,
        branchId: user.branchId,
      },
      permissions,
    });
  } catch (e) {
    console.error("permissions error:", e);
    return rbacError("Internal server error", 500);
  }
}
