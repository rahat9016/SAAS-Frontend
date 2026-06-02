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
const initialState: IPlmRoleState = {
  customRoles: [],
  userAssignments: [],
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
