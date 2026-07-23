import { PaymentMethod } from "@/src/types/ecommerce/order";
import * as Yup from "yup";

export const checkoutSchema = Yup.object({
  lastName: Yup.string().required("Last name is required"),
  firstName: Yup.string().required("First name is required"),
  phone: Yup.string().required("Phone is required"),
  email: Yup.string().email("Enter a valid email").default(""),
  country: Yup.string().required("Country is required"),
  addressLine1: Yup.string().required("Street and house number is required"),
  addressLine2: Yup.string().optional().default(""),
  postalCode: Yup.string().default(""),
  city: Yup.string().required("City is required"),
  paymentMethod: Yup.mixed<PaymentMethod>()
    .oneOf(Object.values(PaymentMethod))
    .required("Select a payment method")
    .default(PaymentMethod.COD),
});

export type CheckoutFormValues = Yup.InferType<typeof checkoutSchema>;
