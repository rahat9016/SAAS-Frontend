import * as Yup from "yup";

export const propertyStyleTypeOptions = [
  { label: "Apparel", value: "Apparel" },
  { label: "Multiple", value: "Multiple" },
];

export const propertySizeChartTemplateOptions = [
  { label: "Standard Apparel", value: "Standard Apparel" },
  { label: "Footwear", value: "Footwear" },
  { label: "Kids", value: "Kids" },
  { label: "Accessories", value: "Accessories" },
];

export const propertyCollectionTypeOptions = [
  { label: "Main Collection", value: "Main Collection" },
  { label: "NOOS", value: "NOOS" },
];

export const propertySupplierOptions = [
  { label: "Square", value: "Square" },
  { label: "Epyllion Group", value: "Epyllion Group" },
  { label: "Fakir Fashion", value: "Fakir Fashion" },
  { label: "Beximco", value: "Beximco" },
];

export const stylePropertySchema = Yup.object({
  styleType: Yup.string().required("Style type is required"),
  sizeChartTemplate: Yup.string().default(""),
  deliveryMonth: Yup.string().required("Delivery month is required"),
  collectionType: Yup.string().required("Collection type is required"),
  categoryId: Yup.string().required("Category is required"),
  supplierId: Yup.string().default(""),
  assignedBranchId: Yup.string().default(""),
  carryOver: Yup.boolean().default(false),
  autoProtoSr: Yup.boolean().default(false),
  autoSmsSr: Yup.boolean().default(false),
  autoFfpSr: Yup.boolean().default(false),
});

export type StylePropertyFormValues = Yup.InferType<typeof stylePropertySchema>;
