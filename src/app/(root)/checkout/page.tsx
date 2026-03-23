"use client";

import { clearCart } from "@/src/lib/redux/features/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "@/src/lib/redux/hooks";
import { PaymentMethod } from "@/src/types/ecommerce/order";
import {
  Banknote,
  CreditCard,
  ShieldCheck,
  Smartphone,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const paymentMethods = [
  {
    id: PaymentMethod.COD,
    label: "Cash on Delivery",
    icon: <Banknote size={22} />,
    color: "#16a34a",
  },
  {
    id: PaymentMethod.SSLCOMMERZ,
    label: "SSLCommerz",
    icon: <CreditCard size={22} />,
    color: "#1d4ed8",
  },
  {
    id: PaymentMethod.BKASH,
    label: "bKash",
    icon: <Smartphone size={22} />,
    color: "#e11d48",
  },
  {
    id: PaymentMethod.NAGAD,
    label: "Nagad",
    icon: <Smartphone size={22} />,
    color: "#f97316",
  },
  {
    id: PaymentMethod.STRIPE,
    label: "Stripe",
    icon: <Wallet size={22} />,
    color: "#6366f1",
  },
];

interface ShippingForm {
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  district: string;
  division: string;
  postalCode: string;
}

const initialForm: ShippingForm = {
  fullName: "",
  phone: "",
  email: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  district: "",
  division: "",
  postalCode: "",
};

export default function CheckoutPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { items, couponDiscount } = useAppSelector((state) => state.cart);

  const [form, setForm] = useState<ShippingForm>(initialForm);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(
    PaymentMethod.COD
  );
  const [isPlacing, setIsPlacing] = useState(false);

  // Redirect to cart if empty
  useEffect(() => {
    if (items.length === 0) {
      router.replace("/cart");
    }
  }, [items.length, router]);

  // Totals
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingCost = 0;
  const total = Math.max(0, subtotal - couponDiscount + shippingCost);

  const handleChange = (field: keyof ShippingForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid =
    form.fullName.trim() &&
    form.phone.trim() &&
    form.addressLine1.trim() &&
    form.city.trim() &&
    form.district.trim() &&
    form.division.trim();

  const handlePlaceOrder = async () => {
    if (!isFormValid) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsPlacing(true);

    // Simulate order processing
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (selectedPayment === PaymentMethod.COD) {
      dispatch(clearCart());
      router.push("/checkout/success");
    } else {
      toast.info(
        `${paymentMethods.find((m) => m.id === selectedPayment)?.label} payment gateway coming soon!`
      );
      setIsPlacing(false);
    }
  };

  if (items.length === 0) return null;

  const inputClass =
    "w-full px-3 py-2.5 sm:py-2 border border-border rounded-lg text-sm bg-background text-foreground focus:outline-none focus:border-primary placeholder:text-muted-foreground transition-colors";

  return (
    <div className="container px-4 sm:px-6 lg:px-8">
      <div className="py-4 sm:py-6 lg:py-8 pb-20 lg:pb-16">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-4 sm:mb-6">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 lg:gap-8">
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
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={inputClass}
                    placeholder="Enter your full name"
                    value={form.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={inputClass}
                    placeholder="+880 1XX XXXX XXX"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-foreground mb-1">Email</label>
                  <input
                    className={inputClass}
                    type="email"
                    placeholder="your@email.com (optional)"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Address Line 1 <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={inputClass}
                    placeholder="House no, street, area"
                    value={form.addressLine1}
                    onChange={(e) => handleChange("addressLine1", e.target.value)}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-foreground mb-1">Address Line 2</label>
                  <input
                    className={inputClass}
                    placeholder="Apartment, suite, unit, etc. (optional)"
                    value={form.addressLine2}
                    onChange={(e) => handleChange("addressLine2", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={inputClass}
                    placeholder="e.g. Dhaka"
                    value={form.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    District <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={inputClass}
                    placeholder="e.g. Dhaka"
                    value={form.district}
                    onChange={(e) => handleChange("district", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Division <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={inputClass}
                    placeholder="e.g. Dhaka"
                    value={form.division}
                    onChange={(e) => handleChange("division", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Postal Code</label>
                  <input
                    className={inputClass}
                    placeholder="e.g. 1205"
                    value={form.postalCode}
                    onChange={(e) => handleChange("postalCode", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="border border-border rounded-xl p-4 sm:p-6 bg-card">
              <h2 className="text-sm sm:text-base font-bold text-foreground mb-4 sm:mb-5 flex items-center gap-2">
                <span className="w-1 h-4.5 rounded-sm bg-primary" />
                Payment Method
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    className={`flex flex-col items-center gap-1.5 sm:gap-2 py-3 sm:py-4 px-2 sm:px-3 border-2 rounded-lg cursor-pointer transition-all bg-background ${
                      selectedPayment === method.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary"
                    }`}
                    onClick={() => setSelectedPayment(method.id)}
                  >
                    <div
                      className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg"
                      style={{ color: method.color }}
                    >
                      {method.icon}
                    </div>
                    <span className="text-[11px] sm:text-xs font-semibold text-foreground text-center">
                      {method.label}
                    </span>
                  </button>
                ))}
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
                  <div
                    key={`${item.productId}-${item.variantId ?? ""}`}
                    className="flex items-center gap-3"
                  >
                    <div className="relative w-12 sm:w-14 min-w-12 sm:min-w-14 h-12 sm:h-14 rounded-md overflow-hidden bg-gray-100">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-foreground line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-[11px] sm:text-xs text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
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
                  <span className="font-medium text-foreground">
                    ৳{subtotal.toLocaleString()}
                  </span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Discount</span>
                    <span className="font-medium text-green-600">
                      -৳{couponDiscount.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>

                <hr className="border-t border-border" />

                <div className="flex justify-between text-base sm:text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">
                    ৳{total.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                className="flex items-center justify-center gap-2 w-full py-3 mt-4 rounded-lg text-sm font-bold bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handlePlaceOrder}
                disabled={isPlacing}
              >
                {isPlacing ? "Processing..." : "Place Order"}
              </button>

              <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground text-center justify-center mt-3">
                <ShieldCheck size={14} />
                Your information is safe and secure
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
