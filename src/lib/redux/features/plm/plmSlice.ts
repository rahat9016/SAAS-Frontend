import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IPlmState, IPlmUserProfile } from "./plmTypes";
import {
  PlmRole,
  ProductStatus,
  IDesignSubmission,
  IStatusHistoryEntry,
  STATUS_TRANSITIONS,
  IBranch,
  IProductionWorksheet,
  IRawMaterial,
  IRawMaterialAllocation,
} from "@/src/types/plm/productLifecycleTypes";
const initialState: IPlmState = {
  userProfile: {
    id: "user-sa-001",
    name: "Super Admin",
    roles: ["SUPER_ADMIN"],
    permissions: [
      "plm.dashboard.view", "plm.branch.view", "plm.branch.create", "plm.branch.delete",
      "plm.design.view", "plm.approval.decide", "plm.production.view", "plm.inventory.view",
    ],
    branchId: null,
    branchName: null,
  },
  selectedBranchId: null,
  branches: [],
  designs: [],
  worksheets: [],
  rawMaterials: [],
  allocations: [],
};

const plmSlice = createSlice({
  name: "plm",
  initialState,
  reducers: {
    // ─── User Profile Management ──────────────────────────────────
    setUserProfile: (state, action: PayloadAction<IPlmUserProfile>) => {
      state.userProfile = action.payload;
      // Auto-set branch filter for branch-scoped users
      if (action.payload.branchId) {
        state.selectedBranchId = action.payload.branchId;
      } else {
        state.selectedBranchId = null;
      }
    },
    addUserRole: (state, action: PayloadAction<PlmRole>) => {
      if (!state.userProfile.roles.includes(action.payload)) {
        state.userProfile.roles.push(action.payload);
      }
    },
    removeUserRole: (state, action: PayloadAction<PlmRole>) => {
      state.userProfile.roles = state.userProfile.roles.filter(
        (r) => r !== action.payload
      );
    },
    setSelectedBranch: (state, action: PayloadAction<string | null>) => {
      state.selectedBranchId = action.payload;
    },

    // ─── Branch CRUD ──────────────────────────────────────────────
    addBranch: (state, action: PayloadAction<IBranch>) => {
      state.branches.push(action.payload);
    },
    deleteBranch: (state, action: PayloadAction<string>) => {
      state.branches = state.branches.filter(
        (b) => b.id !== action.payload
      );
    },

    // ─── Design CRUD ──────────────────────────────────────────────
    addDesign: (state, action: PayloadAction<IDesignSubmission>) => {
      state.designs.unshift(action.payload);
    },

    updateDesignStatus: (
      state,
      action: PayloadAction<{
        designId: string;
        newStatus: ProductStatus;
        changedBy: string;
        changedByRole: PlmRole;
        reason?: string;
      }>
    ) => {
      const { designId, newStatus, changedBy, changedByRole, reason } =
        action.payload;
      const design = state.designs.find((d) => d.id === designId);
      if (!design) return;

      // Validate transition
      const allowedTransitions = STATUS_TRANSITIONS[design.status];
      if (!allowedTransitions?.includes(newStatus)) return;

      const historyEntry: IStatusHistoryEntry = {
        id: `hist-${Date.now()}`,
        fromStatus: design.status,
        toStatus: newStatus,
        changedBy,
        changedByRole,
        reason,
        timestamp: new Date().toISOString(),
      };

      design.status = newStatus;
      design.statusHistory.push(historyEntry);
      design.updatedAt = new Date().toISOString();

      if (
        newStatus === ProductStatus.SUPER_ADMIN_REJECTED ||
        newStatus === ProductStatus.REDESIGN_REQUIRED
      ) {
        design.rejectionReason = reason;
      }
    },

    // ─── Moderator Batch Operations ───────────────────────────────
    moderatorApproveDesigns: (
      state,
      action: PayloadAction<{
        designIds: string[];
        moderatorName: string;
      }>
    ) => {
      const { designIds, moderatorName } = action.payload;
      designIds.forEach((id) => {
        const design = state.designs.find((d) => d.id === id);
        if (design && design.status === ProductStatus.MODERATOR_REVIEW) {
          design.status = ProductStatus.MODERATOR_APPROVED;
          design.statusHistory.push({
            id: `hist-${Date.now()}-${id}`,
            fromStatus: ProductStatus.MODERATOR_REVIEW,
            toStatus: ProductStatus.MODERATOR_APPROVED,
            changedBy: moderatorName,
            changedByRole: "BRANCH_MODERATOR",
            timestamp: new Date().toISOString(),
          });
          design.updatedAt = new Date().toISOString();
        }
      });
    },

    sendToSuperAdmin: (
      state,
      action: PayloadAction<{
        designIds: string[];
        moderatorName: string;
      }>
    ) => {
      const { designIds, moderatorName } = action.payload;
      designIds.forEach((id) => {
        const design = state.designs.find((d) => d.id === id);
        if (design && design.status === ProductStatus.MODERATOR_APPROVED) {
          design.status = ProductStatus.SUPER_ADMIN_REVIEW;
          design.statusHistory.push({
            id: `hist-${Date.now()}-${id}`,
            fromStatus: ProductStatus.MODERATOR_APPROVED,
            toStatus: ProductStatus.SUPER_ADMIN_REVIEW,
            changedBy: moderatorName,
            changedByRole: "BRANCH_MODERATOR",
            timestamp: new Date().toISOString(),
          });
          design.updatedAt = new Date().toISOString();
        }
      });
    },

    // ─── Moderator: handle items returned from admin ─────────────
    moderatorResubmitToAdmin: (
      state,
      action: PayloadAction<{
        designId: string;
        moderatorName: string;
      }>
    ) => {
      const design = state.designs.find(
        (d) => d.id === action.payload.designId
      );
      if (
        design &&
        design.status === ProductStatus.SUPER_ADMIN_REJECTED
      ) {
        design.status = ProductStatus.MODERATOR_REVIEW;
        design.rejectionReason = undefined;
        design.statusHistory.push({
          id: `hist-${Date.now()}-resubmit`,
          fromStatus: ProductStatus.SUPER_ADMIN_REJECTED,
          toStatus: ProductStatus.MODERATOR_REVIEW,
          changedBy: action.payload.moderatorName,
          changedByRole: "BRANCH_MODERATOR",
          reason: "Resubmitted after admin rejection",
          timestamp: new Date().toISOString(),
        });
        design.updatedAt = new Date().toISOString();
      }
    },

    moderatorSendToRedesign: (
      state,
      action: PayloadAction<{
        designId: string;
        moderatorName: string;
        reason: string;
      }>
    ) => {
      const design = state.designs.find(
        (d) => d.id === action.payload.designId
      );
      if (
        design &&
        design.status === ProductStatus.SUPER_ADMIN_REJECTED
      ) {
        design.status = ProductStatus.REDESIGN_REQUIRED;
        design.rejectionReason = action.payload.reason;
        design.statusHistory.push({
          id: `hist-${Date.now()}-redesign`,
          fromStatus: ProductStatus.SUPER_ADMIN_REJECTED,
          toStatus: ProductStatus.REDESIGN_REQUIRED,
          changedBy: action.payload.moderatorName,
          changedByRole: "BRANCH_MODERATOR",
          reason: action.payload.reason,
          timestamp: new Date().toISOString(),
        });
        design.updatedAt = new Date().toISOString();
      }
    },

    // ─── Super Admin Decisions ────────────────────────────────────
    superAdminApprove: (
      state,
      action: PayloadAction<{
        designId: string;
        adminName: string;
      }>
    ) => {
      const design = state.designs.find(
        (d) => d.id === action.payload.designId
      );
      if (design && design.status === ProductStatus.SUPER_ADMIN_REVIEW) {
        design.status = ProductStatus.SUPER_ADMIN_APPROVED;
        design.statusHistory.push({
          id: `hist-${Date.now()}`,
          fromStatus: ProductStatus.SUPER_ADMIN_REVIEW,
          toStatus: ProductStatus.SUPER_ADMIN_APPROVED,
          changedBy: action.payload.adminName,
          changedByRole: "SUPER_ADMIN",
          timestamp: new Date().toISOString(),
        });
        design.updatedAt = new Date().toISOString();
      }
    },

    superAdminReject: (
      state,
      action: PayloadAction<{
        designId: string;
        adminName: string;
        reason: string;
      }>
    ) => {
      const design = state.designs.find(
        (d) => d.id === action.payload.designId
      );
      if (design && design.status === ProductStatus.SUPER_ADMIN_REVIEW) {
        design.status = ProductStatus.SUPER_ADMIN_REJECTED;
        design.rejectionReason = action.payload.reason;
        design.statusHistory.push({
          id: `hist-${Date.now()}`,
          fromStatus: ProductStatus.SUPER_ADMIN_REVIEW,
          toStatus: ProductStatus.SUPER_ADMIN_REJECTED,
          changedBy: action.payload.adminName,
          changedByRole: "SUPER_ADMIN",
          reason: action.payload.reason,
          timestamp: new Date().toISOString(),
        });
        design.updatedAt = new Date().toISOString();
      }
    },

    superAdminBatchDecision: (
      state,
      action: PayloadAction<{
        approvedIds: string[];
        rejectedIds: string[];
        rejectedReasons: Record<string, string>;
        adminName: string;
      }>
    ) => {
      const { approvedIds, rejectedIds, rejectedReasons, adminName } =
        action.payload;
      const now = new Date().toISOString();

      approvedIds.forEach((id) => {
        const design = state.designs.find((d) => d.id === id);
        if (design && design.status === ProductStatus.SUPER_ADMIN_REVIEW) {
          design.status = ProductStatus.SUPER_ADMIN_APPROVED;
          design.statusHistory.push({
            id: `hist-${Date.now()}-${id}`,
            fromStatus: ProductStatus.SUPER_ADMIN_REVIEW,
            toStatus: ProductStatus.SUPER_ADMIN_APPROVED,
            changedBy: adminName,
            changedByRole: "SUPER_ADMIN",
            timestamp: now,
          });
          design.updatedAt = now;
        }
      });

      rejectedIds.forEach((id) => {
        const design = state.designs.find((d) => d.id === id);
        if (design && design.status === ProductStatus.SUPER_ADMIN_REVIEW) {
          const reason = rejectedReasons[id] || "Not selected by admin";
          design.status = ProductStatus.SUPER_ADMIN_REJECTED;
          design.rejectionReason = reason;
          design.statusHistory.push({
            id: `hist-${Date.now()}-${id}`,
            fromStatus: ProductStatus.SUPER_ADMIN_REVIEW,
            toStatus: ProductStatus.SUPER_ADMIN_REJECTED,
            changedBy: adminName,
            changedByRole: "SUPER_ADMIN",
            reason,
            timestamp: now,
          });
          design.updatedAt = now;
        }
      });
    },

    // ─── Production ───────────────────────────────────────────────
    addWorksheet: (state, action: PayloadAction<IProductionWorksheet>) => {
      state.worksheets.unshift(action.payload);
    },

    updateWorksheetStatus: (
      state,
      action: PayloadAction<{
        worksheetId: string;
        newStatus: ProductStatus;
      }>
    ) => {
      const ws = state.worksheets.find(
        (w) => w.id === action.payload.worksheetId
      );
      if (ws) {
        ws.status = action.payload.newStatus;
        ws.updatedAt = new Date().toISOString();
      }
      if (ws) {
        const design = state.designs.find((d) => d.id === ws.designId);
        if (design) {
          design.status = action.payload.newStatus;
          design.updatedAt = new Date().toISOString();
        }
      }
    },

    // ─── Inventory ────────────────────────────────────────────────
    addRawMaterial: (state, action: PayloadAction<IRawMaterial>) => {
      state.rawMaterials.unshift(action.payload);
    },

    updateRawMaterialStock: (
      state,
      action: PayloadAction<{
        materialId: string;
        newTotalStock: number;
      }>
    ) => {
      const mat = state.rawMaterials.find(
        (m) => m.id === action.payload.materialId
      );
      if (mat) {
        mat.totalStock = action.payload.newTotalStock;
        mat.availableStock =
          action.payload.newTotalStock - mat.allocatedStock;
        mat.lastRestocked = new Date().toISOString();
      }
    },

    allocateMaterial: (
      state,
      action: PayloadAction<IRawMaterialAllocation>
    ) => {
      state.allocations.unshift(action.payload);
      const mat = state.rawMaterials.find(
        (m) => m.id === action.payload.materialId
      );
      if (mat) {
        mat.allocatedStock += action.payload.quantity;
        mat.availableStock = mat.totalStock - mat.allocatedStock;
      }
    },

    deleteDesign: (state, action: PayloadAction<string>) => {
      state.designs = state.designs.filter((d) => d.id !== action.payload);
    },

    deleteRawMaterial: (state, action: PayloadAction<string>) => {
      state.rawMaterials = state.rawMaterials.filter(
        (m) => m.id !== action.payload
      );
    },
  },
});

export const {
  setUserProfile,
  addUserRole,
  removeUserRole,
  setSelectedBranch,
  addBranch,
  deleteBranch,
  addDesign,
  updateDesignStatus,
  moderatorApproveDesigns,
  sendToSuperAdmin,
  moderatorResubmitToAdmin,
  moderatorSendToRedesign,
  superAdminApprove,
  superAdminReject,
  superAdminBatchDecision,
  addWorksheet,
  updateWorksheetStatus,
  addRawMaterial,
  updateRawMaterialStock,
  allocateMaterial,
  deleteDesign,
  deleteRawMaterial,
} = plmSlice.actions;

export default plmSlice.reducer;
