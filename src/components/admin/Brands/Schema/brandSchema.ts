import * as Yup from "yup";

export const brandSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  description: Yup.string().default(""),
  isActive: Yup.boolean().default(true),
  icon: Yup.mixed<File | string>()
    .nullable()
    .transform((value) => (value === null ? undefined : value))
    .default(undefined)
    .test("fileType", "Only SVG and PNG files are allowed.", (value) => {
      if (!value || typeof value === "string") return true;
      return value instanceof File
        ? ["image/svg+xml", "image/png"].includes(value.type)
        : false;
    })
    .test("fileSize", "Icon size must be less than 2MB.", (value) => {
      if (!value || typeof value === "string") return true;
      return value instanceof File ? value.size <= 2 * 1024 * 1024 : true;
    }),
});

export type BrandFormValues = Yup.InferType<typeof brandSchema>;
