import * as Yup from "yup";

export const profileSchema = Yup.object({
  firstName: Yup.string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters"),
  lastName: Yup.string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string()
    .matches(/^[0-9+\-\s()]*$/, "Invalid phone number format")
    .min(10, "Phone number must be at least 10 characters"),
  profilePicture: Yup.mixed<File | string>()
    .nullable()
    .transform((value) => (value === null ? undefined : value))
    .default(undefined)
    .test(
      "fileType",
      "Only image files are allowed (PNG, JPG, JPEG, WebP)",
      (value) => {
        if (!value || typeof value === "string") return true;
        return value instanceof File
          ? ["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(
              value.type
            )
          : false;
      }
    )
    .test("fileSize", "Profile picture must be less than 5MB", (value) => {
      if (!value || typeof value === "string") return true;
      return value instanceof File ? value.size <= 5 * 1024 * 1024 : true;
    }),
});

export type ProfileFormValues = Yup.InferType<typeof profileSchema>;
