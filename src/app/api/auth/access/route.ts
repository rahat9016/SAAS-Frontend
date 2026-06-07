// GET /api/auth/access
// Per-user access summary: which routes the user can open and which
// actions they have on each. Derived from the DB (token = identity only).
//
// Response (envelope so the frontend useGet/axios unwrap works):
//   { data: {
//       user: { id, isSuperAdmin, branchId },
//       access: [ { resource, route, actions: string[] }, ... ]   // granted only
//   } }

import {
  getRbacUser,
  buildPermissionMap,
  getActionKeys,
  rbacError,
  rbacSuccess,
  RESOURCES,
} from "@/src/lib/rbac";
import { RESOURCE_ROUTES } from "@/src/config/rbac";

export async function GET(request: Request) {
  try {
    const user = await getRbacUser(request);
    if (!user) return rbacError("Unauthorized", 401);

    const actionKeys = await getActionKeys();
    const map = buildPermissionMap(user, actionKeys);

    const access = RESOURCES.map((resource) => {
      const granted = Object.entries(map[resource] ?? {})
        .filter(([, allowed]) => allowed)
        .map(([action]) => action);
      return { resource, route: RESOURCE_ROUTES[resource] ?? null, actions: granted };
    }).filter((entry) => entry.actions.length > 0);

    return rbacSuccess({
      user: { id: user.id, role: user.role, branchId: user.branchId },
      access,
    });
  } catch (e) {
    console.error("access error:", e);
    return rbacError("Internal server error", 500);
  }
}
