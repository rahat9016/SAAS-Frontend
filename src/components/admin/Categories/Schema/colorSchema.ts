import * as Yup from "yup";

export const colorSchema = Yup.object({
  name: Yup.string().required("Color name is required"),
  code: Yup.string()
    .required("Color code is required")
    .matches(/^[A-Za-z0-9-]{2,10}$/, "Enter a valid code, e.g. R102"),
  description: Yup.string().default(""),
  isActive: Yup.boolean().default(true),
});

export type ColorFormValues = Yup.InferType<typeof colorSchema>;
