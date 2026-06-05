export enum UserRole {
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
  USER = "USER",
  BRANCH = "BRANCH",
  BRANCH_USER = "BRANCH_USER",
  BRANCH_MODERATOR = "BRANCH_MODERATOR",
  DESIGN_TEAM = "DESIGN_TEAM",
  PRODUCTION_TEAM = "PRODUCTION_TEAM",
  INVENTORY_TEAM = "INVENTORY_TEAM",
}

const ADMIN_ROLES: string[] = [
  UserRole.ADMIN,
  UserRole.SUPER_ADMIN,
  UserRole.BRANCH,
  UserRole.BRANCH_USER,
  UserRole.BRANCH_MODERATOR,
  UserRole.DESIGN_TEAM,
  UserRole.PRODUCTION_TEAM,
  UserRole.INVENTORY_TEAM,
];

export function isAdminRole(role?: string | null): boolean {
  if (!role) return false;
  return ADMIN_ROLES.includes(role.toUpperCase());
}
