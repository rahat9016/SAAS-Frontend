"use client";

import { dummyOrders } from "@/src/data/dummyOrders";
import { OrderStatus } from "@/src/types/ecommerce/order";
import { ArrowRight, ChevronRight, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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

export default function OrdersPage() {
  if (dummyOrders.length === 0) {
    return (
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-center gap-4">
          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Package size={32} />
          </div>
          <h1 className="text-xl font-bold text-foreground">No orders yet</h1>
          <p className="text-sm text-muted-foreground max-w-xs">
            When you place an order, it will appear here.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 mt-2 px-6 py-2.5 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity no-underline"
          >
            Start Shopping
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 sm:px-6 lg:px-8">
      <div className="py-4 sm:py-6 lg:py-8 pb-20 lg:pb-16">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-4 sm:mb-6">
          My Orders
        </h1>

        <div className="flex flex-col gap-4">
          {dummyOrders.map((order) => (
            <div key={order.id} className="border border-border rounded-xl bg-card overflow-hidden hover:shadow-sm transition-shadow">
              {/* Header */}
              <div className="flex items-center justify-between px-4 sm:px-5 py-3 bg-muted/30 border-b border-border">
                <div className="flex items-center gap-1 text-sm">
                  <span className="font-semibold text-foreground">{order.orderNumber}</span>
                  <span className="text-muted-foreground">
                    {" "}·{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <span
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border capitalize ${statusColors[order.orderStatus]}`}
                >
                  {order.orderStatus}
                </span>
              </div>

              {/* Items */}
              <div className="px-4 sm:px-5 py-3">
                <div className="flex flex-col gap-2.5">
                  {order.items.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
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
                        <p className="text-xs sm:text-sm font-medium text-foreground line-clamp-1">
                          {item.name}
                        </p>
                        <p className="text-[11px] sm:text-xs text-muted-foreground">
                          Qty: {item.quantity} · ৳
                          {item.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <p className="text-xs text-muted-foreground">
                      +{order.items.length - 3} more item(s)
                    </p>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-t border-border">
                <span className="text-sm font-bold text-foreground">
                  Total: ৳{order.total.toLocaleString()}
                </span>
                <Link
                  href={`/orders/${order.id}`}
                  className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline no-underline"
                >
                  View Details
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
