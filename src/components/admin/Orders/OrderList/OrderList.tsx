"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import OrdersTable from "../OrdersTable";
import { GetOrderColumns } from "../TableColumns/OrderColumns";
import { dummyOrders } from "@/src/data/dummyOrders";
import { IOrder, OrderStatus } from "@/src/types/ecommerce/order";

const STATUS_TABS: { label: string; value: string }[] = [
  { label: "All", value: "ALL" },
  { label: "Pending", value: OrderStatus.PENDING },
  { label: "Confirmed", value: OrderStatus.CONFIRMED },
  { label: "Processing", value: OrderStatus.PROCESSING },
  { label: "Shipped", value: OrderStatus.SHIPPED },
  { label: "Delivered", value: OrderStatus.DELIVERED },
  { label: "Cancelled", value: OrderStatus.CANCELLED },
  { label: "Returned", value: OrderStatus.RETURNED },
  { label: "Refunded", value: OrderStatus.REFUNDED },
];

const statusTabActiveStyles: Record<string, string> = {
  ALL: "bg-primary text-white",
  [OrderStatus.PENDING]: "bg-yellow-500 text-white",
  [OrderStatus.CONFIRMED]: "bg-blue-500 text-white",
  [OrderStatus.PROCESSING]: "bg-indigo-500 text-white",
  [OrderStatus.SHIPPED]: "bg-cyan-500 text-white",
  [OrderStatus.DELIVERED]: "bg-emerald-500 text-white",
  [OrderStatus.CANCELLED]: "bg-red-500 text-white",
  [OrderStatus.RETURNED]: "bg-orange-500 text-white",
  [OrderStatus.REFUNDED]: "bg-purple-500 text-white",
};

export default function OrderList() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleView = (id: string) => {
    router.push(`/admin/orders/${id}`);
  };

  const columns = GetOrderColumns(handleView);

  const filteredOrders = useMemo(() => {
    let result = dummyOrders;

    // Filter by status tab
    if (activeStatus !== "ALL") {
      result = result.filter((order) => order.orderStatus === activeStatus);
    }

    // Filter by search
    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(query) ||
          order.shippingAddress.fullName.toLowerCase().includes(query) ||
          order.paymentMethod.toLowerCase().includes(query)
      );
    }

    return result;
  }, [search, activeStatus]);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, currentPage, itemsPerPage]);

  // Count orders per status for badges
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: dummyOrders.length };
    Object.values(OrderStatus).forEach((status) => {
      counts[status] = dummyOrders.filter(
        (o) => o.orderStatus === status
      ).length;
    });
    return counts;
  }, []);

  // Status filter + search component injected below the table title
  const statusFilterComponent = (
    <div className="w-full space-y-3">
      {/* Status Tabs - full width */}
      <div className="flex flex-wrap gap-1.5">
        {STATUS_TABS.map((tab) => {
          const isActive = activeStatus === tab.value;
          const count = statusCounts[tab.value] || 0;
          return (
            <button
              key={tab.value}
              onClick={() => {
                setActiveStatus(tab.value);
                setCurrentPage(1);
              }}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer border ${
                isActive
                  ? `${statusTabActiveStyles[tab.value]} border-transparent shadow-sm`
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
              }`}
            >
              {tab.label}
              <span
                className={`inline-flex items-center justify-center min-w-4 h-4 px-0.5 rounded text-[9px] font-bold ${
                  isActive
                    ? "bg-white/25 text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div>
      <OrdersTable<IOrder>
        columns={columns}
        data={paginatedOrders}
        isLoading={false}
        totalItems={filteredOrders.length}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        setCurrentPage={setCurrentPage}
        setItemsPerPage={(val) => {
          setItemsPerPage(Number(val));
          setCurrentPage(1);
        }}
        search={search}
        showSearch
        handleSearchChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        statusFilterComponent={statusFilterComponent}
      />
    </div>
  );
}
