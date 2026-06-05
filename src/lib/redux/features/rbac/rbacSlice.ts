import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IRbacState, RbacUserInfo } from "./rbacTypes";
import { PermissionMap } from "@/src/config/rbac";

const initialState: IRbacState = {
  loaded: false,
  user: { id: "", role: "", branchId: null },
  permissions: {},
};

const rbacSlice = createSlice({
  name: "rbac",
  initialState,
  reducers: {
    // Hydrated from GET /api/auth/permissions
    setRbacPermissions: (
      state,
      action: PayloadAction<{ user: RbacUserInfo; permissions: PermissionMap }>,
    ) => {
      state.user = action.payload.user;
      state.permissions = action.payload.permissions;
      state.loaded = true;
    },
    clearRbacPermissions: () => initialState,
  },
});

export const { setRbacPermissions, clearRbacPermissions } = rbacSlice.actions;
export default rbacSlice.reducer;
