export type AppRole = "SUPER_ADMIN" | "ADMIN" | "USER" | "GUEST";

export interface PermissionMap {
  canAccessAdmin: boolean;
  canAddToCart: boolean;
  canViewOwnOrders: boolean;
  canCheckout: boolean;
}

export interface IInitialState {
  role: AppRole;
  permissions: PermissionMap;
}
