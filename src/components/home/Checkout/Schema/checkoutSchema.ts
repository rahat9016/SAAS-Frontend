import { PaymentMethod } from "@/src/types/ecommerce/order";
import * as Yup from "yup";

export const checkoutSchema = Yup.object({
  fullName: Yup.string().required("Full name is required"),
  phone: Yup.string().required("Phone is required"),
  email: Yup.string().email("Enter a valid email").default(""),
  addressLine1: Yup.string().required("Address is required"),
  addressLine2: Yup.string().default(""),
  city: Yup.string().required("City is required"),
  district: Yup.string().required("District is required"),
  division: Yup.string().required("Division is required"),
  postalCode: Yup.string().default(""),
  paymentMethod: Yup.mixed<PaymentMethod>()
    .oneOf(Object.values(PaymentMethod))
    .required("Select a payment method")
    .default(PaymentMethod.COD),
});

export type CheckoutFormValues = Yup.InferType<typeof checkoutSchema>;
