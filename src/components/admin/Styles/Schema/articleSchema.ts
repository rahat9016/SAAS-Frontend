import * as Yup from "yup";

export const monthOptions = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
].map((m) => ({ label: m, value: m }));

export const promoteStatusOptions = [
  { label: "Concept", value: "Concept" },
  { label: "Development", value: "Development" },
  { label: "Approved", value: "Approved" },
];

export const articleSchema = Yup.object({
  seasonId: Yup.string().required("Season is required"),
  categoryId: Yup.string().required("Category is required"),
  segmentId: Yup.string().required("Segment is required"),
  subCategoryId: Yup.string().required("Sub category is required"),
  brandId: Yup.string().required("Brand is required"),

  style: Yup.string().required("Style code is required"),
  fit: Yup.string().required("Fit is required"),
  image: Yup.string().default(""),
  month: Yup.string().required("Month is required"),
  retailPrice: Yup.string().required("Retail price is required"),
  fob: Yup.string().required("FOB is required"),

  colorIds: Yup.array(Yup.string().required()).min(1, "Select at least one color").required("Select at least one color"),
  sizeIds: Yup.array(Yup.string().required()).min(1, "Select at least one size").required("Select at least one size"),

  fabric: Yup.string().default(""),
  fabricDescription: Yup.string().default(""),
  composition: Yup.string().default(""),
  promoteStatus: Yup.string().required("Promote status is required"),
  assignedBranch: Yup.string().default(""),
  packingCode: Yup.string().default(""),
  transportMode: Yup.string().default(""),
  supplier: Yup.string().default(""),
  exDelivery: Yup.string().default(""),
  sustainability: Yup.string().default(""),
});

export type ArticleFormValues = Yup.InferType<typeof articleSchema>;
