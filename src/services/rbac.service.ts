import type { PermissionMap } from "@/src/config/rbac";
import { mockRbacSession } from "@/src/data/rbac/mockRbacSession";
import type { RbacUserInfo } from "@/src/lib/redux/features/rbac/rbacTypes";

export interface RbacPermissionsResponse {
  user: RbacUserInfo;
  permissions: PermissionMap;
}

/**
 * GET /api/auth/permissions
 *
 * TODO: the real call is kept below in `fetchRbacPermissionsFromApi` — swap it
 * back in once the RBAC backend is live. Until then this resolves a mock super
 * admin session so RbacRouteGuard lets the dummy-data pages render.
 */
export async function fetchRbacPermissions(): Promise<RbacPermissionsResponse> {
  return mockRbacSession;
}

/**
 * The real endpoint. It returns a bare { user, permissions } body (not the
 * usual { data } envelope), so it is fetched directly rather than through the
 * axios response interceptor (which unwraps `response.data.data`).
 */
export async function fetchRbacPermissionsFromApi(): Promise<RbacPermissionsResponse> {
  const { authKey } = await import("@/src/constants/auth/storageKey");
  const { getCookies } = await import("@/src/utils/local-storage");
  const token = getCookies(authKey);
  const res = await fetch("/api/auth/permissions", {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) {
    throw new Error(`Failed to load permissions (${res.status})`);
  }
  return res.json();
}
