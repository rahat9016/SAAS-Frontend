"use client";

import { siteConfig } from "@/src/config/siteConfig";
import { dummyOrders } from "@/src/data/dummyOrders";
import { OrderStatus } from "@/src/types/ecommerce/order";
import { ChevronRight, RotateCcw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const statusColors: Record<string, string> = {
  [OrderStatus.RETURNED]: "bg-orange-50 text-orange-700 border-orange-200",
  [OrderStatus.REFUNDED]: "bg-purple-50 text-purple-700 border-purple-200",
};

export default function ReturnsPage() {
  const returnedOrders = dummyOrders.filter(
    (order) =>
      order.orderStatus === OrderStatus.RETURNED ||
      order.orderStatus === OrderStatus.REFUNDED
  );

  if (returnedOrders.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">My Returns</h1>
          <p className="text-sm text-gray-500 mt-1">Track your returned orders</p>
        </div>
        <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-orange-50 text-orange-400">
            <RotateCcw size={28} />
          </div>
          <p className="text-sm font-medium text-gray-600">No returned orders</p>
          <p className="text-xs text-gray-400">Your returned orders will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl lg:text-2xl font-bold text-gray-900">My Returns</h1>
        <p className="text-sm text-gray-500 mt-1">Track your returned orders</p>
      </div>

      <div className="flex flex-col gap-4">
        {returnedOrders.map((order) => (
          <div
            key={order.id}
            className="border border-gray-100 rounded-xl bg-white overflow-hidden hover:shadow-sm transition-shadow shadow-sm"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-3 bg-gray-50/60 border-b border-gray-100">
              <div className="flex items-center gap-1.5 text-sm">
                <span className="font-semibold text-gray-900">{order.orderNumber}</span>
                <span className="text-gray-400">·</span>
                <span className="text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <span
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border capitalize ${
                  statusColors[order.orderStatus] || "bg-gray-50 text-gray-600 border-gray-200"
                }`}
              >
                {order.orderStatus}
              </span>
            </div>

            {/* Items */}
            <div className="px-4 sm:px-5 py-3">
              <div className="flex flex-col gap-2.5">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="relative w-11 sm:w-12 min-w-11 sm:min-w-12 h-11 sm:h-12 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-800 line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-[11px] sm:text-xs text-gray-500">
                        Qty: {item.quantity} · {siteConfig.currencySymbol}
                        {item.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-t border-gray-100">
              <span className="text-sm font-bold text-gray-900">
                Refund: {siteConfig.currencySymbol}{order.total.toLocaleString()}
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
  );
}
