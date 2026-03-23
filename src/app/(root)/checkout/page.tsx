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
import styles from "./Checkout.module.css";

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

  return (
    <div className="container px-4 sm:px-6 lg:px-8">
      <div className={styles.page}>
        <h1 className={styles.title}>Checkout</h1>

        <div className={styles.grid}>
          {/* === LEFT: Forms === */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Shipping Address */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionBullet} />
                Shipping Address
              </h2>
              <div className={styles.formGrid}>
                <div>
                  <label className={styles.formLabel}>
                    Full Name <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    className={styles.formInput}
                    placeholder="Enter your full name"
                    value={form.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                  />
                </div>
                <div>
                  <label className={styles.formLabel}>
                    Phone <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    className={styles.formInput}
                    placeholder="+880 1XX XXXX XXX"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                </div>
                <div className={styles.fieldFull}>
                  <label className={styles.formLabel}>Email</label>
                  <input
                    className={styles.formInput}
                    type="email"
                    placeholder="your@email.com (optional)"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </div>
                <div className={styles.fieldFull}>
                  <label className={styles.formLabel}>
                    Address Line 1 <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    className={styles.formInput}
                    placeholder="House no, street, area"
                    value={form.addressLine1}
                    onChange={(e) =>
                      handleChange("addressLine1", e.target.value)
                    }
                  />
                </div>
                <div className={styles.fieldFull}>
                  <label className={styles.formLabel}>Address Line 2</label>
                  <input
                    className={styles.formInput}
                    placeholder="Apartment, suite, unit, etc. (optional)"
                    value={form.addressLine2}
                    onChange={(e) =>
                      handleChange("addressLine2", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className={styles.formLabel}>
                    City <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    className={styles.formInput}
                    placeholder="e.g. Dhaka"
                    value={form.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                  />
                </div>
                <div>
                  <label className={styles.formLabel}>
                    District <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    className={styles.formInput}
                    placeholder="e.g. Dhaka"
                    value={form.district}
                    onChange={(e) => handleChange("district", e.target.value)}
                  />
                </div>
                <div>
                  <label className={styles.formLabel}>
                    Division <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    className={styles.formInput}
                    placeholder="e.g. Dhaka"
                    value={form.division}
                    onChange={(e) => handleChange("division", e.target.value)}
                  />
                </div>
                <div>
                  <label className={styles.formLabel}>Postal Code</label>
                  <input
                    className={styles.formInput}
                    placeholder="e.g. 1205"
                    value={form.postalCode}
                    onChange={(e) => handleChange("postalCode", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionBullet} />
                Payment Method
              </h2>
              <div className={styles.paymentGrid}>
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    className={`${styles.paymentCard} ${
                      selectedPayment === method.id
                        ? styles.paymentCardActive
                        : ""
                    }`}
                    onClick={() => setSelectedPayment(method.id)}
                  >
                    <div
                      className={styles.paymentIcon}
                      style={{ color: method.color }}
                    >
                      {method.icon}
                    </div>
                    <span className={styles.paymentLabel}>{method.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* === RIGHT: Order Summary === */}
          <div className={styles.sidebar}>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionBullet} />
                Order Summary
              </h2>

              {/* Items */}
              <div className={styles.orderItems}>
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.variantId ?? ""}`}
                    className={styles.orderItem}
                  >
                    <div className={styles.orderItemImage}>
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                    <div className={styles.orderItemInfo}>
                      <p className={styles.orderItemName}>{item.name}</p>
                      <p className={styles.orderItemMeta}>
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <span className={styles.orderItemPrice}>
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <hr className={styles.summaryDivider} style={{ margin: "1rem 0" }} />

              {/* Totals */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Subtotal</span>
                  <span className={styles.summaryValue}>
                    ৳{subtotal.toLocaleString()}
                  </span>
                </div>
                {couponDiscount > 0 && (
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>Discount</span>
                    <span
                      className={styles.summaryValue}
                      style={{ color: "#16a34a" }}
                    >
                      -৳{couponDiscount.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Shipping</span>
                  <span
                    className={styles.summaryValue}
                    style={{ color: "#16a34a" }}
                  >
                    Free
                  </span>
                </div>

                <hr className={styles.summaryDivider} />

                <div
                  className={`${styles.summaryRow} ${styles.summaryTotal}`}
                >
                  <span>Total</span>
                  <span className={styles.summaryTotalValue}>
                    ৳{total.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                className={styles.placeOrderBtn}
                style={{ marginTop: "1rem" }}
                onClick={handlePlaceOrder}
                disabled={isPlacing}
              >
                {isPlacing ? "Processing..." : "Place Order"}
              </button>

              <p className={styles.securityNote}>
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
