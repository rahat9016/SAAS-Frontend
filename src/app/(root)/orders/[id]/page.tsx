"use client";

import { dummyOrders } from "@/src/data/dummyOrders";
import { OrderStatus } from "@/src/types/ecommerce/order";
import { ArrowLeft, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { use } from "react";
import styles from "../Orders.module.css";

const statusBadgeClass: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: styles.badgePending,
  [OrderStatus.CONFIRMED]: styles.badgeConfirmed,
  [OrderStatus.PROCESSING]: styles.badgeProcessing,
  [OrderStatus.SHIPPED]: styles.badgeShipped,
  [OrderStatus.DELIVERED]: styles.badgeDelivered,
  [OrderStatus.CANCELLED]: styles.badgeCancelled,
  [OrderStatus.RETURNED]: styles.badgeReturned,
  [OrderStatus.REFUNDED]: styles.badgeRefunded,
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
      <div className="container">
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <Package size={32} />
          </div>
          <h1 className={styles.emptyTitle}>Order not found</h1>
          <p className={styles.emptyText}>
            The order you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link href="/orders" className={styles.emptyBtn}>
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const currentStatusIdx = STATUS_FLOW.indexOf(order.orderStatus);

  return (
    <div className="container">
      <div className={styles.page}>
        <Link href="/orders" className={styles.backLink}>
          <ArrowLeft size={16} />
          Back to Orders
        </Link>

        {/* Title + Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            flexWrap: "wrap",
            marginBottom: "1.5rem",
          }}
        >
          <h1 className={styles.title} style={{ marginBottom: 0 }}>
            {order.orderNumber}
          </h1>
          <span
            className={`${styles.badge} ${statusBadgeClass[order.orderStatus]}`}
          >
            {order.orderStatus}
          </span>
        </div>

        <div className={styles.detailGrid}>
          {/* === LEFT: Items + Shipping === */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
          >
            {/* Items */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionBullet} />
                Order Items
              </h2>
              <div className={styles.orderItems}>
                {order.items.map((item, idx) => (
                  <div key={idx} className={styles.orderItem}>
                    <div className={styles.orderItemImage}>
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className={styles.orderItemInfo}>
                      <p className={styles.orderItemName}>{item.name}</p>
                      <p className={styles.orderItemMeta}>
                        Qty: {item.quantity} · ৳{item.price.toLocaleString()}
                      </p>
                    </div>
                    <span
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                      }}
                    >
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionBullet} />
                Shipping Address
              </h2>
              <div className={styles.infoGrid}>
                <div>
                  <p className={styles.infoLabel}>Full Name</p>
                  <p className={styles.infoValue}>
                    {order.shippingAddress.fullName}
                  </p>
                </div>
                <div>
                  <p className={styles.infoLabel}>Phone</p>
                  <p className={styles.infoValue}>
                    {order.shippingAddress.phone}
                  </p>
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <p className={styles.infoLabel}>Address</p>
                  <p className={styles.infoValue}>
                    {order.shippingAddress.addressLine1}
                    {order.shippingAddress.addressLine2
                      ? `, ${order.shippingAddress.addressLine2}`
                      : ""}
                  </p>
                </div>
                <div>
                  <p className={styles.infoLabel}>City</p>
                  <p className={styles.infoValue}>
                    {order.shippingAddress.city}
                  </p>
                </div>
                <div>
                  <p className={styles.infoLabel}>District</p>
                  <p className={styles.infoValue}>
                    {order.shippingAddress.district}
                  </p>
                </div>
                <div>
                  <p className={styles.infoLabel}>Division</p>
                  <p className={styles.infoValue}>
                    {order.shippingAddress.division}
                  </p>
                </div>
                <div>
                  <p className={styles.infoLabel}>Postal Code</p>
                  <p className={styles.infoValue}>
                    {order.shippingAddress.postalCode || "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* === RIGHT: Timeline + Payment + Summary === */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
          >
            {/* Status Timeline */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionBullet} />
                Order Status
              </h2>
              <div className={styles.timeline}>
                {STATUS_FLOW.map((status, idx) => {
                  const isDone = idx < currentStatusIdx;
                  const isActive = idx === currentStatusIdx;

                  return (
                    <div key={status} className={styles.timelineStep}>
                      <div
                        className={`${styles.timelineDot} ${
                          isDone
                            ? styles.timelineDotDone
                            : isActive
                            ? styles.timelineDotActive
                            : ""
                        }`}
                      />
                      <div>
                        <p
                          className={styles.timelineLabel}
                          style={{
                            opacity: isDone || isActive ? 1 : 0.45,
                          }}
                        >
                          {status}
                        </p>
                        {isActive && (
                          <p className={styles.timelineDate}>
                            {new Date(order.updatedAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Payment & Tracking */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionBullet} />
                Payment & Delivery
              </h2>
              <div className={styles.infoGrid}>
                <div>
                  <p className={styles.infoLabel}>Payment Method</p>
                  <p className={styles.infoValue}>{order.paymentMethod}</p>
                </div>
                <div>
                  <p className={styles.infoLabel}>Payment Status</p>
                  <p className={styles.infoValue}>{order.paymentStatus}</p>
                </div>
                {order.trackingNumber && (
                  <div>
                    <p className={styles.infoLabel}>Tracking Number</p>
                    <p className={styles.infoValue}>{order.trackingNumber}</p>
                  </div>
                )}
                {order.estimatedDelivery && (
                  <div>
                    <p className={styles.infoLabel}>Estimated Delivery</p>
                    <p className={styles.infoValue}>
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
              </div>
            </div>

            {/* Order Summary */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionBullet} />
                Order Total
              </h2>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Subtotal</span>
                  <span className={styles.summaryValue}>
                    ৳{order.subtotal.toLocaleString()}
                  </span>
                </div>
                {order.discount > 0 && (
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>
                      Discount{order.couponCode ? ` (${order.couponCode})` : ""}
                    </span>
                    <span
                      className={styles.summaryValue}
                      style={{ color: "#16a34a" }}
                    >
                      -৳{order.discount.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Shipping</span>
                  <span
                    className={styles.summaryValue}
                    style={{
                      color: order.shippingCost === 0 ? "#16a34a" : undefined,
                    }}
                  >
                    {order.shippingCost === 0
                      ? "Free"
                      : `৳${order.shippingCost.toLocaleString()}`}
                  </span>
                </div>
                <hr className={styles.summaryDivider} />
                <div
                  className={`${styles.summaryRow} ${styles.summaryTotal}`}
                >
                  <span>Total</span>
                  <span className={styles.summaryTotalValue}>
                    ৳{order.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
