// PLM (Product Lifecycle Management) Type Definitions

export enum PlmRole {
  DESIGN_TEAM = "DESIGN_TEAM",
  PRODUCTION_TEAM = "PRODUCTION_TEAM",
  MANAGEMENT = "MANAGEMENT",
  QUALITY_ASSURANCE = "QUALITY_ASSURANCE",
}

export interface IDesignSubmission {
  id: string;
  name: string;
  description: string;
  designerId: string;
  designerName: string;
  createdAt: string;
  updatedAt: string;
  status: "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED";
  files: string[];
}

export interface IProductionWorksheet {
  id: string;
  name: string;
  designId: string;
  createdAt: string;
  updatedAt: string;
  status: "DRAFT" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  assignedTo: string;
  estimatedHours: number;
  completedHours: number;
}

export interface IRawMaterial {
  id: string;
  name: string;
  code: string;
  description: string;
  unit: string;
  quantity: number;
  minStock: number;
  maxStock: number;
  costPerUnit: number;
  supplier: string;
  createdAt: string;
  updatedAt: string;
}

export interface IRawMaterialAllocation {
  id: string;
  materialId: string;
  worksheetId: string;
  quantity: number;
  allocatedDate: string;
  usedDate?: string;
  status: "ALLOCATED" | "USED" | "RETURNED";
}

export interface IBranch {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  managerId: string;
  createdAt: string;
  updatedAt: string;
}
