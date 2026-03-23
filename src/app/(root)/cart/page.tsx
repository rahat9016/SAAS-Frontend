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
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-center gap-4">
          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-muted text-muted-foreground">
            <ShoppingCart size={32} />
          </div>
          <h1 className="text-xl font-bold text-foreground">Your cart is empty</h1>
          <p className="text-sm text-muted-foreground max-w-xs">
            Looks like you haven&apos;t added any products to your cart yet.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 mt-2 px-6 py-2.5 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Continue Shopping
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 sm:px-6 lg:px-8">
      <div className="py-4 sm:py-6 lg:py-8 pb-20 lg:pb-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">Shopping Cart</h1>
            <span className="text-xs sm:text-sm text-muted-foreground mt-0.5 block">
              {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
            </span>
          </div>
          <button
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground border border-border rounded-lg px-3 py-1.5 hover:text-red-500 hover:border-red-500 transition-colors cursor-pointer"
            onClick={() => {
              dispatch(clearCart());
              toast.success("Cart cleared");
            }}
          >
            <Trash2 size={14} />
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 lg:gap-8 items-start">
          {/* === Cart Items Section === */}
          <div className="flex flex-col">
            {/* Section header */}
            <div className="flex items-center gap-2 text-sm font-bold text-foreground pb-3 border-b-2 border-primary mb-4">
              <Package size={16} />
              <span>Your Items</span>
            </div>

            {/* Item cards */}
            <div className="flex flex-col gap-3 mb-4">
              {items.map((item, index) => (
                <div
                  key={`${item.productId}-${JSON.stringify(item.selectedAttributes ?? {})}`}
                  className="relative border border-border rounded-xl bg-card overflow-hidden hover:shadow-md hover:border-primary/20 transition-all"
                >
                  {/* Item number badge */}
                  <div className="absolute top-0 left-0 w-6 h-6 flex items-center justify-center text-[10px] font-bold bg-primary text-primary-foreground rounded-br-lg z-10">
                    {index + 1}
                  </div>

                  <div className="flex gap-3 sm:gap-4 p-3 sm:p-5 pl-5 sm:pl-6">
                    {/* Image */}
                    <div className="relative w-20 sm:w-24 lg:w-[100px] min-w-[80px] sm:min-w-[96px] lg:min-w-[100px] h-24 sm:h-28 lg:h-[120px] rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="110px"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col gap-1">
                      <Link
                        href={`/products/${item.slug}`}
                        className="text-sm sm:text-base font-semibold text-foreground line-clamp-2 hover:text-primary transition-colors"
                      >
                        {item.name}
                      </Link>

                      {/* Attribute tags */}
                      {item.selectedAttributes && Object.keys(item.selectedAttributes).length > 0 && (
                        <div className="flex gap-1.5 flex-wrap">
                          {Object.entries(item.selectedAttributes).map(([key, value]) => (
                            <span key={key} className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full bg-primary/8 text-primary border border-primary/15">
                              <Tag size={10} />
                              {key}: {value}
                            </span>
                          ))}
                        </div>
                      )}

                      {item.variantName && !item.selectedAttributes && (
                        <span className="text-xs text-muted-foreground">{item.variantName}</span>
                      )}

                      {/* Price */}
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-sm sm:text-base font-bold text-foreground">
                          ৳{item.price.toLocaleString()}
                        </span>
                        {item.compareAtPrice &&
                          item.compareAtPrice > item.price && (
                            <span className="text-xs sm:text-sm text-muted-foreground line-through">
                              ৳{item.compareAtPrice.toLocaleString()}
                            </span>
                          )}
                      </div>

                      {/* Free shipping badge */}
                      {item.freeShipping && (
                        <div className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-green-600 bg-green-50 border border-green-200 rounded-full px-2 py-0.5 w-fit">
                          <Truck size={12} />
                          Free Shipping
                        </div>
                      )}

                      {/* Qty + Remove */}
                      <div className="flex items-center gap-2 sm:gap-4 mt-auto pt-2 flex-wrap">
                        <div className="flex items-center border border-border rounded-lg overflow-hidden">
                          <button
                            className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 bg-transparent hover:bg-muted text-foreground transition-colors cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed"
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
                          <span className="w-8 sm:w-10 text-center text-sm font-semibold text-foreground border-x border-border py-1">
                            {item.quantity}
                          </span>
                          <button
                            className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 bg-transparent hover:bg-muted text-foreground transition-colors cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed"
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
                        <span className="text-sm font-bold text-primary ml-auto">
                          ৳{(item.price * item.quantity).toLocaleString()}
                        </span>

                        <button
                          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-red-500 transition-colors cursor-pointer"
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
            <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-green-50 text-green-600 text-xs sm:text-sm font-semibold border border-green-100">
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
          <div className="lg:sticky lg:top-32">
            <div className="border border-border rounded-xl p-4 sm:p-6 bg-card flex flex-col gap-4">
              <div className="flex items-center gap-2 text-sm font-bold text-foreground pb-3 border-b-2 border-primary">
                <ShoppingCart size={16} />
                <span>Order Summary</span>
              </div>

              {/* Coupon */}
              {couponCode ? (
                <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-green-50 text-sm text-green-600 font-semibold">
                  <span>🎟️ {couponCode}</span>
                  <button
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-500 hover:bg-red-100 transition-colors cursor-pointer"
                    onClick={() => dispatch(removeCoupon())}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    className="flex-1 px-3 py-2 border border-border rounded-lg text-sm bg-background text-foreground focus:outline-none focus:border-primary"
                    type="text"
                    placeholder="Coupon code"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                  />
                  <button
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer"
                    onClick={handleApplyCoupon}
                  >
                    Apply
                  </button>
                </div>
              )}

              {/* Summary rows */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
                  <span className="font-medium text-foreground">
                    ৳{subtotal.toLocaleString()}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Discount</span>
                    <span className="font-medium text-green-600">
                      -৳{discount.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  {freeShippingCount === items.length ? (
                    <span className="font-medium text-green-600">Free</span>
                  ) : (
                    <span className="font-medium text-orange-600">Calculated at checkout</span>
                  )}
                </div>

                <hr className="border-t border-border my-1" />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">
                    ৳{total.toLocaleString()}
                  </span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-lg text-sm font-bold bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98] transition-all no-underline"
              >
                Proceed to Checkout
                <ArrowRight size={16} />
              </Link>

              <Link href="/" className="text-center text-sm text-primary underline block">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
