import * as Yup from "yup";
import type { SelectedGrants } from "../../shared/ResourcePermissionMatrix";

export const roleSchema = Yup.object({
  name: Yup.string().required("Role name is required"),
  // Held in the form so it resets cleanly; not validated by yup.
  permissions: Yup.mixed<SelectedGrants>().default({}),
});

export type RoleFormValues = Yup.InferType<typeof roleSchema>;
