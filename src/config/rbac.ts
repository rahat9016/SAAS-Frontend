// ─── RBAC/ABAC Configuration ──────────────────────────────────────
// Resources are a fixed config list (routes/modules). Actions are
// DYNAMIC — managed in the `actions` table and created by super admin.
// An action is just its key (e.g. "create", "read", "approve").

export type Action = string;

// Default action keys seeded into the `actions` table on first run.
// Kept here only as the seed source + delete-protection list.
export const BUILT_IN_ACTIONS = [
  "create",
  "read",
  "update",
  "delete",
  "export",
] as const;

// Resources = protected routes/modules. UI button visibility and API
// route access are both derived from {resource, action} pairs.
export const RESOURCES = [
  "orders",
  "products",
  "customers",
  "payments",
  "branches",
  "users",
  "roles",
  "actions",
  "reports",
] as const;
export type Resource = (typeof RESOURCES)[number];

// Maps each resource to the admin route it guards. Used by the access API
// to tell the client which routes a user can open + their allowed actions.
export const RESOURCE_ROUTES: Record<string, string> = {
  orders: "/admin/orders",
  products: "/admin/products",
  customers: "/admin/users",
  payments: "/admin/finance",
  branches: "/admin/rbac/branches",
  users: "/admin/rbac/users",
  roles: "/admin/rbac/roles",
  actions: "/admin/rbac/actions",
  reports: "/admin/dashboard",
};

// O(1) lookup map shape returned by /api/auth/permissions.
export type PermissionMap = Record<string, Record<string, boolean>>;

/** Per-resource baseline with every given action key false. */
export function emptyActions(actionKeys: string[]): Record<string, boolean> {
  return actionKeys.reduce(
    (acc, a) => ({ ...acc, [a]: false }),
    {} as Record<string, boolean>,
  );
}

/** Per-resource map with every given action key true (super admin). */
export function allActions(actionKeys: string[]): Record<string, boolean> {
  return actionKeys.reduce(
    (acc, a) => ({ ...acc, [a]: true }),
    {} as Record<string, boolean>,
  );
}

/** Keep only action keys that exist in the allowed (dynamic) set. */
export function sanitizeActions(
  actions: string[],
  allowedKeys: string[],
): string[] {
  const set = new Set(allowedKeys);
  return actions.filter((a) => set.has(a));
}
