import * as Yup from "yup";

export const departmentSchema = Yup.object({
  department: Yup.string().required("Department name is required"),
});

export type DepartmentFormValues = Yup.InferType<typeof departmentSchema>;
