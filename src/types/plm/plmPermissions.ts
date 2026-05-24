import { PlmRole } from "./productLifecycleTypes";

// ─── Granular PLM Permissions ───────────────────────────────────────
export type PlmPermission =
  // Branch management
  | "plm.branch.create"
  | "plm.branch.delete"
  | "plm.branch.view"
  // Design management
  | "plm.design.view"
  | "plm.design.create"
  | "plm.design.submit"
  | "plm.design.advance"
  // Moderation
  | "plm.moderation.review"
  | "plm.moderation.approve"
  | "plm.moderation.reject"
  | "plm.moderation.sendToAdmin"
  // Super Admin approval
  | "plm.approval.decide"
  // Production
  | "plm.production.view"
  | "plm.production.advance"
  // Inventory
  | "plm.inventory.view"
  | "plm.inventory.manage"
  // Dashboard
  | "plm.dashboard.view";

// ─── All permissions as array (used in matrix UI) ────────────────────
export const ALL_PLM_PERMISSIONS: PlmPermission[] = [
  "plm.dashboard.view",
  "plm.branch.view",
  "plm.branch.create",
  "plm.branch.delete",
  "plm.design.view",
  "plm.design.create",
  "plm.design.submit",
  "plm.design.advance",
  "plm.moderation.review",
  "plm.moderation.approve",
  "plm.moderation.reject",
  "plm.moderation.sendToAdmin",
  "plm.approval.decide",
  "plm.production.view",
  "plm.production.advance",
  "plm.inventory.view",
  "plm.inventory.manage",
];

// ─── RBAC: Role → Permissions Mapping ───────────────────────────────
export const PLM_ROLE_PERMISSIONS: Record<PlmRole, PlmPermission[]> = {
  SUPER_ADMIN: [
    "plm.branch.create",
    "plm.branch.delete",
    "plm.branch.view",
    "plm.design.view",
    "plm.approval.decide",
    "plm.production.view",
    "plm.inventory.view",
    "plm.dashboard.view",
  ],
  BRANCH_MODERATOR: [
    "plm.branch.view",
    "plm.design.view",
    "plm.moderation.review",
    "plm.moderation.approve",
    "plm.moderation.reject",
    "plm.moderation.sendToAdmin",
  ],
  DESIGN_TEAM: [
    "plm.design.view",
    "plm.design.create",
    "plm.design.submit",
    "plm.design.advance",
  ],
  PRODUCTION_TEAM: [
    "plm.design.view",
    "plm.production.view",
    "plm.production.advance",
  ],
  INVENTORY_TEAM: [
    "plm.production.view",
    "plm.inventory.view",
    "plm.inventory.manage",
  ],
};

// ─── Route → Permission Mapping ─────────────────────────────────────
export const PLM_ROUTE_PERMISSIONS: Record<string, PlmPermission> = {
  "/admin/plm": "plm.dashboard.view",
  "/admin/plm/designs": "plm.design.view",
  "/admin/plm/designs/create": "plm.design.create",
  "/admin/plm/moderation": "plm.moderation.review",
  "/admin/plm/approvals": "plm.approval.decide",
  "/admin/plm/production": "plm.production.view",
  "/admin/plm/inventory": "plm.inventory.view",
  "/admin/plm/branches": "plm.branch.view",
};

// ─── ABAC Context ───────────────────────────────────────────────────
export interface PlmAbacContext {
  userId: string;
  userName: string;
  roles: PlmRole[];
  branchId: string | null;
  branchName: string | null;
}

// ─── RBAC Helper: check if a set of roles grants a permission ───────
export function hasPermission(
  roles: PlmRole[],
  permission: PlmPermission
): boolean {
  return roles.some((role) =>
    PLM_ROLE_PERMISSIONS[role]?.includes(permission)
  );
}

