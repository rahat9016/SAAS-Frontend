"use client";

import { clearCart } from "@/src/lib/redux/features/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "@/src/lib/redux/hooks";
import { PaymentMethod } from "@/src/types/ecommerce/order";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  FaApplePay,
  FaGooglePay,
  FaMoneyBillWave,
  FaPaypal,
  FaRegCreditCard,
  FaStripe,
} from "react-icons/fa6";
import { SiKlarna } from "react-icons/si";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import CheckoutForm from "./Form/CheckoutForm";
import { CheckoutFormValues, checkoutSchema } from "./Schema/checkoutSchema";
import { PaymentOption } from "./types";

const paymentMethods: PaymentOption[] = [
  { id: PaymentMethod.CARD, label: "Credit / Debit Card", description: "Visa, Mastercard, Amex", icon: <FaRegCreditCard size={24} />, color: "#1d4ed8" },
  { id: PaymentMethod.PAYPAL, label: "PayPal", description: "Pay with your PayPal balance", icon: <FaPaypal size={24} />, color: "#003087" },
  { id: PaymentMethod.APPLE_PAY, label: "Apple Pay", description: "Fast & secure checkout", icon: <FaApplePay size={30} />, color: "#000000" },
  { id: PaymentMethod.GOOGLE_PAY, label: "Google Pay", description: "Fast & secure checkout", icon: <FaGooglePay size={30} />, color: "#000000" },
  { id: PaymentMethod.KLARNA, label: "Klarna", description: "Pay in 3 interest-free", icon: <SiKlarna size={24} />, color: "#ffb3c7" },
  { id: PaymentMethod.STRIPE, label: "Stripe", description: "Card via Stripe", icon: <FaStripe size={32} />, color: "#635bff" },
  { id: PaymentMethod.COD, label: "Cash on Delivery", description: "Pay when you receive", icon: <FaMoneyBillWave size={24} />, color: "#16a34a" },
];

export default function CheckoutPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { items, couponDiscount } = useAppSelector((state) => state.cart);

  const methods = useForm<CheckoutFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(checkoutSchema) as any,
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      district: "",
      division: "",
      postalCode: "",
      paymentMethod: PaymentMethod.COD,
    },
  });

  // Redirect to cart if empty
  useEffect(() => {
    if (items.length === 0) router.replace("/cart");
  }, [items.length, router]);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = 0;
  const total = Math.max(0, subtotal - couponDiscount + shippingCost);

  const { isSubmitting } = methods.formState;

  const onSubmit = async (values: CheckoutFormValues) => {
    // Simulate order processing
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (values.paymentMethod === PaymentMethod.COD) {
      dispatch(clearCart());
      router.push("/checkout/success");
    } else {
      toast.info(
        `${paymentMethods.find((m) => m.id === values.paymentMethod)?.label} payment gateway coming soon!`
      );
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="container px-4 sm:px-6 lg:px-8">
      <div className="py-4 sm:py-6 lg:py-8 pb-20 lg:pb-16">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-4 sm:mb-6">
          Checkout
        </h1>

        <FormProvider {...methods}>
          <CheckoutForm
            items={items}
            subtotal={subtotal}
            couponDiscount={couponDiscount}
            total={total}
            paymentMethods={paymentMethods}
            isPending={isSubmitting}
            onSubmit={onSubmit}
          />
        </FormProvider>
      </div>
    </div>
  );
}
