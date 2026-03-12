import * as Yup from "yup";

export const categorySchema = Yup.object({
  name: Yup.string().required("Name is required"),
  parentCategoryId: Yup.string().required("Parent category is required"),
});

export type CategoryFormValues = Yup.InferType<typeof categorySchema>;
