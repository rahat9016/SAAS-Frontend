"use client";

import { dummyOrders } from "@/src/data/dummyOrders";
import { OrderStatus } from "@/src/types/ecommerce/order";
import { ArrowLeft, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { use } from "react";

const statusColors: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: "bg-yellow-50 text-yellow-700 border-yellow-200",
  [OrderStatus.CONFIRMED]: "bg-blue-50 text-blue-700 border-blue-200",
  [OrderStatus.PROCESSING]: "bg-indigo-50 text-indigo-700 border-indigo-200",
  [OrderStatus.SHIPPED]: "bg-cyan-50 text-cyan-700 border-cyan-200",
  [OrderStatus.DELIVERED]: "bg-green-50 text-green-700 border-green-200",
  [OrderStatus.CANCELLED]: "bg-red-50 text-red-700 border-red-200",
  [OrderStatus.RETURNED]: "bg-orange-50 text-orange-700 border-orange-200",
  [OrderStatus.REFUNDED]: "bg-purple-50 text-purple-700 border-purple-200",
};

const STATUS_FLOW: OrderStatus[] = [
  OrderStatus.PENDING,
  OrderStatus.CONFIRMED,
  OrderStatus.PROCESSING,
  OrderStatus.SHIPPED,
  OrderStatus.DELIVERED,
];

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const order = dummyOrders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-center gap-4">
          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Package size={32} />
          </div>
          <h1 className="text-xl font-bold text-foreground">Order not found</h1>
          <p className="text-sm text-muted-foreground max-w-xs">
            The order you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 mt-2 px-6 py-2.5 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity no-underline"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const currentStatusIdx = STATUS_FLOW.indexOf(order.orderStatus);

  return (
    <div className="container px-4 sm:px-6 lg:px-8">
      <div className="py-4 sm:py-6 lg:py-8 pb-20 lg:pb-16">
        <Link
          href="/orders"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors no-underline mb-4"
        >
          <ArrowLeft size={16} />
          Back to Orders
        </Link>

        {/* Title + Badge */}
        <div className="flex items-center gap-3 flex-wrap mb-6">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
            {order.orderNumber}
          </h1>
          <span
            className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border capitalize ${statusColors[order.orderStatus]}`}
          >
            {order.orderStatus}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* === LEFT: Items + Shipping === */}
          <div className="flex flex-col gap-6">
            {/* Items */}
            <div className="border border-border rounded-xl bg-card overflow-hidden">
              <h2 className="text-sm font-bold text-foreground px-4 sm:px-5 py-3 border-b border-border flex items-center gap-2">
                <span className="w-1 h-4 bg-primary rounded-full" />
                Order Items
              </h2>
              <div className="flex flex-col divide-y divide-border">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 px-4 sm:px-5 py-3">
                    <div className="relative w-11 sm:w-12 min-w-11 sm:min-w-12 h-11 sm:h-12 rounded-md overflow-hidden bg-gray-100">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-foreground line-clamp-1">{item.name}</p>
                      <p className="text-[11px] sm:text-xs text-muted-foreground">
                        Qty: {item.quantity} · ৳{item.price.toLocaleString()}
                      </p>
                    </div>
                    <span className="text-sm font-semibold whitespace-nowrap">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="border border-border rounded-xl bg-card overflow-hidden">
              <h2 className="text-sm font-bold text-foreground px-4 sm:px-5 py-3 border-b border-border flex items-center gap-2">
                <span className="w-1 h-4 bg-primary rounded-full" />
                Shipping Address
              </h2>
              <div className="grid grid-cols-2 gap-3 px-4 sm:px-5 py-4">
                <div>
                  <p className="text-[11px] text-muted-foreground mb-0.5">Full Name</p>
                  <p className="text-sm font-medium text-foreground">{order.shippingAddress.fullName}</p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground mb-0.5">Phone</p>
                  <p className="text-sm font-medium text-foreground">{order.shippingAddress.phone}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[11px] text-muted-foreground mb-0.5">Address</p>
                  <p className="text-sm font-medium text-foreground">
                    {order.shippingAddress.addressLine1}
                    {order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ""}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground mb-0.5">City</p>
                  <p className="text-sm font-medium text-foreground">{order.shippingAddress.city}</p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground mb-0.5">District</p>
                  <p className="text-sm font-medium text-foreground">{order.shippingAddress.district}</p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground mb-0.5">Division</p>
                  <p className="text-sm font-medium text-foreground">{order.shippingAddress.division}</p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground mb-0.5">Postal Code</p>
                  <p className="text-sm font-medium text-foreground">{order.shippingAddress.postalCode || "—"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* === RIGHT: Reason + Timeline + Payment + Summary === */}
          <div className="flex flex-col gap-6">
            {/* ── Cancellation Reason ── */}
            {order.orderStatus === OrderStatus.CANCELLED && order.cancelReason && (
              <div className="border border-red-200 rounded-xl bg-red-50 overflow-hidden">
                <div className="flex items-center gap-2 px-4 sm:px-5 py-3 border-b border-red-200">
                  <span className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-xs font-bold">✕</span>
                  <h2 className="text-sm font-bold text-red-800">Order Cancelled</h2>
                </div>
                <div className="px-4 sm:px-5 py-4 space-y-2">
                  <p className="text-sm text-red-700 leading-relaxed">{order.cancelReason}</p>
                  <p className="text-[11px] text-red-400">
                    Cancelled on{" "}
                    {new Date(order.updatedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  {order.paymentStatus === "REFUNDED" && (
                    <div className="flex items-center gap-2 bg-white/80 rounded-lg px-3 py-2 border border-red-200 mt-1">
                      <span className="text-sm">💰</span>
                      <p className="text-xs text-red-700 font-medium">
                        Refund of ৳{order.total.toLocaleString()} has been processed via {order.paymentMethod}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Return Reason ── */}
            {order.orderStatus === OrderStatus.RETURNED && order.returnReason && (
              <div className="border border-orange-200 rounded-xl bg-orange-50 overflow-hidden">
                <div className="flex items-center gap-2 px-4 sm:px-5 py-3 border-b border-orange-200">
                  <span className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-xs">↩</span>
                  <h2 className="text-sm font-bold text-orange-800">Order Returned</h2>
                </div>
                <div className="px-4 sm:px-5 py-4 space-y-2">
                  <p className="text-sm text-orange-700 leading-relaxed">{order.returnReason}</p>
                  <p className="text-[11px] text-orange-400">
                    Returned on{" "}
                    {new Date(order.updatedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  {order.paymentStatus === "REFUNDED" && (
                    <div className="flex items-center gap-2 bg-white/80 rounded-lg px-3 py-2 border border-orange-200 mt-1">
                      <span className="text-sm">💰</span>
                      <p className="text-xs text-orange-700 font-medium">
                        Refund of ৳{order.total.toLocaleString()} has been processed via {order.paymentMethod}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Status Timeline ── */}
            <div className="border border-border rounded-xl bg-card overflow-hidden">
              <h2 className="text-sm font-bold text-foreground px-4 sm:px-5 py-3 border-b border-border flex items-center gap-2">
                <span className="w-1 h-4 bg-primary rounded-full" />
                Order Status
              </h2>
              <div className="flex flex-col gap-0 px-4 sm:px-5 py-4">
                {order.orderStatus === OrderStatus.CANCELLED ||
                order.orderStatus === OrderStatus.RETURNED ? (
                  /* Full history for cancelled/returned */
                  (order.statusHistory ?? []).map((entry, idx) => {
                    const entries = order.statusHistory ?? [];
                    const isCancelled = entry.status === OrderStatus.CANCELLED;
                    const isReturned = entry.status === OrderStatus.RETURNED;
                    return (
                      <div key={idx} className="flex items-start gap-3 relative pb-5 last:pb-0">
                        {idx < entries.length - 1 && (
                          <div
                            className={`absolute left-[9px] top-5 w-0.5 h-[calc(100%-12px)] ${
                              isCancelled || isReturned ? "bg-red-300" : "bg-primary"
                            }`}
                          />
                        )}
                        <div
                          className={`w-[18px] h-[18px] rounded-full border-2 shrink-0 mt-0.5 ${
                            isCancelled
                              ? "bg-red-500 border-red-500"
                              : isReturned
                              ? "bg-orange-500 border-orange-500"
                              : "bg-primary border-primary"
                          }`}
                        />
                        <div>
                          <p
                            className={`text-sm font-medium capitalize ${
                              isCancelled ? "text-red-600" : isReturned ? "text-orange-600" : "text-foreground"
                            }`}
                          >
                            {entry.status}
                          </p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            {new Date(entry.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                          {entry.note && (
                            <p className="text-[11px] text-muted-foreground italic mt-0.5">{entry.note}</p>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  /* Normal flow */
                  STATUS_FLOW.map((status, idx) => {
                    const isDone = idx < currentStatusIdx;
                    const isActive = idx === currentStatusIdx;
                    return (
                      <div key={status} className="flex items-start gap-3 relative pb-5 last:pb-0">
                        {idx < STATUS_FLOW.length - 1 && (
                          <div className={`absolute left-[9px] top-5 w-0.5 h-[calc(100%-12px)] ${isDone ? "bg-primary" : "bg-border"}`} />
                        )}
                        <div
                          className={`w-[18px] h-[18px] rounded-full border-2 shrink-0 mt-0.5 ${
                            isDone
                              ? "bg-primary border-primary"
                              : isActive
                              ? "bg-white border-primary shadow-md"
                              : "bg-muted border-border"
                          }`}
                        />
                        <div>
                          <p className={`text-sm font-medium capitalize ${isDone || isActive ? "text-foreground" : "text-foreground/45"}`}>
                            {status}
                          </p>
                          {isActive && (
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                              {new Date(order.updatedAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Payment & Tracking */}
            <div className="border border-border rounded-xl bg-card overflow-hidden">
              <h2 className="text-sm font-bold text-foreground px-4 sm:px-5 py-3 border-b border-border flex items-center gap-2">
                <span className="w-1 h-4 bg-primary rounded-full" />
                Payment & Delivery
              </h2>
              <div className="grid grid-cols-2 gap-3 px-4 sm:px-5 py-4">
                <div>
                  <p className="text-[11px] text-muted-foreground mb-0.5">Payment Method</p>
                  <p className="text-sm font-medium text-foreground">{order.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground mb-0.5">Payment Status</p>
                  <p
                    className={`text-sm font-medium ${
                      order.paymentStatus === "REFUNDED"
                        ? "text-purple-600"
                        : order.paymentStatus === "PAID"
                        ? "text-green-600"
                        : order.paymentStatus === "FAILED"
                        ? "text-red-600"
                        : "text-foreground"
                    }`}
                  >
                    {order.paymentStatus}
                  </p>
                </div>
                {order.trackingNumber && (
                  <div>
                    <p className="text-[11px] text-muted-foreground mb-0.5">Tracking Number</p>
                    <p className="text-sm font-medium text-foreground">{order.trackingNumber}</p>
                  </div>
                )}
                {order.estimatedDelivery && (
                  <div>
                    <p className="text-[11px] text-muted-foreground mb-0.5">Estimated Delivery</p>
                    <p className="text-sm font-medium text-foreground">
                      {new Date(order.estimatedDelivery).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="border border-border rounded-xl bg-card overflow-hidden">
              <h2 className="text-sm font-bold text-foreground px-4 sm:px-5 py-3 border-b border-border flex items-center gap-2">
                <span className="w-1 h-4 bg-primary rounded-full" />
                Order Total
              </h2>
              <div className="flex flex-col gap-2 px-4 sm:px-5 py-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">৳{order.subtotal.toLocaleString()}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Discount{order.couponCode ? ` (${order.couponCode})` : ""}
                    </span>
                    <span className="font-medium text-green-600">
                      -৳{order.discount.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className={`font-medium ${order.shippingCost === 0 ? "text-green-600" : ""}`}>
                    {order.shippingCost === 0 ? "Free" : `৳${order.shippingCost.toLocaleString()}`}
                  </span>
                </div>
                <hr className="border-border my-1" />
                <div className="flex justify-between text-base font-bold">
                  <span>Total</span>
                  <span className="text-primary">৳{order.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
