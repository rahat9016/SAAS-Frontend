import * as Yup from "yup";

export const branchSchema = Yup.object({
  code: Yup.string().default(""),
  contact: Yup.string().default(""),
  country: Yup.string().default(""),
  city: Yup.string().default(""),
  area: Yup.string().default(""),
  address: Yup.string().default(""),
  isActive: Yup.boolean().default(true),
});

export type BranchFormValues = Yup.InferType<typeof branchSchema>;
