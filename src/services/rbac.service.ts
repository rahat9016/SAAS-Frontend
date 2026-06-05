import { authKey } from "@/src/constants/auth/storageKey";
import { getCookies } from "@/src/utils/local-storage";
import type { PermissionMap } from "@/src/config/rbac";
import type { RbacUserInfo } from "@/src/lib/redux/features/rbac/rbacTypes";

export interface RbacPermissionsResponse {
  user: RbacUserInfo;
  permissions: PermissionMap;
}

/**
 * GET /api/auth/permissions
 * This endpoint returns a bare { user, permissions } body (not the usual
 * { data } envelope), so it is fetched directly rather than through the
 * axios response interceptor (which unwraps `response.data.data`).
 */
export async function fetchRbacPermissions(): Promise<RbacPermissionsResponse> {
  const token = getCookies(authKey);
  const res = await fetch("/api/auth/permissions", {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) {
    throw new Error(`Failed to load permissions (${res.status})`);
  }
  return res.json();
}
