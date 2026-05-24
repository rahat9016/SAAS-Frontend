import * as Yup from "yup";

export const designSchema = Yup.object({
  name: Yup.string()
    .required("Design name is required")
    .min(3, "Name must be at least 3 characters"),
  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters"),
  category: Yup.string().required("Category is required"),
  images: Yup.array().of(Yup.string().required()).default([]),
  branchId: Yup.string().required("Branch is required"),
});

export type DesignSchemaValues = Yup.InferType<typeof designSchema>;
