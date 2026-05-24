import { PlmRole } from "@/src/types/plm/productLifecycleTypes";

export interface IUserInformation {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  profilePicture: string | null;
  isVerified: boolean;
  status: string;
  role: string;
  // PLM-specific identity (set from backend JWT claims when available)
  plmRoles?: PlmRole[];
  branchId?: string | null;
  branchName?: string | null;
}

export interface IDataItem {
  id: number;
  name: string;
}

export interface IInitialState {
  loading: boolean;
  userInformation: IUserInformation;
  isLoginModalOpen: boolean;
  data: unknown[];
  // data: IDataItem[]; // Array of IDataItem objects
}
