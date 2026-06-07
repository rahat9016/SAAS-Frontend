import * as Yup from "yup";

export const makeUserSchema = (isEdit: boolean) =>
  Yup.object({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().default(""),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: isEdit
      ? Yup.string().default("")
      : Yup.string().required("Password is required").min(6, "Min 6 characters"),
    phone: Yup.string().default(""),
    roleId: Yup.string().default(""),
    branchId: Yup.string().default(""),
    gender: Yup.string().default(""),
    dateOfBirth: Yup.string().default(""),
  });

export type UserFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  roleId: string;
  branchId: string;
  gender: string;
  dateOfBirth: string;
};
