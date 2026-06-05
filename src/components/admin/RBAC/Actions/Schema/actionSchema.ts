import * as Yup from "yup";

export const actionSchema = Yup.object({
  key: Yup.string()
    .required("Key is required")
    .matches(
      /^[a-z][a-z0-9_]*$/,
      "Lowercase letters, numbers, underscore; must start with a letter",
    ),
  label: Yup.string().required("Label is required"),
});

export type ActionFormValues = Yup.InferType<typeof actionSchema>;
