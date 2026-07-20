import { PaymentMethod } from "@/src/types/ecommerce/order";
import * as Yup from "yup";

export const checkoutSchema = Yup.object({
  lastName: Yup.string().required("Last name is required"),
  firstName: Yup.string().required("First name is required"),
  phone: Yup.string().required("Phone is required"),
  email: Yup.string().email("Enter a valid email").default(""),
  addressLine1: Yup.string().required("Country is required"),
  addressLine2: Yup.string().required("Receiver's name is required"),
  city: Yup.string().required("Receiver's address is required"),
  district: Yup.string().required("House number is required"),
  division: Yup.string().required("City is required"),
  postalCode: Yup.string().default(""),
  paymentMethod: Yup.mixed<PaymentMethod>()
    .oneOf(Object.values(PaymentMethod))
    .required("Select a payment method")
    .default(PaymentMethod.COD),
});

export type CheckoutFormValues = Yup.InferType<typeof checkoutSchema>;
