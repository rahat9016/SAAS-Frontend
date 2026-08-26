import * as Yup from "yup";

export const seasonStatusOptions = [
  { label: "On Planning", value: "On Planning" },
  { label: "On Concept", value: "On Concept" },
  { label: "On Process", value: "On Process" },
  { label: "Completed", value: "Completed" },
];

export const styleTypeOptions = [
  { label: "Apparel", value: "Apparel" },
  { label: "Multiple", value: "Multiple" },
];

export const sizeChartTemplateOptions = [
  { label: "Standard Apparel", value: "standard-apparel" },
  { label: "Footwear", value: "footwear" },
  { label: "Kids", value: "kids" },
  { label: "Accessories", value: "accessories" },
];

export const collectionTypeOptions = [
  { label: "NOOS", value: "noos" },
  { label: "Seasonal", value: "seasonal" },
  { label: "Basic", value: "basic" },
  { label: "Fashion", value: "fashion" },
];

export const seasonSchema = Yup.object({
  styleType: Yup.string().required("Style type is required"),
  sizeChartTemplate: Yup.string().default(""),
  season: Yup.string().required("Style name is required"),
  deliveryMonth: Yup.string().required("Delivery month is required"),
  collectionType: Yup.string().required("Collection type is required"),
  styleMainClass: Yup.string().default(""),
  styleClass: Yup.string().default(""),
  styleSubClass: Yup.string().default(""),
  status: Yup.string()
    .oneOf(["Completed", "On Process", "On Concept", "On Planning"])
    .default("On Planning"),
});

export type SeasonFormValues = Yup.InferType<typeof seasonSchema>;
