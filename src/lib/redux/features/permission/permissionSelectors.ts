import { RootState } from "../../store";

export const selectRolePermissions = (state: RootState) => state.permission;

export const selectCanAccessAdmin = (state: RootState) =>
  state.permission.permissions.canAccessAdmin;

export const selectCanAddToCart = (state: RootState) =>
  state.permission.permissions.canAddToCart;

export const selectCanViewOwnOrders = (state: RootState) =>
  state.permission.permissions.canViewOwnOrders;

export const selectCanCheckout = (state: RootState) =>
  state.permission.permissions.canCheckout;
