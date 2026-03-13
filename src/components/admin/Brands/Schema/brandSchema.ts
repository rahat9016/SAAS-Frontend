import * as Yup from "yup";

const SUPPORTED_LOGO_FORMATS = ["image/png"];
const LOGO_MAX_SIZE = 2 * 1024 * 1024; // 2MB

export const brandSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string().default(""),
  isActive: Yup.boolean().default(true),
  logo: Yup.mixed<File | string>()
    .default(undefined)
    .test("fileType", "Only PNG files are allowed.", (value) => {
      if (!value || typeof value === "string") return true;
      if (value instanceof File) {
        return SUPPORTED_LOGO_FORMATS.includes(value.type);
      }
      return false;
    })
    .test("fileSize", "Logo size must be less than 2MB.", (value) => {
      if (!value || typeof value === "string") return true;
      return value instanceof File ? value.size <= LOGO_MAX_SIZE : true;
    }),
});

export type BrandFormValues = Yup.InferType<typeof brandSchema>;
