import { isAdminRole } from "@/src/utils/UserRoleEnum";
import { createSlice } from "@reduxjs/toolkit";
import { AppRole, IInitialState, PermissionMap } from "./permissionTypes";

const userPermissions: PermissionMap = {
  canAccessAdmin: false,
  canAddToCart: true,
  canViewOwnOrders: true,
  canCheckout: true,
};

const adminPermissions: PermissionMap = {
  canAccessAdmin: true,
  canAddToCart: false,
  canViewOwnOrders: false,
  canCheckout: false,
};

const guestPermissions: PermissionMap = {
  canAccessAdmin: false,
  canAddToCart: false,
  canViewOwnOrders: false,
  canCheckout: false,
};

function normalizeRole(role?: string | null): AppRole {
  if (!role) return "GUEST";
  const upper = role.toUpperCase();
  if (upper === "SUPER_ADMIN") return "SUPER_ADMIN";
  if (upper === "ADMIN") return "ADMIN";
  if (upper === "USER") return "USER";
  return "GUEST";
}

function getPermissionsByRole(role: AppRole): PermissionMap {
  if (role === "SUPER_ADMIN" || role === "ADMIN") return adminPermissions;
  if (role === "USER") return userPermissions;
  return guestPermissions;
}

const initialState: IInitialState = {
  role: "GUEST",
  permissions: guestPermissions,
};

const permissionSlice = createSlice({
  name: "permission",
  initialState,
  reducers: {
    setRolePermissions: (state, action) => {
      const normalizedRole = normalizeRole(action.payload);
      state.role = normalizedRole;
      state.permissions = getPermissionsByRole(normalizedRole);
    },
    setPermissionsFromRole: (state, action) => {
      const normalizedRole = normalizeRole(action.payload);
      state.role = normalizedRole;
      state.permissions = getPermissionsByRole(normalizedRole);
    },
    clearRolePermissions: (state) => {
      state.role = "GUEST";
      state.permissions = guestPermissions;
    },
  },
});

export const {
  setRolePermissions,
  setPermissionsFromRole,
  clearRolePermissions,
} = permissionSlice.actions;

export const permissionHelpers = {
  normalizeRole,
  getPermissionsByRole,
  isAdminRole,
};

export default permissionSlice.reducer;
