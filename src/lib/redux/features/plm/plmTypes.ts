import {
  PlmRole,
  IDesignSubmission,
  IProductionWorksheet,
  IRawMaterial,
  IRawMaterialAllocation,
  IBranch,
} from "@/src/types/plm/productLifecycleTypes";

export interface IPlmUserProfile {
  id: string;
  name: string;
  roles: PlmRole[];
  permissions: string[];
  branchId: string | null;
  branchName: string | null;
}

export interface IPlmState {
  userProfile: IPlmUserProfile;
  selectedBranchId: string | null;
  branches: IBranch[];
  designs: IDesignSubmission[];
  worksheets: IProductionWorksheet[];
  rawMaterials: IRawMaterial[];
  allocations: IRawMaterialAllocation[];
}
