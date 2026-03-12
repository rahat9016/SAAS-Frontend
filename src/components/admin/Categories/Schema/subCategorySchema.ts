import * as Yup from "yup";

export const subCategorySchema = Yup.object({
  name: Yup.string().required("Name is required"),
  description: Yup.string().default(""),
  categoryId: Yup.string().required("Category is required"),
});

export type SubCategoryFormValues = Yup.InferType<typeof subCategorySchema>;
