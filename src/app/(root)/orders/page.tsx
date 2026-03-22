"use client";

import { dummyOrders } from "@/src/data/dummyOrders";
import { OrderStatus } from "@/src/types/ecommerce/order";
import { ArrowRight, ChevronRight, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Orders.module.css";

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

export default function OrdersPage() {
  if (dummyOrders.length === 0) {
    return (
      <div className="container">
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <Package size={32} />
          </div>
          <h1 className={styles.emptyTitle}>No orders yet</h1>
          <p className={styles.emptyText}>
            When you place an order, it will appear here.
          </p>
          <Link href="/" className={styles.emptyBtn}>
            Start Shopping
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className={styles.page}>
        <h1 className={styles.title}>My Orders</h1>

        {dummyOrders.map((order) => (
          <div key={order.id} className={styles.orderCard}>
            {/* Header */}
            <div className={styles.orderHeader}>
              <div>
                <span className={styles.orderNumber}>{order.orderNumber}</span>
                <span className={styles.orderDate}>
                  {" "}
                  ·{" "}
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <span
                className={`${styles.badge} ${statusBadgeClass[order.orderStatus]}`}
              >
                {order.orderStatus}
              </span>
            </div>

            {/* Items */}
            <div className={styles.orderBody}>
              <div className={styles.orderItems}>
                {order.items.slice(0, 3).map((item, idx) => (
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
                        Qty: {item.quantity} · ৳
                        {item.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
                {order.items.length > 3 && (
                  <p
                    style={{
                      fontSize: "0.78rem",
                      color: "var(--muted-foreground)",
                    }}
                  >
                    +{order.items.length - 3} more item(s)
                  </p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className={styles.orderFooter}>
              <span className={styles.orderTotal}>
                Total: ৳{order.total.toLocaleString()}
              </span>
              <Link
                href={`/orders/${order.id}`}
                className={styles.viewBtn}
              >
                View Details
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
