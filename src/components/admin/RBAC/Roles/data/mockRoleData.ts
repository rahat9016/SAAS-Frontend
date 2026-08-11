import { RbacRoleItem } from "../types";

// Local role catalogue used until /api/super-admin/roles is live.
// SUPER_ADMIN and ADMIN are flagged built-in, so the table locks their
// edit/delete buttons exactly as the API-backed version did.
export const mockRolesList: RbacRoleItem[] = [
  {
    id: "ROLE-1001",
    name: "SUPER_ADMIN",
    isSuperAdmin: true,
    isBuiltIn: true,
    _count: { users: 1 },
    createdAt: "2025-08-01",
  },
  {
    id: "ROLE-1002",
    name: "ADMIN",
    isSuperAdmin: false,
    isBuiltIn: true,
    _count: { users: 3 },
    createdAt: "2025-08-01",
  },
  {
    id: "ROLE-1003",
    name: "BRANCH_ADMIN",
    isSuperAdmin: false,
    isBuiltIn: false,
    _count: { users: 6 },
    createdAt: "2025-09-22",
  },
  {
    id: "ROLE-1004",
    name: "MERCHANDISER",
    isSuperAdmin: false,
    isBuiltIn: false,
    _count: { users: 12 },
    createdAt: "2025-10-30",
  },
  {
    id: "ROLE-1005",
    name: "DESIGN_TEAM",
    isSuperAdmin: false,
    isBuiltIn: false,
    _count: { users: 8 },
    createdAt: "2025-12-05",
  },
  {
    id: "ROLE-1006",
    name: "PRODUCTION_TEAM",
    isSuperAdmin: false,
    isBuiltIn: false,
    _count: { users: 9 },
    createdAt: "2026-01-19",
  },
  {
    id: "ROLE-1007",
    name: "STORE_MANAGER",
    isSuperAdmin: false,
    isBuiltIn: false,
    _count: { users: 4 },
    createdAt: "2026-03-02",
  },
];
