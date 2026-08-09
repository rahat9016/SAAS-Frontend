import * as Yup from "yup";

const SUPPORTED_ICON_FORMATS = ["image/svg+xml", "image/png"];
const ICON_MAX_SIZE = 2 * 1024 * 1024;

export const segmentSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  categoryId: Yup.string().required("Category is required"),
  description: Yup.string().default(""),
  icon: Yup.mixed<File | string>()
    .nullable()
    .transform((value) => (value === null ? undefined : value))
    .default(undefined)
    .test("fileType", "Only SVG and PNG files are allowed.", (value) => {
      if (!value || typeof value === "string") return true;
      if (value instanceof File) {
        return SUPPORTED_ICON_FORMATS.includes(value.type);
      }
      return false;
    })
    .test("fileSize", "Icon size must be less than 2MB.", (value) => {
      if (!value || typeof value === "string") return true;
      return value instanceof File ? value.size <= ICON_MAX_SIZE : true;
    }),
  isActive: Yup.boolean().default(true),
});

export type SegmentFormValues = Yup.InferType<typeof segmentSchema>;
