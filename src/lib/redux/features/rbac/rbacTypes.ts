import type { Action, PermissionMap } from "@/src/config/rbac";

export interface RbacUserInfo {
  id: string;
  isSuperAdmin: boolean;
  branchId: string | null;
}

export interface IRbacState {
  loaded: boolean;
  user: RbacUserInfo;
  // O(1) lookup: permissions[resource][action] === true
  permissions: PermissionMap;
}

export type { Action, PermissionMap };
