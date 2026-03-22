"use client";

import {
  removeFromCart,
  updateQuantity,
  applyCoupon,
  removeCoupon,
  clearCart,
} from "@/src/lib/redux/features/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "@/src/lib/redux/hooks";
import { ArrowRight, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";
import styles from "./Cart.module.css";

export default function CartPage() {
  const dispatch = useAppDispatch();
  const { items, couponCode, couponDiscount } = useAppSelector(
    (state) => state.cart
  );
  const [couponInput, setCouponInput] = useState("");

  // Calculate totals
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discount = couponDiscount;
  const shippingCost = 0; // Free shipping
  const tax = 0;
  const total = Math.max(0, subtotal - discount + shippingCost + tax);

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return;
    // Demo coupon codes
    const coupons: Record<string, number> = {
      SAVE10: subtotal * 0.1,
      FLAT100: 100,
      WELCOME: subtotal * 0.05,
    };
    const val = coupons[couponInput.trim().toUpperCase()];
    if (val) {
      dispatch(applyCoupon({ code: couponInput.trim().toUpperCase(), discount: val }));
      toast.success("Coupon applied successfully!");
      setCouponInput("");
    } else {
      toast.error("Invalid coupon code");
    }
  };

  // Empty cart
  if (items.length === 0) {
    return (
      <div className="container">
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <ShoppingCart size={32} />
          </div>
          <h1 className={styles.emptyTitle}>Your cart is empty</h1>
          <p className={styles.emptyText}>
            Looks like you haven&apos;t added any products to your cart yet.
          </p>
          <Link href="/" className={styles.emptyBtn}>
            Continue Shopping
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className={styles.page}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Shopping Cart</h1>
            <span className={styles.itemCount}>
              {items.length} {items.length === 1 ? "item" : "items"}
            </span>
          </div>
          <button
            className={styles.removeBtn}
            onClick={() => {
              dispatch(clearCart());
              toast.success("Cart cleared");
            }}
          >
            <Trash2 size={14} />
            Clear All
          </button>
        </div>

        <div className={styles.grid}>
          {/* === Cart Items === */}
          <div>
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.variantId ?? ""}`}
                className={styles.cartItem}
              >
                {/* Image */}
                <div className={styles.itemImage}>
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="100px"
                  />
                </div>

                {/* Details */}
                <div className={styles.itemDetails}>
                  <Link
                    href={`/products/${item.slug}`}
                    className={styles.itemName}
                  >
                    {item.name}
                  </Link>
                  {item.variantName && (
                    <span className={styles.itemVariant}>
                      {item.variantName}
                    </span>
                  )}
                  <div className={styles.itemPriceRow}>
                    <span className={styles.itemPrice}>
                      ৳{item.price.toLocaleString()}
                    </span>
                    {item.compareAtPrice &&
                      item.compareAtPrice > item.price && (
                        <span className={styles.itemComparePrice}>
                          ৳{item.compareAtPrice.toLocaleString()}
                        </span>
                      )}
                  </div>

                  {/* Qty + Remove */}
                  <div className={styles.itemActions}>
                    <div className={styles.qtyPicker}>
                      <button
                        className={styles.qtyBtn}
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              productId: item.productId,
                              variantId: item.variantId,
                              quantity: item.quantity - 1,
                            })
                          )
                        }
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={14} />
                      </button>
                      <span className={styles.qtyValue}>{item.quantity}</span>
                      <button
                        className={styles.qtyBtn}
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              productId: item.productId,
                              variantId: item.variantId,
                              quantity: item.quantity + 1,
                            })
                          )
                        }
                        disabled={item.quantity >= item.stock}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button
                      className={styles.removeBtn}
                      onClick={() =>
                        dispatch(
                          removeFromCart({
                            productId: item.productId,
                            variantId: item.variantId,
                          })
                        )
                      }
                    >
                      <Trash2 size={14} />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* === Order Summary === */}
          <div className={styles.summaryCard}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>

            {/* Coupon */}
            {couponCode ? (
              <div className={styles.couponApplied}>
                <span>🎟️ {couponCode}</span>
                <button
                  className={`${styles.couponBtn} ${styles.couponRemove}`}
                  onClick={() => dispatch(removeCoupon())}
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className={styles.couponRow}>
                <input
                  className={styles.couponInput}
                  type="text"
                  placeholder="Coupon code"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                />
                <button
                  className={`${styles.couponBtn} ${styles.couponApply}`}
                  onClick={handleApplyCoupon}
                >
                  Apply
                </button>
              </div>
            )}

            {/* Rows */}
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Subtotal</span>
              <span className={styles.summaryValue}>
                ৳{subtotal.toLocaleString()}
              </span>
            </div>
            {discount > 0 && (
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Discount</span>
                <span className={styles.summaryValue} style={{ color: "#16a34a" }}>
                  -৳{discount.toLocaleString()}
                </span>
              </div>
            )}
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Shipping</span>
              <span className={styles.summaryValue} style={{ color: "#16a34a" }}>
                Free
              </span>
            </div>

            <hr className={styles.summaryDivider} />

            <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
              <span>Total</span>
              <span className={styles.summaryTotalValue}>
                ৳{total.toLocaleString()}
              </span>
            </div>

            <Link href="/checkout" className={styles.checkoutBtn}>
              Proceed to Checkout
              <ArrowRight size={16} />
            </Link>

            <Link href="/" className={styles.continueShopping}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
