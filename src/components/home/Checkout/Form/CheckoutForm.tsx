import ControlledInputField from "@/src/components/shared/FromController/ControlledInputField";
import ControlledSelectField from "@/src/components/shared/FromController/ControlledSelectField";
import InputLabel from "@/src/components/shared/InputLabel";
import SubmitButton from "@/src/components/shared/SubmitButton";
import { ICartItem } from "@/src/types/ecommerce/cart";
import { ShieldCheck } from "lucide-react";
import Image from "next/image";
import { useFormContext } from "react-hook-form";
import { PaymentOption } from "../types";
import { CheckoutFormValues } from "../Schema/checkoutSchema";

const DIVISIONS = [
  "Berlin",
  "Munich",
  "Hamburg",
  "Frankfurt",
  "Cologne",
  "Stuttgart",
  "Düsseldorf",
  "Leipzig",
].map((d) => ({ label: d, value: d }));

interface CheckoutFormProps {
  items: ICartItem[];
  subtotal: number;
  couponDiscount: number;
  total: number;
  paymentMethods: PaymentOption[];
  isPending?: boolean;
  onSubmit: (data: CheckoutFormValues) => void;
}

export default function CheckoutForm({
  items,
  subtotal,
  couponDiscount,
  total,
  paymentMethods,
  isPending = false,
  onSubmit,
}: CheckoutFormProps) {
  const { handleSubmit, watch, setValue } = useFormContext<CheckoutFormValues>();
  const selectedPayment = watch("paymentMethod");

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 lg:gap-8"
    >
      {/* === LEFT: Forms === */}
      <div className="flex flex-col gap-6">
        {/* Shipping Address */}
        <div className="border border-border rounded-xl p-4 sm:p-6 bg-card">
          <h2 className="text-sm sm:text-base font-bold text-foreground mb-4 sm:mb-5 flex items-center gap-2">
            <span className="w-1 h-4.5 rounded-sm bg-primary" />
            Shipping Address
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <InputLabel label="Last Name" required />
              <ControlledInputField name="lastName" placeholder="Enter your last name" className="bg-light" />
            </div>
            <div>
              <InputLabel label="First Name" required />
              <ControlledInputField name="firstName" placeholder="Enter your first name" className="bg-light" />
            </div>
            <div>
              <InputLabel label="Phone" required />
              <ControlledInputField name="phone" placeholder="+880 1XX XXXX XXX" className="bg-light" />
            </div>
            <div className="sm:col-span-2">
              <InputLabel label="Email" />
              <ControlledInputField name="email" type="email" placeholder="your@email.com (optional)" className="bg-light" />
            </div>
            <div className="sm:col-span-2">
              <InputLabel label="Country" required />
              <ControlledInputField name="addressLine1" placeholder="e.g. Germany" className="bg-light" />
            </div>

            {/* Receiver's info */}
            <div className="sm:col-span-2 mt-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Receiver&apos;s info
              </p>
            </div>
            <div>
              <InputLabel label="Receiver's Name" required />
              <ControlledInputField name="addressLine2" placeholder="Enter receiver's name" className="bg-light" />
            </div>
            <div>
              <InputLabel label="Receiver's Address" required />
              <ControlledInputField name="city" placeholder="Street, area" className="bg-light" />
            </div>

            <div>
              <InputLabel label="House Number" required />
              <ControlledInputField name="district" placeholder="e.g. House 12" className="bg-light" />
            </div>
            <div>
              <InputLabel label="City" required />
              <ControlledSelectField name="division" options={DIVISIONS} placeholder="Select city" className="bg-light" />
            </div>
            <div>
              <InputLabel label="Postal Code" />
              <ControlledInputField name="postalCode" placeholder="e.g. 1205" className="bg-light" />
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="border border-border rounded-xl p-4 sm:p-6 bg-card">
          <h2 className="text-sm sm:text-base font-bold text-foreground mb-4 sm:mb-5 flex items-center gap-2">
            <span className="w-1 h-4.5 rounded-sm bg-primary" />
            Payment Method
          </h2>
          <div className="flex flex-col gap-2.5">
            {paymentMethods.map((method) => {
              const active = selectedPayment === method.id;
              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setValue("paymentMethod", method.id, { shouldValidate: true })}
                  className={`flex items-center gap-3 sm:gap-4 py-3 px-3 sm:px-4 border-2 rounded-xl cursor-pointer transition-all text-left bg-background ${
                    active ? "border-primary bg-primary/5" : "border-border hover:border-primary/60"
                  }`}
                >
                  <span
                    className="flex items-center justify-center w-11 h-11 shrink-0 rounded-lg bg-light"
                    style={{ color: method.color }}
                  >
                    {method.icon}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-semibold text-foreground">{method.label}</span>
                    {method.description && (
                      <span className="block text-xs text-muted-foreground">{method.description}</span>
                    )}
                  </span>
                  <span
                    className={`flex items-center justify-center w-5 h-5 shrink-0 rounded-full border-2 transition-colors ${
                      active ? "border-primary" : "border-gray-300"
                    }`}
                  >
                    {active && <span className="w-2.5 h-2.5 rounded-full bg-primary" />}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* === RIGHT: Order Summary === */}
      <div className="flex flex-col gap-6">
        <div className="border border-border rounded-xl p-4 sm:p-6 bg-card">
          <h2 className="text-sm sm:text-base font-bold text-foreground mb-4 sm:mb-5 flex items-center gap-2">
            <span className="w-1 h-4.5 rounded-sm bg-primary" />
            Order Summary
          </h2>

          {/* Items */}
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <div key={`${item.productId}-${item.variantId ?? ""}`} className="flex items-center gap-3">
                <div className="relative w-12 sm:w-14 min-w-12 sm:min-w-14 h-12 sm:h-14 rounded-md overflow-hidden bg-gray-100">
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-foreground line-clamp-1">{item.name}</p>
                  <p className="text-[11px] sm:text-xs text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-foreground whitespace-nowrap">
                  ৳{(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <hr className="border-t border-border my-4" />

          {/* Totals */}
          <div className="flex flex-col gap-2.5">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium text-foreground">৳{subtotal.toLocaleString()}</span>
            </div>
            {couponDiscount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Discount</span>
                <span className="font-medium text-green-600">-৳{couponDiscount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-medium text-green-600">Free</span>
            </div>

            <hr className="border-t border-border" />

            <div className="flex justify-between text-base sm:text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">৳{total.toLocaleString()}</span>
            </div>
          </div>

          <div className="mt-4">
            <SubmitButton isLoading={isPending} label="Place Order" className="w-full" />
          </div>

          <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground text-center justify-center mt-3">
            <ShieldCheck size={14} />
            Your information is safe and secure
          </p>
        </div>
      </div>
    </form>
  );
}
