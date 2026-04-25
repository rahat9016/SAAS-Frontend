import * as Yup from "yup";
import { AddressType } from "../types";

export const addressSchema = Yup.object({
  fullName: Yup.string().required("Full name is required"),
  phone: Yup.string().required("Phone is required"),
  addressType: Yup.string()
    .oneOf([AddressType.HOME, AddressType.OFFICE, AddressType.SHIPPING, AddressType.BILLING])
    .required("Address type is required"),
  country: Yup.string().required("Country is required"),
  city: Yup.string().required("City is required"),
  region: Yup.string().optional().default(""),
  area: Yup.string().optional().default(""),
  addressLine1: Yup.string().required("Address line 1 is required"),
  addressLine2: Yup.string().optional().default(""),
  zipCode: Yup.string().optional().default(""),
  company: Yup.string().optional().default(""),
  isDefault: Yup.boolean().default(false),
});

export type AddressFormValues = Yup.InferType<typeof addressSchema>;
