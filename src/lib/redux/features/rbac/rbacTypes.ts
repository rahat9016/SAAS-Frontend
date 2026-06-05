import type { Action, PermissionMap } from "@/src/config/rbac";

export type RbacGlobalRole = "SUPER_ADMIN" | "BRANCH_ADMIN" | "BRANCH_USER";

export interface RbacUserInfo {
  id: string;
  role: RbacGlobalRole | "";
  branchId: string | null;
}

export interface IRbacState {
  loaded: boolean;
  user: RbacUserInfo;
  // O(1) lookup: permissions[resource][action] === true
  permissions: PermissionMap;
}

export type { Action, PermissionMap };
