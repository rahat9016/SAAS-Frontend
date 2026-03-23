"use client";

import { siteConfig } from "@/src/config/siteConfig";
import { dummyOrders } from "@/src/data/dummyOrders";
import { IOrder, OrderStatus } from "@/src/types/ecommerce/order";
import { ChevronRight, Package, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

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

const tabs = [
  { label: "All", value: "all" },
  { label: "Pending", value: OrderStatus.PENDING },
  { label: "Processing", value: OrderStatus.PROCESSING },
  { label: "Shipped", value: OrderStatus.SHIPPED },
  { label: "Delivered", value: OrderStatus.DELIVERED },
];

function OrderCard({ order }: { order: IOrder }) {
  return (
    <div className="border border-gray-100 rounded-xl bg-white overflow-hidden hover:shadow-sm transition-shadow shadow-sm">
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
          {order.items.length > 3 && (
            <p className="text-xs text-gray-400">
              +{order.items.length - 3} more item(s)
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-t border-gray-100">
        <span className="text-sm font-bold text-gray-900">
          Total: {siteConfig.currencySymbol}{order.total.toLocaleString()}
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
  );
}

export default function AccountOrdersPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = useMemo(() => {
    return dummyOrders.filter((order) => {
      const matchesTab = activeTab === "all" || order.orderStatus === activeTab;
      const matchesSearch = searchQuery
        ? order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.items.some((item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : true;
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl lg:text-2xl font-bold text-gray-900">My Orders</h1>
        <p className="text-sm text-gray-500 mt-1">Track and manage your orders</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by order number or product name..."
          className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-3.5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all border cursor-pointer ${
              activeTab === tab.value
                ? "bg-primary text-white border-primary shadow-sm"
                : "bg-white text-gray-600 border-gray-200 hover:border-primary/30 hover:text-primary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Order List */}
      {filteredOrders.length > 0 ? (
        <div className="flex flex-col gap-4">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 text-gray-400">
            <Package size={28} />
          </div>
          <p className="text-sm font-medium text-gray-600">No orders found</p>
          <p className="text-xs text-gray-400">
            {searchQuery ? "Try a different search term" : "Your orders will appear here"}
          </p>
        </div>
      )}
    </div>
  );
}
