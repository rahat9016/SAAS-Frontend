import * as Yup from "yup";

export const groupSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  description: Yup.string().default(""),
  isActive: Yup.boolean().default(true),
});

export type GroupFormValues = Yup.InferType<typeof groupSchema>;