// ─── RBAC Helper: check if roles can access a route ─────────────────
export function canAccessRoute(
  roles: PlmRole[],
  route: string
): boolean {
  // Design detail pages inherit from design.view
  if (route.match(/^\/admin\/plm\/designs\/[^/]+$/)) {
    return hasPermission(roles, "plm.design.view");
  }
  const requiredPermission = PLM_ROUTE_PERMISSIONS[route];
  if (!requiredPermission) return true; // No restriction defined
  return hasPermission(roles, requiredPermission);
}

// ─── RBAC Helper: get all permissions for a set of roles ────────────
export function getEffectivePermissions(
  roles: PlmRole[]
): PlmPermission[] {
  const perms = new Set<PlmPermission>();
  roles.forEach((role) => {
    PLM_ROLE_PERMISSIONS[role]?.forEach((p) => perms.add(p));
  });
  return Array.from(perms);
}

// ─── ABAC: Roles that are branch-scoped ─────────────────────────────
export const BRANCH_SCOPED_ROLES: PlmRole[] = [
  "BRANCH_MODERATOR",
  "DESIGN_TEAM",
  "PRODUCTION_TEAM",
  "INVENTORY_TEAM",
];

// ─── ABAC Helper: check if user's roles are all branch-scoped ───────
export function isBranchScoped(roles: PlmRole[]): boolean {
  // If user has SUPER_ADMIN, they are NOT branch-scoped
  if (roles.includes("SUPER_ADMIN")) return false;
  return roles.some((r) => BRANCH_SCOPED_ROLES.includes(r));
}

// ─── Preset User Profiles (for dev mode) ────────────────────────────
export interface PlmUserPreset {
  id: string;
  label: string;
  description: string;
  userId: string;
  userName: string;
  roles: PlmRole[];
  branchId: string | null;
  branchName: string | null;
}

export const PLM_USER_PRESETS: PlmUserPreset[] = [
  {
    id: "preset-super-admin",
    label: "Super Admin",
    description: "Full access to all branches and features",
    userId: "user-sa-001",
    userName: "Super Admin",
    roles: ["SUPER_ADMIN"],
    branchId: null,
    branchName: null,
  },
  {
    id: "preset-branch-moderator-dhaka",
    label: "Branch Moderator (Dhaka)",
    description: "Reviews & approves designs for Dhaka Main branch",
    userId: "user-mod-001",
    userName: "Kamal Hossain",
    roles: ["BRANCH_MODERATOR"],
    branchId: "branch-dhk-01",
    branchName: "Dhaka Main",
  },
  {
    id: "preset-design-team-dhaka",
    label: "Design Team (Dhaka)",
    description: "Creates designs for Dhaka Main branch",
    userId: "user-design-001",
    userName: "Fatima Rahman",
    roles: ["DESIGN_TEAM"],
    branchId: "branch-dhk-01",
    branchName: "Dhaka Main",
  },
  {
    id: "preset-production-dhaka",
    label: "Production Team (Dhaka)",
    description: "Manages production for Dhaka Main branch",
    userId: "user-prod-001",
    userName: "Sohel Mia",
    roles: ["PRODUCTION_TEAM"],
    branchId: "branch-dhk-01",
    branchName: "Dhaka Main",
  },
  {
    id: "preset-inventory",
    label: "Inventory Team",
    description: "Manages raw materials & stock",
    userId: "user-inv-001",
    userName: "Rafiq Khan",
    roles: ["INVENTORY_TEAM"],
    branchId: null,
    branchName: null,
  },
  {
    id: "preset-multi-mod-design",
    label: "Multi: Moderator + Design (Dhaka)",
    description: "Can both create and review designs",
    userId: "user-multi-001",
    userName: "Nazia Akter",
    roles: ["BRANCH_MODERATOR", "DESIGN_TEAM"],
    branchId: "branch-dhk-01",
    branchName: "Dhaka Main",
  },
  {
    id: "preset-multi-prod-inv",
    label: "Multi: Production + Inventory",
    description: "Manages production and raw materials",
    userId: "user-multi-002",
    userName: "Arif Hossain",
    roles: ["PRODUCTION_TEAM", "INVENTORY_TEAM"],
    branchId: "branch-dhk-01",
    branchName: "Dhaka Main",
  },
];
