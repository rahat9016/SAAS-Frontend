import { PaymentMethod } from "@/src/types/ecommerce/order";
import { ReactElement } from "react";

export interface PaymentOption {
  id: PaymentMethod;
  label: string;
  description?: string;
  icon: ReactElement;
  color: string;
}
