// ─── Product Status State Machine ───────────────────────────────────
export enum ProductStatus {
  CONCEPT = "CONCEPT",
  DESIGN_IN_PROGRESS = "DESIGN_IN_PROGRESS",
  DESIGN_SUBMITTED = "DESIGN_SUBMITTED",
  MODERATOR_REVIEW = "MODERATOR_REVIEW",
  MODERATOR_APPROVED = "MODERATOR_APPROVED",
  SUPER_ADMIN_REVIEW = "SUPER_ADMIN_REVIEW",
  SUPER_ADMIN_PARTIAL_APPROVED = "SUPER_ADMIN_PARTIAL_APPROVED",
  SUPER_ADMIN_APPROVED = "SUPER_ADMIN_APPROVED",
  SUPER_ADMIN_REJECTED = "SUPER_ADMIN_REJECTED",
  REDESIGN_REQUIRED = "REDESIGN_REQUIRED",
  SAMPLE_DEVELOPMENT = "SAMPLE_DEVELOPMENT",
  RAW_MATERIAL_ALLOCATED = "RAW_MATERIAL_ALLOCATED",
  PRODUCTION_WORKSHEET_CREATED = "PRODUCTION_WORKSHEET_CREATED",
  READY_FOR_PRODUCTION = "READY_FOR_PRODUCTION",
  IN_PRODUCTION = "IN_PRODUCTION",
  QUALITY_CHECK = "QUALITY_CHECK",
  READY_FOR_BRANCH = "READY_FOR_BRANCH",
  LIVE_FOR_SALE = "LIVE_FOR_SALE",
}

// ─── Status Transition Rules ────────────────────────────────────────
export const STATUS_TRANSITIONS: Record<ProductStatus, ProductStatus[]> = {
  [ProductStatus.CONCEPT]: [ProductStatus.DESIGN_IN_PROGRESS],
  [ProductStatus.DESIGN_IN_PROGRESS]: [ProductStatus.DESIGN_SUBMITTED],
  [ProductStatus.DESIGN_SUBMITTED]: [ProductStatus.MODERATOR_REVIEW],
  [ProductStatus.MODERATOR_REVIEW]: [
    ProductStatus.MODERATOR_APPROVED,
    ProductStatus.REDESIGN_REQUIRED,
  ],
  [ProductStatus.MODERATOR_APPROVED]: [ProductStatus.SUPER_ADMIN_REVIEW],
  [ProductStatus.SUPER_ADMIN_REVIEW]: [
    ProductStatus.SUPER_ADMIN_APPROVED,
    ProductStatus.SUPER_ADMIN_PARTIAL_APPROVED,
    ProductStatus.SUPER_ADMIN_REJECTED,
  ],
  [ProductStatus.SUPER_ADMIN_PARTIAL_APPROVED]: [
    ProductStatus.SAMPLE_DEVELOPMENT,
  ],
  [ProductStatus.SUPER_ADMIN_APPROVED]: [ProductStatus.SAMPLE_DEVELOPMENT],
  [ProductStatus.SUPER_ADMIN_REJECTED]: [ProductStatus.MODERATOR_REVIEW],
  [ProductStatus.REDESIGN_REQUIRED]: [ProductStatus.DESIGN_IN_PROGRESS],
  [ProductStatus.SAMPLE_DEVELOPMENT]: [ProductStatus.RAW_MATERIAL_ALLOCATED],
  [ProductStatus.RAW_MATERIAL_ALLOCATED]: [
    ProductStatus.PRODUCTION_WORKSHEET_CREATED,
  ],
  [ProductStatus.PRODUCTION_WORKSHEET_CREATED]: [
    ProductStatus.READY_FOR_PRODUCTION,
  ],
  [ProductStatus.READY_FOR_PRODUCTION]: [ProductStatus.IN_PRODUCTION],
  [ProductStatus.IN_PRODUCTION]: [ProductStatus.QUALITY_CHECK],
  [ProductStatus.QUALITY_CHECK]: [ProductStatus.READY_FOR_BRANCH],
  [ProductStatus.READY_FOR_BRANCH]: [ProductStatus.LIVE_FOR_SALE],
  [ProductStatus.LIVE_FOR_SALE]: [],
};

