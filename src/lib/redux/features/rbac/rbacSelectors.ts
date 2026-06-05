import { RootState } from "../../store";
import type { Action } from "@/src/config/rbac";

export const selectRbac = (state: RootState) => state.rbac;
export const selectRbacUser = (state: RootState) => state.rbac.user;
export const selectRbacLoaded = (state: RootState) => state.rbac.loaded;

export const selectIsSuperAdmin = (state: RootState) =>
  state.rbac.user.isSuperAdmin;

/** Curried selector: can the user perform `action` on `resource`? */
export const selectCan =
  (resource: string, action: Action) =>
  (state: RootState): boolean =>
    state.rbac.permissions[resource]?.[action] ?? false;
