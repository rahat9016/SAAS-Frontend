import * as Yup from "yup";

const measurement = () =>
  Yup.number()
    .transform((value, original) => (original === "" ? undefined : value))
    .min(0, "Must be positive")
    .optional();

export const sizeSchema = Yup.object({
  name: Yup.string().required("Size name is required"),
  code: Yup.string()
    .required("Size code is required")
    .matches(/^[A-Za-z0-9-]{1,10}$/, "Enter a valid code, e.g. X212"),
  description: Yup.string().default(""),
  sortOrder: Yup.number()
    .transform((value, original) => (original === "" ? undefined : value))
    .min(0, "Sort order must be positive")
    .default(0),
  unit: Yup.string().oneOf(["in", "cm"]).default("in"),
  chest: measurement(),
  waist: measurement(),
  hip: measurement(),
  length: measurement(),
  isActive: Yup.boolean().default(true),
});

export type SizeFormValues = Yup.InferType<typeof sizeSchema>;
