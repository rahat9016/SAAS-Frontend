import * as Yup from "yup";

export const makeUserSchema = (isEdit: boolean) =>
  Yup.object({
    name: Yup.string().default(""),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: isEdit
      ? Yup.string().default("")
      : Yup.string().required("Password is required").min(6, "Min 6 characters"),
    roleId: Yup.string().required("Role is required"),
  });

export type UserFormValues = {
  name: string;
  email: string;
  password: string;
  roleId: string;
};
