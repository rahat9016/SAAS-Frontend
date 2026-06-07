import * as Yup from "yup";
import type { SelectedGrants } from "../../shared/ResourcePermissionMatrix";

export const makeUserSchema = (isEdit: boolean) =>
  Yup.object({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().default(""),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: isEdit
      ? Yup.string().default("")
      : Yup.string().required("Password is required").min(6, "Min 6 characters"),
    phone: Yup.string().default(""),
    role: Yup.string().oneOf(["BRANCH_ADMIN", "USER"]).default("USER"),
    branchId: Yup.string().default(""),
    gender: Yup.string().default(""),
    dateOfBirth: Yup.string().default(""),
    // Per-user route+action permissions; held in the form, not validated.
    permissions: Yup.mixed<SelectedGrants>().default({}),
  });

export type UserFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  role: string;
  branchId: string;
  gender: string;
  dateOfBirth: string;
  permissions: SelectedGrants;
};
