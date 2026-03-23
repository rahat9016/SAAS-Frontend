"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { dummyOrders } from "@/src/data/dummyOrders";
import {
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
  IPaymentHistoryEntry,
} from "@/src/types/ecommerce/order";
import AdminBackButton from "@/src/components/shared/AdminBackButton/AdminBackButton";
import Image from "next/image";
import {
  Package,
  Truck,
  CreditCard,
  MapPin,
  FileText,
  ChevronDown,
  Receipt,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  Clock,
  Tag,
  AlertTriangle,
  RotateCcw,
  Ban,
  ShieldAlert,
  MessageSquare,
  Send,
  Mail,
} from "lucide-react";

// ─── Style Maps ─────────────────────────────────────────────────
const orderStatusStyles: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: "bg-yellow-50 text-yellow-700 border-yellow-200",
  [OrderStatus.CONFIRMED]: "bg-blue-50 text-blue-700 border-blue-200",
  [OrderStatus.PROCESSING]: "bg-indigo-50 text-indigo-700 border-indigo-200",
  [OrderStatus.SHIPPED]: "bg-cyan-50 text-cyan-700 border-cyan-200",
  [OrderStatus.DELIVERED]: "bg-emerald-50 text-emerald-700 border-emerald-200",
  [OrderStatus.CANCELLED]: "bg-red-50 text-red-600 border-red-200",
  [OrderStatus.RETURNED]: "bg-orange-50 text-orange-700 border-orange-200",
  [OrderStatus.REFUNDED]: "bg-purple-50 text-purple-700 border-purple-200",
};

const paymentStatusStyles: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]: "bg-yellow-50 text-yellow-700 border-yellow-200",
  [PaymentStatus.PAID]: "bg-emerald-50 text-emerald-700 border-emerald-200",
  [PaymentStatus.FAILED]: "bg-red-50 text-red-600 border-red-200",
  [PaymentStatus.REFUNDED]: "bg-purple-50 text-purple-700 border-purple-200",
};

const timelineDotStyles: Record<string, string> = {
  [OrderStatus.PENDING]: "bg-yellow-500",
  [OrderStatus.CONFIRMED]: "bg-blue-500",
  [OrderStatus.PROCESSING]: "bg-indigo-500",
  [OrderStatus.SHIPPED]: "bg-cyan-500",
  [OrderStatus.DELIVERED]: "bg-emerald-500",
  [OrderStatus.CANCELLED]: "bg-red-500",
  [OrderStatus.RETURNED]: "bg-orange-500",
  [OrderStatus.REFUNDED]: "bg-purple-500",
};

// ─── Component ──────────────────────────────────────────────────
interface OrderDetailProps {
  orderId: string;
}

