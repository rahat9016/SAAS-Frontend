import * as Yup from "yup";

const SUPPORTED_IMAGE_FORMATS = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
];

const IMAGE_SIZE = 5 * 1024 * 1024;

export const careerSchema = Yup.object({
  image: Yup.mixed<File | string>()
    .required("Image is required")
    .test(
      "fileType",
      "Unsupported image format. Allowed: JPG, PNG, WEBP.",
      (value) => {
        if (typeof value === "string") return true;
        if (value instanceof File) {
          return SUPPORTED_IMAGE_FORMATS.includes(value.type);
        }
        return false;
      }
    )
    .test("fileSize", "Image size must be less than 5MB.", (value) =>
      typeof value === "string" ? true : value.size <= IMAGE_SIZE
    )
    .test(
      "validUrlOrFile",
      "Must provide a valid image or image URL.",
      (value) => (typeof value === "string" ? value.trim() !== "" : true)
    ),

  title: Yup.string().required("Job title is required"),

  salaryRange: Yup.string()
    .required("Salary range is required")
    .matches(
      /^\d{1,3}(,\d{3})*\s?-\s?\d{1,3}(,\d{3})*\sBDT$/,
      "Format must be like: 30,000 - 50,000 BDT"
    ),

  description: Yup.string().required("Description is required"),

  vacancy: Yup.number()
    .typeError("Vacancy must be a number")
    .required("Vacancy is required")
    .min(1, "At least 1 vacancy required"),

  location: Yup.string().required("Location is required"),

  deadline: Yup.string()
    .required("Deadline is required")
    .test("valid-date", "Invalid deadline date", (value) =>
      value ? !isNaN(new Date(value).getTime()) : false
    ),

  status: Yup.boolean().required("Status is required"),

  experience: Yup.string().required("Experience is required"),
});


export type CareerSchemaForm = Yup.InferType<typeof careerSchema>;
