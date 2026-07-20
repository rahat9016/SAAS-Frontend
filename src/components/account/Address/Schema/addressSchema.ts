import * as Yup from "yup";
import { AddressType } from "../types";

export const addressSchema = Yup.object({
  lastName: Yup.string().required("Last name is required"),
  firstName: Yup.string().required("First name is required"),
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
  email: Yup.string().email("Enter a valid email").optional().default(""),
});

export type AddressFormValues = Yup.InferType<typeof addressSchema>;