export default function OrderDetail({ orderId }: OrderDetailProps) {
  const order = dummyOrders.find((o) => o.id === orderId);
  const [orderStatus, setOrderStatus] = useState<OrderStatus>(
    order?.orderStatus ?? OrderStatus.PENDING
  );
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(
    order?.paymentStatus ?? PaymentStatus.PENDING
  );
  const [pendingOrderStatus, setPendingOrderStatus] =
    useState<OrderStatus>(orderStatus);
  const [pendingPaymentStatus, setPendingPaymentStatus] =
    useState<PaymentStatus>(paymentStatus);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [cancelMessage, setCancelMessage] = useState("");
  const [returnMessage, setReturnMessage] = useState("");
  const [refundHistory, setRefundHistory] = useState<IPaymentHistoryEntry[]>([]);

  // Check if order was paid via online method (not COD)
  const isOnlinePaid =
    order?.paymentMethod !== PaymentMethod.COD &&
    paymentStatus === PaymentStatus.PAID;

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
        <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gray-100 text-gray-400">
          <Package size={32} />
        </div>
        <h1 className="text-xl font-bold text-gray-900">Order not found</h1>
        <p className="text-sm text-gray-500">
          The order you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
      </div>
    );
  }

  const handleSaveChanges = () => {
    setShowConfirmDialog(true);
  };

  const confirmStatusChange = () => {
    const prevStatus = orderStatus;
    setOrderStatus(pendingOrderStatus);
    setShowConfirmDialog(false);

    // Auto-refund for online-paid orders when cancelling or returning
    const shouldAutoRefund =
      (pendingOrderStatus === OrderStatus.CANCELLED ||
        pendingOrderStatus === OrderStatus.RETURNED) &&
      order.paymentMethod !== PaymentMethod.COD &&
      (paymentStatus === PaymentStatus.PAID ||
        pendingPaymentStatus === PaymentStatus.PAID);

    if (shouldAutoRefund) {
      setPaymentStatus(PaymentStatus.REFUNDED);
      // Add refund entry to history
      const refundEntry: IPaymentHistoryEntry = {
        id: `refund-${Date.now()}`,
        type: "refund",
        method: order.paymentMethod,
        amount: order.total,
        status: "success",
        transactionId: `RFD-${order.paymentMethod}-${order.id.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`,
        date: new Date().toISOString(),
        note: pendingOrderStatus === OrderStatus.CANCELLED
          ? `Full refund — order cancelled by admin.${cancelMessage ? ` Reason: ${cancelMessage}` : ""}`
          : `Full refund — return processed.${returnMessage ? ` Note: ${returnMessage}` : ""}`,
      };
      setRefundHistory((prev) => [...prev, refundEntry]);
    } else {
      setPaymentStatus(pendingPaymentStatus);
    }

    // Simulate customer notification
    if (pendingOrderStatus === OrderStatus.CANCELLED) {
      toast.info(
        `📧 Notification sent to ${order.shippingAddress.fullName}: "Your order ${order.orderNumber} has been cancelled.${cancelMessage ? ` Reason: ${cancelMessage}` : ""}"`,
        { autoClose: 6000 }
      );
      if (shouldAutoRefund) {
        toast.success(
          `💰 Refund of ৳${order.total.toLocaleString()} initiated via ${order.paymentMethod} to ${order.shippingAddress.fullName}`,
          { autoClose: 6000 }
        );
      }
    } else if (pendingOrderStatus === OrderStatus.RETURNED) {
      toast.info(
        `📧 Notification sent to ${order.shippingAddress.fullName}: "Your return for order ${order.orderNumber} has been processed.${returnMessage ? ` Note: ${returnMessage}` : ""}"`,
        { autoClose: 6000 }
      );
      if (shouldAutoRefund) {
        toast.success(
          `💰 Refund of ৳${order.total.toLocaleString()} initiated via ${order.paymentMethod} to ${order.shippingAddress.fullName}`,
          { autoClose: 6000 }
        );
      }
    } else if (pendingOrderStatus === OrderStatus.SHIPPED) {
      toast.success(
        `📧 Notification sent to ${order.shippingAddress.fullName}: "Your order ${order.orderNumber} has been shipped!"`,
        { autoClose: 4000 }
      );
    } else if (pendingOrderStatus === OrderStatus.DELIVERED) {
      toast.success(
        `📧 Notification sent to ${order.shippingAddress.fullName}: "Your order ${order.orderNumber} has been delivered!"`,
        { autoClose: 4000 }
      );
    } else if (pendingOrderStatus !== prevStatus) {
      toast.success(
        `Order status updated: ${prevStatus} → ${pendingOrderStatus}`,
        { autoClose: 3000 }
      );
    }

    setCancelMessage("");
    setReturnMessage("");
  };

  const cancelStatusChange = () => {
    setPendingOrderStatus(orderStatus);
    setPendingPaymentStatus(paymentStatus);
    setShowConfirmDialog(false);
    setCancelMessage("");
    setReturnMessage("");
  };

  const statusHistory = order.statusHistory ?? [];
  const paymentHistory = [
    ...(order.paymentHistory ?? []),
    ...refundHistory,
  ];

  // Detect if refund will happen when cancelling
  const willAutoRefund =
    pendingOrderStatus === OrderStatus.CANCELLED &&
    order.paymentMethod !== PaymentMethod.COD &&
    (paymentStatus === PaymentStatus.PAID ||
      pendingPaymentStatus === PaymentStatus.PAID);

  const willAutoRefundReturn =
    pendingOrderStatus === OrderStatus.RETURNED &&
    order.paymentMethod !== PaymentMethod.COD &&
    (paymentStatus === PaymentStatus.PAID ||
      pendingPaymentStatus === PaymentStatus.PAID);

  return (
    <div className="space-y-6">
      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-lg mx-4 overflow-hidden">
            <div
              className={`flex items-center gap-3 px-6 py-4 border-b border-gray-100 ${
                pendingOrderStatus === OrderStatus.CANCELLED
                  ? "bg-red-50"
                  : pendingOrderStatus === OrderStatus.RETURNED
                  ? "bg-orange-50"
                  : "bg-amber-50"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  pendingOrderStatus === OrderStatus.CANCELLED
                    ? "bg-red-100"
                    : pendingOrderStatus === OrderStatus.RETURNED
                    ? "bg-orange-100"
                    : "bg-amber-100"
                }`}
              >
                <ShieldAlert
                  className={`w-5 h-5 ${
                    pendingOrderStatus === OrderStatus.CANCELLED
                      ? "text-red-600"
                      : pendingOrderStatus === OrderStatus.RETURNED
                      ? "text-orange-600"
                      : "text-amber-600"
                  }`}
                />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  {pendingOrderStatus === OrderStatus.CANCELLED
                    ? "Cancel Order"
                    : pendingOrderStatus === OrderStatus.RETURNED
                    ? "Process Return"
                    : "Confirm Status Change"}
                </h3>
                <p className="text-xs text-gray-500">
                  {pendingOrderStatus === OrderStatus.CANCELLED
                    ? "The customer will be notified about this cancellation"
                    : pendingOrderStatus === OrderStatus.RETURNED
                    ? "The customer will be notified about the return"
                    : "This action will update the order status"}
                </p>
              </div>
            </div>
            <div className="px-6 py-4 [&>*+*]:mt-3">
              {/* All Status Info */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Order #</span>
                  <span className="font-semibold text-gray-900">
                    {order.orderNumber}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Customer</span>
                  <span className="font-medium text-gray-900">
                    {order.shippingAddress.fullName}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Phone</span>
                  <span className="font-medium text-gray-900">
                    {order.shippingAddress.phone}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Total</span>
                  <span className="font-bold text-primary">
                    ৳{order.total.toLocaleString()}
                  </span>
                </div>
                <hr className="border-gray-100" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Order Status</span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full border ${orderStatusStyles[orderStatus]}`}
                    >
                      {orderStatus}
                    </span>
                    <span className="text-gray-400">→</span>
                    <span
                      className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full border ${orderStatusStyles[pendingOrderStatus]}`}
                    >
                      {pendingOrderStatus}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Payment Status</span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full border ${paymentStatusStyles[paymentStatus]}`}
                    >
                      {paymentStatus}
                    </span>
                    <span className="text-gray-400">→</span>
                    <span
                      className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full border ${paymentStatusStyles[pendingPaymentStatus]}`}
                    >
                      {pendingPaymentStatus}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Payment Method</span>
                  <span className="font-medium text-gray-900">
                    {order.paymentMethod}
                  </span>
                </div>
              </div>

              {/* Message to customer for cancellation */}
              {pendingOrderStatus === OrderStatus.CANCELLED && (
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-600 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                    Message to customer (cancellation reason)
                  </label>
                  <textarea
                    value={cancelMessage}
                    onChange={(e) => setCancelMessage(e.target.value)}
                    placeholder="e.g., Item out of stock, unable to fulfill order..."
                    className="w-full h-20 px-3 py-2 rounded-lg border border-gray-200 text-sm placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300"
                  />
                  <div className="flex items-start gap-2 bg-blue-50 rounded-lg px-3 py-2 border border-blue-200">
                    <Mail className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                    <p className="text-[11px] text-blue-700">
                      A notification will be sent to{" "}
                      <strong>{order.shippingAddress.fullName}</strong> at{" "}
                      <strong>
                        {order.shippingAddress.phone}
                        {order.shippingAddress.email
                          ? ` & ${order.shippingAddress.email}`
                          : ""}
                      </strong>
                    </p>
                  </div>
                </div>
              )}

              {/* Refund warning for online cancel */}
              {pendingOrderStatus === OrderStatus.CANCELLED && willAutoRefund && (
                <div className="flex items-start gap-2 bg-purple-50 rounded-lg px-3 py-2.5 border border-purple-200">
                  <ArrowUpRight className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
                  <div className="text-[11px] text-purple-800 space-y-0.5">
                    <p className="font-semibold">
                      💰 Auto-refund will be processed
                    </p>
                    <p>
                      ৳{order.total.toLocaleString()} will be refunded to{" "}
                      <strong>{order.shippingAddress.fullName}</strong> via{" "}
                      <strong>{order.paymentMethod}</strong> because the
                      payment was already received.
                    </p>
                  </div>
                </div>
              )}

              {/* Message to customer for return */}
              {pendingOrderStatus === OrderStatus.RETURNED && (
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-600 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                    Message to customer (return note)
                  </label>
                  <textarea
                    value={returnMessage}
                    onChange={(e) => setReturnMessage(e.target.value)}
                    placeholder="e.g., Return accepted, refund will be processed within 3-5 business days..."
                    className="w-full h-20 px-3 py-2 rounded-lg border border-gray-200 text-sm placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300"
                  />
                  <div className="flex items-start gap-2 bg-blue-50 rounded-lg px-3 py-2 border border-blue-200">
                    <Mail className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                    <p className="text-[11px] text-blue-700">
                      A notification will be sent to{" "}
                      <strong>{order.shippingAddress.fullName}</strong>
                    </p>
                  </div>
                </div>
              )}

              {/* Refund warning for online return */}
              {pendingOrderStatus === OrderStatus.RETURNED && willAutoRefundReturn && (
                <div className="flex items-start gap-2 bg-purple-50 rounded-lg px-3 py-2.5 border border-purple-200">
                  <ArrowUpRight className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
                  <div className="text-[11px] text-purple-800 space-y-0.5">
                    <p className="font-semibold">
                      💰 Auto-refund will be processed
                    </p>
                    <p>
                      ৳{order.total.toLocaleString()} will be refunded to{" "}
                      <strong>{order.shippingAddress.fullName}</strong> via{" "}
                      <strong>{order.paymentMethod}</strong>.
                    </p>
                  </div>
                </div>
              )}

              {/* Notification preview for shipped/delivered */}
              {(pendingOrderStatus === OrderStatus.SHIPPED ||
                pendingOrderStatus === OrderStatus.DELIVERED) && (
                <div className="flex items-start gap-2 bg-emerald-50 rounded-lg px-3 py-2 border border-emerald-200">
                  <Send className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                  <p className="text-[11px] text-emerald-700">
                    Customer <strong>{order.shippingAddress.fullName}</strong>{" "}
                    will be notified that their order has been{" "}
                    <strong>
                      {pendingOrderStatus === OrderStatus.SHIPPED
                        ? "shipped"
                        : "delivered"}
                    </strong>
                    .
                  </p>
                </div>
              )}
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button
                onClick={cancelStatusChange}
                className="flex-1 h-10 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                No, Cancel
              </button>
              <button
                onClick={confirmStatusChange}
                className={`flex-1 h-10 rounded-lg text-white text-sm font-medium transition-colors cursor-pointer ${
                  pendingOrderStatus === OrderStatus.CANCELLED
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-primary hover:bg-primary/90"
                }`}
              >
                {pendingOrderStatus === OrderStatus.CANCELLED
                  ? "Yes, Cancel & Notify"
                  : pendingOrderStatus === OrderStatus.RETURNED
                  ? "Yes, Process Return"
                  : "Yes, Update"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <AdminBackButton
          routeURL="/admin/orders"
          title={order.orderNumber}
          desc="Order Details"
        />
        <span
          className={`self-start sm:self-auto inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border capitalize ${orderStatusStyles[orderStatus]}`}
        >
          {orderStatus}
        </span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* ===== LEFT COLUMN (2/3) ===== */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          {/* ── Order Items (enhanced with attributes, original price, campaign) ── */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                <Package className="w-4 h-4 text-indigo-600" />
              </div>
              <h2 className="text-sm font-semibold text-gray-900">
                Order Items ({order.items.length})
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="px-5 py-4">
                  <div className="flex items-start gap-4">
                    <div className="relative w-16 h-16 min-w-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 line-clamp-1">
                        {item.name}
                      </p>
                      {/* Attributes */}
                      {item.attributes &&
                        Object.keys(item.attributes).length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {Object.entries(item.attributes).map(
                              ([key, value]) => (
                                <span
                                  key={key}
                                  className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200"
                                >
                                  {key}: {value}
                                </span>
                              )
                            )}
                          </div>
                        )}
                      {/* Variant */}
                      {item.variantName && (
                        <p className="text-xs text-gray-400 mt-1">
                          Variant: {item.variantName}
                        </p>
                      )}
                      {/* Qty & Price */}
                      <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-500">
                        <span>Qty: {item.quantity}</span>
                        <span className="text-gray-300">×</span>
                        {item.originalPrice &&
                        item.originalPrice > item.price ? (
                          <span className="flex items-center gap-1.5">
                            <span className="line-through text-gray-400">
                              ৳{item.originalPrice.toLocaleString()}
                            </span>
                            <span className="font-semibold text-primary">
                              ৳{item.price.toLocaleString()}
                            </span>
                          </span>
                        ) : (
                          <span>৳{item.price.toLocaleString()}</span>
                        )}
                      </div>
                      {/* Campaign discount */}
                      {item.campaignName && (
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <Tag className="w-3 h-3 text-green-600" />
                          <span className="text-[11px] font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                            {item.campaignName}
                            {item.campaignDiscount
                              ? ` (−৳${item.campaignDiscount.toLocaleString()})`
                              : ""}
                          </span>
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-bold text-gray-900 whitespace-nowrap">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {/* Order Summary */}
            <div className="border-t border-gray-200 bg-gray-50/60 px-5 py-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium text-gray-800">
                  ৳{order.subtotal.toLocaleString()}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    Discount
                    {order.couponCode ? ` (${order.couponCode})` : ""}
                  </span>
                  <span className="font-medium text-green-600">
                    -৳{order.discount.toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span
                  className={`font-medium ${
                    order.shippingCost === 0
                      ? "text-green-600"
                      : "text-gray-800"
                  }`}
                >
                  {order.shippingCost === 0
                    ? "Free"
                    : `৳${order.shippingCost.toLocaleString()}`}
                </span>
              </div>
              {order.tax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tax</span>
                  <span className="font-medium text-gray-800">
                    ৳{order.tax.toLocaleString()}
                  </span>
                </div>
              )}
              <hr className="border-gray-200 my-1" />
              <div className="flex justify-between text-base font-bold">
                <span className="text-gray-900">Total</span>
                <span className="text-primary">
                  ৳{order.total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* ── Payment History ── */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
              <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center">
                <Receipt className="w-4 h-4 text-rose-600" />
              </div>
              <h2 className="text-sm font-semibold text-gray-900">
                Payment History
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {paymentHistory.length === 0 ? (
                <div className="px-5 py-8 text-center">
                  <p className="text-sm text-gray-400">
                    No payment records found
                  </p>
                </div>
              ) : (
                paymentHistory.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-start gap-3.5 px-5 py-4"
                  >
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        entry.status === "success"
                          ? entry.type === "refund"
                            ? "bg-purple-50"
                            : "bg-emerald-50"
                          : entry.status === "failed"
                          ? "bg-red-50"
                          : "bg-yellow-50"
                      }`}
                    >
                      {entry.status === "success" ? (
                        entry.type === "refund" ? (
                          <ArrowUpRight className="w-4 h-4 text-purple-600" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 text-emerald-600" />
                        )
                      ) : entry.status === "failed" ? (
                        <XCircle className="w-4 h-4 text-red-500" />
                      ) : (
                        <Clock className="w-4 h-4 text-yellow-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-gray-900 capitalize">
                          {entry.type === "refund"
                            ? "Refund"
                            : entry.type === "attempt"
                            ? "Payment Attempt"
                            : "Payment"}
                        </p>
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                            entry.status === "success"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : entry.status === "failed"
                              ? "bg-red-50 text-red-600 border-red-200"
                              : "bg-yellow-50 text-yellow-700 border-yellow-200"
                          }`}
                        >
                          {entry.status === "success" ? (
                            <CheckCircle2 className="w-2.5 h-2.5" />
                          ) : entry.status === "failed" ? (
                            <XCircle className="w-2.5 h-2.5" />
                          ) : (
                            <Clock className="w-2.5 h-2.5" />
                          )}
                          {entry.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {entry.method} ·{" "}
                        {new Date(entry.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      {entry.transactionId && (
                        <p className="text-[11px] text-gray-400 mt-0.5 font-mono">
                          ID: {entry.transactionId}
                        </p>
                      )}
                      {entry.note && (
                        <p className="text-xs text-gray-500 mt-1 bg-gray-50 rounded-md px-2.5 py-1.5 border border-gray-100">
                          {entry.note}
                        </p>
                      )}
                    </div>
                    <span
                      className={`text-sm font-bold whitespace-nowrap shrink-0 ${
                        entry.type === "refund"
                          ? "text-purple-600"
                          : entry.status === "success"
                          ? "text-emerald-600"
                          : entry.status === "failed"
                          ? "text-red-500"
                          : "text-yellow-600"
                      }`}
                    >
                      {entry.type === "refund" ? "-" : "+"}৳
                      {entry.amount.toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ── Cancel Reason ── */}
          {order.cancelReason && (
            <div className="bg-white rounded-xl border border-red-200 overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-red-100 bg-red-50/50">
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                  <Ban className="w-4 h-4 text-red-600" />
                </div>
                <h2 className="text-sm font-semibold text-red-800">
                  Cancellation Reason
                </h2>
              </div>
              <div className="px-5 py-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {order.cancelReason}
                </p>
              </div>
            </div>
          )}

          {/* ── Return Reason ── */}
          {order.returnReason && (
            <div className="bg-white rounded-xl border border-orange-200 overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-orange-100 bg-orange-50/50">
                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                  <RotateCcw className="w-4 h-4 text-orange-600" />
                </div>
                <h2 className="text-sm font-semibold text-orange-800">
                  Return Reason
                </h2>
              </div>
              <div className="px-5 py-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {order.returnReason}
                </p>
              </div>
            </div>
          )}

          {/* ── Shipping Address ── */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-emerald-600" />
              </div>
              <h2 className="text-sm font-semibold text-gray-900">
                Shipping Address
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 px-5 py-4">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-1">
                  Full Name
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {order.shippingAddress.fullName}
                </p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-1">
                  Phone
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {order.shippingAddress.phone}
                </p>
              </div>
              {order.shippingAddress.email && (
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-1">
                    Email
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {order.shippingAddress.email}
                  </p>
                </div>
              )}
              <div className="col-span-2 sm:col-span-3">
                <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-1">
                  Address
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {order.shippingAddress.addressLine1}
                  {order.shippingAddress.addressLine2
                    ? `, ${order.shippingAddress.addressLine2}`
                    : ""}
                </p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-1">
                  City
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {order.shippingAddress.city}
                </p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-1">
                  District
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {order.shippingAddress.district}
                </p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-1">
                  Division
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {order.shippingAddress.division}
                </p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-1">
                  Postal Code
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {order.shippingAddress.postalCode || "—"}
                </p>
              </div>
            </div>
          </div>

          {/* ── Notes ── */}
          {order.notes && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-amber-600" />
                </div>
                <h2 className="text-sm font-semibold text-gray-900">
                  Order Notes
                </h2>
              </div>
              <div className="px-5 py-4">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {order.notes}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ===== RIGHT COLUMN (1/3) ===== */}
        <div className="flex flex-col gap-6">
          {/* ── Update Status with Confirmation ── */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <Truck className="w-4 h-4 text-blue-600" />
              </div>
              <h2 className="text-sm font-semibold text-gray-900">
                Update Status
              </h2>
            </div>
            <div className="px-5 py-4 space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5 block">
                  Order Status
                </label>
                <div className="relative">
                  <select
                    value={pendingOrderStatus}
                    onChange={(e) =>
                      setPendingOrderStatus(e.target.value as OrderStatus)
                    }
                    className="w-full h-10 pl-3 pr-9 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-800 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  >
                    {Object.values(OrderStatus).map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5 block">
                  Payment Status
                </label>
                <div className="relative">
                  <select
                    value={pendingPaymentStatus}
                    onChange={(e) =>
                      setPendingPaymentStatus(
                        e.target.value as PaymentStatus
                      )
                    }
                    className="w-full h-10 pl-3 pr-9 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-800 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  >
                    {Object.values(PaymentStatus).map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              {/* Warning if changed */}
              {(pendingOrderStatus !== orderStatus ||
                pendingPaymentStatus !== paymentStatus) && (
                <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                  <p className="text-[11px] text-amber-700">
                    You have unsaved changes. Click &quot;Save Changes&quot; to
                    confirm.
                  </p>
                </div>
              )}
              <button
                onClick={handleSaveChanges}
                disabled={
                  pendingOrderStatus === orderStatus &&
                  pendingPaymentStatus === paymentStatus
                }
                className="w-full h-10 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Changes
              </button>
            </div>
          </div>

          {/* ── Status Timeline (every status with date/time) ── */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
              <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
                <Clock className="w-4 h-4 text-violet-600" />
              </div>
              <h2 className="text-sm font-semibold text-gray-900">
                Status History
              </h2>
            </div>
            <div className="px-5 py-4">
              {statusHistory.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">
                  No status history available
                </p>
              ) : (
                <div className="flex flex-col gap-0">
                  {statusHistory.map((entry, idx) => {
                    const isLast = idx === statusHistory.length - 1;
                    const dotColor =
                      timelineDotStyles[entry.status] || "bg-gray-400";
                    return (
                      <div
                        key={idx}
                        className="flex items-start gap-3 relative pb-5 last:pb-0"
                      >
                        {/* Connector line */}
                        {!isLast && (
                          <div className="absolute left-[7px] top-5 w-0.5 h-[calc(100%-12px)] bg-gray-200" />
                        )}
                        {/* Dot */}
                        <div
                          className={`w-[15px] h-[15px] rounded-full shrink-0 mt-0.5 ${dotColor}`}
                        />
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full border ${orderStatusStyles[entry.status]}`}
                            >
                              {entry.status}
                            </span>
                            <span className="text-[11px] text-gray-400">
                              {new Date(entry.date).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}{" "}
                              at{" "}
                              {new Date(entry.date).toLocaleTimeString(
                                "en-US",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </span>
                          </div>
                          {entry.note && (
                            <p className="text-xs text-gray-500 mt-0.5">
                              {entry.note}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ── Payment & Delivery Info ── */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
              <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-teal-600" />
              </div>
              <h2 className="text-sm font-semibold text-gray-900">
                Payment & Delivery
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4 px-5 py-4">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-1">
                  Payment Method
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {order.paymentMethod}
                </p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-1">
                  Payment Status
                </p>
                <span
                  className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${paymentStatusStyles[paymentStatus]}`}
                >
                  {paymentStatus}
                </span>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-1">
                  Shipping Method
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {order.shippingMethod}
                </p>
              </div>
              {order.trackingNumber && (
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-1">
                    Tracking #
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {order.trackingNumber}
                  </p>
                </div>
              )}
              {order.estimatedDelivery && (
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-1">
                    Est. Delivery
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(order.estimatedDelivery).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }
                    )}
                  </p>
                </div>
              )}
              <div>
                <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-1">
                  Order Date
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-1">
                  Last Updated
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(order.updatedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