// ─── PLM Roles ──────────────────────────────────────────────────────
export type PlmRole =
  | "SUPER_ADMIN"
  | "BRANCH_MODERATOR"
  | "DESIGN_TEAM"
  | "PRODUCTION_TEAM"
  | "INVENTORY_TEAM";

// ─── Branch Entity ──────────────────────────────────────────────────
export interface IBranch {
  id: string;
  name: string;
  code: string;
  location: string;
  isActive: boolean;
}

// ─── Status History Entry ───────────────────────────────────────────
export interface IStatusHistoryEntry {
  id: string;
  fromStatus: ProductStatus | null;
  toStatus: ProductStatus;
  changedBy: string;
  changedByRole: PlmRole;
  reason?: string;
  timestamp: string;
}

// ─── Design Submission ──────────────────────────────────────────────
export interface IDesignSubmission {
  id: string;
  name: string;
  description: string;
  category: string;
  images: string[];
  designerId: string;
  designerName: string;
  branchId: string;
  branchName: string;
  status: ProductStatus;
  statusHistory: IStatusHistoryEntry[];
  rejectionReason?: string;
  moderatorNotes?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Moderator Selection ────────────────────────────────────────────
export interface IModerationSelection {
  id: string;
  moderatorId: string;
  moderatorName: string;
  branchId: string;
  designIds: string[];
  notes?: string;
  submittedAt: string;
}

// ─── Super Admin Decision ───────────────────────────────────────────
export interface ISuperAdminDecision {
  id: string;
  designId: string;
  decision: "APPROVED" | "REJECTED" | "PARTIAL_APPROVED";
  reason?: string;
  decidedBy: string;
  decidedAt: string;
}

// ─── Production Worksheet ───────────────────────────────────────────
export interface IProductionWorksheet {
  id: string;
  designId: string;
  designName: string;
  branchId: string;
  branchName: string;
  assignedTo: string;
  status: ProductStatus;
  estimatedCompletionDate: string;
  actualCompletionDate?: string;
  notes: string;
  materials: IWorksheetMaterial[];
  createdAt: string;
  updatedAt: string;
}

export interface IWorksheetMaterial {
  materialId: string;
  materialName: string;
  requiredQty: number;
  allocatedQty: number;
  unit: string;
}

// ─── Raw Material / Inventory ───────────────────────────────────────
export interface IRawMaterial {
  id: string;
  name: string;
  sku: string;
  category: string;
  unit: string;
  totalStock: number;
  allocatedStock: number;
  availableStock: number;
  reorderLevel: number;
  unitCost: number;
  lastRestocked: string;
}

export interface IRawMaterialAllocation {
  id: string;
  materialId: string;
  materialName: string;
  worksheetId: string;
  designName: string;
  quantity: number;
  unit: string;
  allocatedBy: string;
  allocatedAt: string;
}

// ─── Table / List Types ─────────────────────────────────────────────
export interface IDesignListItem {
  id: string;
  name: string;
  category: string;
  designerName: string;
  branchName: string;
  status: ProductStatus;
  createdAt: string;
  actions?: string;
}

export interface IProductionListItem {
  id: string;
  designName: string;
  branchName: string;
  assignedTo: string;
  status: ProductStatus;
  estimatedDate: string;
  progress: number;
  actions?: string;
}

export interface IMaterialListItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  totalStock: number;
  allocatedStock: number;
  availableStock: number;
  unit: string;
  unitCost: number;
  actions?: string;
}

// ─── Form Types ─────────────────────────────────────────────────────
export interface DesignFormValues {
  name: string;
  description: string;
  category: string;
  images: string[];
  branchId: string;
}

export interface WorksheetFormValues {
  designId: string;
  assignedTo: string;
  estimatedCompletionDate: string;
  notes: string;
  materials: {
    materialId: string;
    requiredQty: number;
  }[];
}

export interface MaterialFormValues {
  name: string;
  sku: string;
  category: string;
  unit: string;
  totalStock: number;
  reorderLevel: number;
  unitCost: number;
}
