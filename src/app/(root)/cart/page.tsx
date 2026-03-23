"use client";

import {
  removeFromCart,
  updateQuantity,
  applyCoupon,
  removeCoupon,
  clearCart,
} from "@/src/lib/redux/features/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "@/src/lib/redux/hooks";
import { ArrowRight, Minus, Package, Plus, ShoppingCart, Tag, Trash2, Truck } from "lucide-react";
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
  const shippingCost = 0;
  const tax = 0;
  const total = Math.max(0, subtotal - discount + shippingCost + tax);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const freeShippingCount = items.filter((item) => item.freeShipping).length;

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return;
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
              {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
            </span>
          </div>
          <button
            className={styles.clearAllBtn}
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
          {/* === Cart Items Section === */}
          <div className={styles.itemsSection}>
            {/* Section header */}
            <div className={styles.sectionHeader}>
              <Package size={16} />
              <span>Your Items</span>
            </div>

            {/* Item cards */}
            <div className={styles.itemsList}>
              {items.map((item, index) => (
                <div
                  key={`${item.productId}-${JSON.stringify(item.selectedAttributes ?? {})}`}
                  className={styles.itemCard}
                >
                  {/* Item number badge */}
                  <div className={styles.itemNumber}>{index + 1}</div>

                  <div className={styles.itemContent}>
                    {/* Image */}
                    <div className={styles.itemImage}>
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="110px"
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

                      {/* Attribute tags */}
                      {item.selectedAttributes && Object.keys(item.selectedAttributes).length > 0 && (
                        <div className={styles.attributeTags}>
                          {Object.entries(item.selectedAttributes).map(([key, value]) => (
                            <span key={key} className={styles.attributeTag}>
                              <Tag size={10} />
                              {key}: {value}
                            </span>
                          ))}
                        </div>
                      )}

                      {item.variantName && !item.selectedAttributes && (
                        <span className={styles.itemVariant}>{item.variantName}</span>
                      )}

                      {/* Price */}
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

                      {/* Free shipping badge */}
                      {item.freeShipping && (
                        <div className={styles.freeShippingBadge}>
                          <Truck size={12} />
                          Free Shipping
                        </div>
                      )}

                      {/* Qty + Remove */}
                      <div className={styles.itemActions}>
                        <div className={styles.qtyPicker}>
                          <button
                            className={styles.qtyBtn}
                            onClick={() =>
                              dispatch(
                                updateQuantity({
                                  productId: item.productId,
                                  selectedAttributes: item.selectedAttributes,
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
                                  selectedAttributes: item.selectedAttributes,
                                  quantity: item.quantity + 1,
                                })
                              )
                            }
                            disabled={item.quantity >= item.stock}
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        {/* Item subtotal */}
                        <span className={styles.itemSubtotal}>
                          ৳{(item.price * item.quantity).toLocaleString()}
                        </span>

                        <button
                          className={styles.removeBtn}
                          onClick={() =>
                            dispatch(
                              removeFromCart({
                                productId: item.productId,
                                selectedAttributes: item.selectedAttributes,
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
                </div>
              ))}
            </div>

            {/* Free shipping banner */}
            <div className={styles.shippingBanner}>
              <Truck size={16} />
              {freeShippingCount === items.length ? (
                <span>All items in your cart have free shipping!</span>
              ) : freeShippingCount > 0 ? (
                <span>{freeShippingCount} of {items.length} item{items.length > 1 ? 's' : ''} eligible for free shipping</span>
              ) : (
                <span>Shipping will be calculated at checkout</span>
              )}
            </div>
          </div>

          {/* === Order Summary Section === */}
          <div className={styles.summarySection}>
            <div className={styles.summaryCard}>
              <div className={styles.sectionHeader}>
                <ShoppingCart size={16} />
                <span>Order Summary</span>
              </div>

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

              {/* Summary rows */}
              <div className={styles.summaryRows}>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Subtotal ({totalItems} items)</span>
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
                  {freeShippingCount === items.length ? (
                    <span className={styles.summaryValue} style={{ color: "#16a34a" }}>Free</span>
                  ) : (
                    <span className={styles.summaryValue} style={{ color: "#ea580c" }}>Calculated at checkout</span>
                  )}
                </div>

                <hr className={styles.summaryDivider} />

                <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                  <span>Total</span>
                  <span className={styles.summaryTotalValue}>
                    ৳{total.toLocaleString()}
                  </span>
                </div>
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
    </div>
  );
}
