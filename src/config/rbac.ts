// ─── RBAC/ABAC Configuration ──────────────────────────────────────
// Single source of truth for resources (routes/modules) and the
// action-based "attributes" (strictly CRUD-style, no condition logic).

export const ACTIONS = ["create", "read", "update", "delete", "export"] as const;
export type Action = (typeof ACTIONS)[number];

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
  "reports",
] as const;
export type Resource = (typeof RESOURCES)[number];

// O(1) lookup map shape returned by /api/auth/permissions.
export type PermissionMap = Record<string, Record<Action, boolean>>;

/** Every action false — used as a per-resource baseline. */
export function emptyActions(): Record<Action, boolean> {
  return ACTIONS.reduce(
    (acc, a) => ({ ...acc, [a]: false }),
    {} as Record<Action, boolean>,
  );
}

/** Every action true — used for SUPER_ADMIN. */
export function allActions(): Record<Action, boolean> {
  return ACTIONS.reduce(
    (acc, a) => ({ ...acc, [a]: true }),
    {} as Record<Action, boolean>,
  );
}

/** Reject unknown actions so bad data can't widen access. */
export function sanitizeActions(actions: string[]): Action[] {
  return actions.filter((a): a is Action =>
    (ACTIONS as readonly string[]).includes(a),
  );
}
