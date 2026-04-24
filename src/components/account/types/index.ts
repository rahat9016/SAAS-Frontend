import { ErrorType } from "@/src/types/common/common";
import { ProfileFormValues } from "../Schema/profileSchema";

export interface IProfileForm {
  onSubmit: (data: ProfileFormValues) => void;
  onCancel: () => void;
  isPending?: boolean;
  error?: ErrorType;
  userEmail?: string;
  userProfilePicture?: string;
  firstName?: string;
  lastName?: string;
}
