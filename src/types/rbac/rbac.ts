import type { Action } from "@/src/config/rbac";

export interface RbacScopeEntry {
  id?: string;
  resource: string;
  actions: Action[];
}

export interface RbacOrganization {
  id: string;
  name: string;
  code: string;
  _count?: { branches: number };
}

export interface RbacBranch {
  id: string;
  name: string;
  code: string;
  location: string;
  isActive: boolean;
  organization?: { id: string; name: string; code: string };
  branchPermissions: RbacScopeEntry[];
  _count?: { users: number; roles: number };
  createdAt: string;
}

export type RbacRoleScope = "SUPER_ADMIN" | "BRANCH";

export interface RbacRole {
  id: string;
  name: string;
  description: string | null;
  scope: RbacRoleScope;
  branchId: string | null;
  resourcePermissions: RbacScopeEntry[];
  _count?: { directUsers: number };
  createdAt: string;
  actions?: string;
}

export interface RbacBranchUser {
  id: string;
  name: string | null;
  email: string;
  isSuperAdmin: boolean;
  branchId: string | null;
  role: { id: string; name: string } | null;
  createdAt: string;
  actions?: string;
}

/** Convert a scope/grant array into the matrix's keyed shape. */
export function scopeToMap(entries: RbacScopeEntry[]): Record<string, Action[]> {
  return entries.reduce(
    (acc, e) => ({ ...acc, [e.resource]: e.actions }),
    {} as Record<string, Action[]>,
  );
}

/** Convert the matrix's keyed shape back into a grant array. */
export function mapToScope(map: Record<string, Action[]>): RbacScopeEntry[] {
  return Object.entries(map)
    .filter(([, actions]) => actions.length > 0)
    .map(([resource, actions]) => ({ resource, actions }));
}
