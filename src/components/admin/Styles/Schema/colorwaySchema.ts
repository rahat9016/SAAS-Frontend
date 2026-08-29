import * as Yup from "yup";

export const colorwayStandardOptions = [
  { label: "Pantone", value: "Pantone" },
  { label: "RAL", value: "RAL" },
  { label: "Custom", value: "Custom" },
];

export const colorwaySchema = Yup.object({
  name: Yup.string().required("Color marketing name is required"),
  colorway: Yup.string().required("Colorway code is required"),
  spec: Yup.string().default(""),
  description: Yup.string().default(""),
  standard: Yup.string().required("Color standard is required"),
  pantone: Yup.string().default(""),
  colorHex: Yup.string().required("Color is required"),
  active: Yup.boolean().default(true),
  inTheme: Yup.boolean().default(true),
  sustLabelOff: Yup.boolean().default(false),
  planSms: Yup.boolean().default(false),
  plan3dSms: Yup.boolean().default(false),
  actualSms: Yup.boolean().default(false),
  startDate: Yup.string().default(""),
  endDate: Yup.string().default(""),
  clearanceDate: Yup.string().default(""),
});

export type ColorwayFormValues = Yup.InferType<typeof colorwaySchema>;
