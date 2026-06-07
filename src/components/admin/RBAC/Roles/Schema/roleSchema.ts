import * as Yup from "yup";

export const roleSchema = Yup.object({
  name: Yup.string()
    .required("Role name is required")
    .transform((v) => (typeof v === "string" ? v.toUpperCase() : v))
    .matches(
      /^[A-Z][A-Z0-9_]*$/,
      "UPPERCASE letters, numbers, underscore; must start with a letter",
    ),
});

export type RoleFormValues = Yup.InferType<typeof roleSchema>;
