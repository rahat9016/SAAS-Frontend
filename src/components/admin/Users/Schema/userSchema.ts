import * as Yup from "yup";

const FILE_SIZE_LIMIT = 2 * 1024 * 1024;
const SUPPORTED_IMAGE_TYPES = ["image/jpeg", "image/png"];

export const userSchema = Yup.object({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  phone: Yup.string().nullable().default(""),
  profilePicture: Yup.mixed<File | string>()
    .nullable()
    .default("")
    .test("fileFormat", "Only JPEG or PNG files are allowed", (value) => {
      if (!value || typeof value === "string") return true;
      return SUPPORTED_IMAGE_TYPES.includes(value.type);
    })
    .test("fileSize", "Maximum file size is 2MB", (value) => {
      if (!value || typeof value === "string") return true;
      return value.size <= FILE_SIZE_LIMIT;
    }),
});

export type UserFormValues = Yup.InferType<typeof userSchema>;
