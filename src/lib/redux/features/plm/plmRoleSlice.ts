import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PlmPermission, PLM_ROLE_PERMISSIONS } from "@/src/types/plm/plmPermissions";
import { PlmRole } from "@/src/types/plm/productLifecycleTypes";

// ─── Custom Role (dynamically created by Super Admin) ─────────────────
export interface IPlmCustomRole {
  id: string;
  name: string;
  description: string;
  permissions: PlmPermission[];
  isBuiltIn: boolean; // built-in roles (SUPER_ADMIN, etc.) cannot be deleted
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// ─── User → Role Assignment ────────────────────────────────────────────
export interface IUserRoleAssignment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  plmRoles: PlmRole[];
  branchId: string | null;
  branchName: string | null;
  assignedBy: string;
  assignedAt: string;
}

// ─── State ────────────────────────────────────────────────────────────
export interface IPlmRoleState {
  customRoles: IPlmCustomRole[];
  userAssignments: IUserRoleAssignment[];
}

// ─── Seed built-in roles from the static RBAC matrix ─────────────────
const BUILT_IN_ROLES: IPlmCustomRole[] = [
  {
    id: "builtin-super-admin",
    name: "Super Admin",
    description: "Full access to all branches, approvals, and management",
    permissions: PLM_ROLE_PERMISSIONS["SUPER_ADMIN"],
    isBuiltIn: true,
    createdBy: "system",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "builtin-branch-moderator",
    name: "Branch Moderator",
    description: "Reviews and approves design submissions for an assigned branch",
    permissions: PLM_ROLE_PERMISSIONS["BRANCH_MODERATOR"],
    isBuiltIn: true,
    createdBy: "system",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "builtin-design-team",
    name: "Design Team",
    description: "Creates and submits product designs",
    permissions: PLM_ROLE_PERMISSIONS["DESIGN_TEAM"],
    isBuiltIn: true,
    createdBy: "system",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "builtin-production-team",
    name: "Production Team",
    description: "Manages production queue and worksheets",
    permissions: PLM_ROLE_PERMISSIONS["PRODUCTION_TEAM"],
    isBuiltIn: true,
    createdBy: "system",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "builtin-inventory-team",
    name: "Inventory Team",
    description: "Manages raw materials and stock allocation",
    permissions: PLM_ROLE_PERMISSIONS["INVENTORY_TEAM"],
    isBuiltIn: true,
    createdBy: "system",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
];

// ─── Mock seed assignments ─────────────────────────────────────────────
const SEED_ASSIGNMENTS: IUserRoleAssignment[] = [
  {
    id: "assign-001",
    userId: "user-sa-001",
    userName: "Super Admin",
    userEmail: "admin@xplaza.com",
    plmRoles: ["SUPER_ADMIN"],
    branchId: null,
    branchName: null,
    assignedBy: "system",
    assignedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "assign-002",
    userId: "user-mod-001",
    userName: "Kamal Hossain",
    userEmail: "kamal@xplaza.com",
    plmRoles: ["BRANCH_MODERATOR"],
    branchId: "branch-dhk-01",
    branchName: "Dhaka Main",
    assignedBy: "admin@xplaza.com",
    assignedAt: "2024-02-10T08:00:00Z",
  },
  {
    id: "assign-003",
    userId: "user-design-001",
    userName: "Fatima Rahman",
    userEmail: "fatima@xplaza.com",
    plmRoles: ["DESIGN_TEAM"],
    branchId: "branch-dhk-01",
    branchName: "Dhaka Main",
    assignedBy: "admin@xplaza.com",
    assignedAt: "2024-02-15T09:30:00Z",
  },
  {
    id: "assign-004",
    userId: "user-multi-001",
    userName: "Nazia Akter",
    userEmail: "nazia@xplaza.com",
    plmRoles: ["BRANCH_MODERATOR", "DESIGN_TEAM"],
    branchId: "branch-dhk-01",
    branchName: "Dhaka Main",
    assignedBy: "admin@xplaza.com",
    assignedAt: "2024-03-01T10:00:00Z",
  },
  {
    id: "assign-005",
    userId: "user-prod-001",
    userName: "Sohel Mia",
    userEmail: "sohel@xplaza.com",
    plmRoles: ["PRODUCTION_TEAM"],
    branchId: "branch-dhk-01",
    branchName: "Dhaka Main",
    assignedBy: "admin@xplaza.com",
    assignedAt: "2024-03-05T11:00:00Z",
  },
];

const initialState: IPlmRoleState = {
  customRoles: BUILT_IN_ROLES,
  userAssignments: SEED_ASSIGNMENTS,
};

const plmRoleSlice = createSlice({
  name: "plmRoles",
  initialState,
  reducers: {
    // ─── Role CRUD ──────────────────────────────────────────────────
    createCustomRole: (
      state,
      action: PayloadAction<Omit<IPlmCustomRole, "id" | "isBuiltIn" | "createdAt" | "updatedAt">>
    ) => {
      const now = new Date().toISOString();
      state.customRoles.push({
        ...action.payload,
        id: `custom-${Date.now()}`,
        isBuiltIn: false,
        createdAt: now,
        updatedAt: now,
      });
    },

    updateCustomRole: (
      state,
      action: PayloadAction<{
        id: string;
        name: string;
        description: string;
        permissions: PlmPermission[];
      }>
    ) => {
      const role = state.customRoles.find((r) => r.id === action.payload.id);
      if (role && !role.isBuiltIn) {
        role.name = action.payload.name;
        role.description = action.payload.description;
        role.permissions = action.payload.permissions;
        role.updatedAt = new Date().toISOString();
      }
    },

    deleteCustomRole: (state, action: PayloadAction<string>) => {
      state.customRoles = state.customRoles.filter(
        (r) => r.id !== action.payload || r.isBuiltIn
      );
    },

    // ─── User-Role Assignment ────────────────────────────────────────
    assignRoleToUser: (
      state,
      action: PayloadAction<Omit<IUserRoleAssignment, "id" | "assignedAt">>
    ) => {
      // Remove existing assignment for this user (one assignment per user)
      state.userAssignments = state.userAssignments.filter(
        (a) => a.userId !== action.payload.userId
      );
      state.userAssignments.push({
        ...action.payload,
        id: `assign-${Date.now()}`,
        assignedAt: new Date().toISOString(),
      });
    },

    updateUserAssignment: (
      state,
      action: PayloadAction<{
        assignmentId: string;
        plmRoles: PlmRole[];
        branchId: string | null;
        branchName: string | null;
      }>
    ) => {
      const assignment = state.userAssignments.find(
        (a) => a.id === action.payload.assignmentId
      );
      if (assignment) {
        assignment.plmRoles = action.payload.plmRoles;
        assignment.branchId = action.payload.branchId;
        assignment.branchName = action.payload.branchName;
      }
    },

    revokeUserAssignment: (state, action: PayloadAction<string>) => {
      state.userAssignments = state.userAssignments.filter(
        (a) => a.id !== action.payload
      );
    },
  },
});

export const {
  createCustomRole,
  updateCustomRole,
  deleteCustomRole,
  assignRoleToUser,
  updateUserAssignment,
  revokeUserAssignment,
} = plmRoleSlice.actions;

export default plmRoleSlice.reducer;
