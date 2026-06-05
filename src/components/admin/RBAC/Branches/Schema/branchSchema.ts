import * as Yup from "yup";
import type { SelectedGrants } from "../../shared/ResourcePermissionMatrix";

export const branchSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  code: Yup.string().required("Code is required"),
  location: Yup.string().default(""),
  organizationId: Yup.string().required("Organization is required"),
  // Scope held in the form; not validated by yup.
  permissions: Yup.mixed<SelectedGrants>().default({}),
});

export type BranchFormValues = Yup.InferType<typeof branchSchema>;
