import type { Action } from "@/src/config/rbac";

export type RbacStatus = "ACTIVE" | "INACTIVE";

export interface RbacScopeEntry {
  id?: string;
  resource: string;
  actions: Action[];
}

/** Dynamic role (label/tier). Only SUPER_ADMIN is built-in/constant. */
export interface RbacRoleItem {
  id: string;
  name: string;
  isSuperAdmin: boolean;
  isBuiltIn: boolean;
  _count?: { users: number };
  createdAt: string;
  actions?: string;
}

export interface RbacBranch {
  id: string;
  code: string | null;
  contact: string | null;
  country: string | null;
  city: string | null;
  area: string | null;
  address: string | null;
  status: RbacStatus;
  _count?: { users: number };
  createdAt: string;
  actions?: string;
}

export interface RbacUser {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string;
  phone: string | null;
  role: { id: string; name: string; isSuperAdmin: boolean } | null;
  status: RbacStatus;
  gender?: string | null;
  dateOfBirth?: string | null;
  branchId: string | null;
  branch?: { id: string; code: string | null } | null;
  permissions: RbacScopeEntry[];
  createdAt: string;
  actions?: string;
}

/** Convert a grant array into the matrix's keyed shape. */
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
