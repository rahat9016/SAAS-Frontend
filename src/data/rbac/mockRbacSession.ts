import { mockActionsList } from "@/src/components/admin/RBAC/Actions/data/mockActionData";
import { RESOURCES, applicableActions, type PermissionMap } from "@/src/config/rbac";
import type { RbacUserInfo } from "@/src/lib/redux/features/rbac/rbacTypes";

// Stand-in for GET /api/auth/permissions while the RBAC backend is offline.
// Without this the guard sees an unauthenticated visitor and every RBAC page
// renders "Access Denied", so the dummy data behind them is unreachable.

const catalogKeys = mockActionsList.map((a) => a.key);

/** Every resource, every action it supports → true (super admin view). */
export const mockPermissionMap: PermissionMap = RESOURCES.reduce(
  (acc, resource) => ({
    ...acc,
    [resource.key]: applicableActions(resource.key, catalogKeys).reduce(
      (actions, key) => ({ ...actions, [key]: true }),
      {} as Record<string, boolean>
    ),
  }),
  {} as PermissionMap
);

export const mockRbacUserInfo: RbacUserInfo = {
  id: "RU-1001",
  isSuperAdmin: true,
  roleName: "SUPER_ADMIN",
  branchId: null,
};

export const mockRbacSession = {
  user: mockRbacUserInfo,
  permissions: mockPermissionMap,
};
