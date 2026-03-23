"use client";

import { Button } from "@/src/components/ui/button";
import { ColumnDef } from "@/src/components/ui/data-table";
import { IOrder, OrderStatus, PaymentStatus } from "@/src/types/ecommerce/order";
import { Eye } from "lucide-react";

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

export const GetOrderColumns = (
  onView?: (id: string) => void
): ColumnDef<IOrder>[] => {
  return [
    {
      header: "Order #",
      accessorKey: "orderNumber",
      cell: (value) => (
        <span className="font-semibold text-secondary">
          {value as string}
        </span>
      ),
    },
    {
      header: "Customer",
      accessorKey: "shippingAddress",
      cell: (value) => {
        const addr = value as IOrder["shippingAddress"];
        return (
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">{addr.fullName}</p>
            <p className="text-xs text-gray-400 truncate">{addr.phone}</p>
          </div>
        );
      },
    },
    {
      header: "Date",
      accessorKey: "createdAt",
      cell: (value) => {
        const date = new Date(value as string);
        return (
          <span className="text-sm text-gray-600">
            {date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        );
      },
    },
    {
      header: "Items",
      accessorKey: "items",
      cell: (value) => {
        const items = value as IOrder["items"];
        return (
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-xs font-semibold text-gray-700">
            {items.length}
          </span>
        );
      },
    },
    {
      header: "Total",
      accessorKey: "total",
      cell: (value) => (
        <span className="font-semibold text-gray-900">
          ৳{Number(value).toLocaleString()}
        </span>
      ),
    },
    {
      header: "Payment",
      accessorKey: "paymentMethod",
      cell: (value) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
          {value as string}
        </span>
      ),
    },
    {
      header: "Payment Status",
      accessorKey: "paymentStatus",
      cell: (value) => {
        const status = value as PaymentStatus;
        return (
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${paymentStatusStyles[status]}`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                status === PaymentStatus.PAID
                  ? "bg-emerald-500"
                  : status === PaymentStatus.PENDING
                  ? "bg-yellow-500"
                  : status === PaymentStatus.FAILED
                  ? "bg-red-500"
                  : "bg-purple-500"
              }`}
            />
            {status}
          </span>
        );
      },
    },
    {
      header: "Order Status",
      accessorKey: "orderStatus",
      cell: (value) => {
        const status = value as OrderStatus;
        return (
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border capitalize ${orderStatusStyles[status]}`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                status === OrderStatus.DELIVERED
                  ? "bg-emerald-500"
                  : status === OrderStatus.SHIPPED
                  ? "bg-cyan-500"
                  : status === OrderStatus.PROCESSING
                  ? "bg-indigo-500"
                  : status === OrderStatus.CONFIRMED
                  ? "bg-blue-500"
                  : status === OrderStatus.PENDING
                  ? "bg-yellow-500"
                  : status === OrderStatus.CANCELLED
                  ? "bg-red-500"
                  : status === OrderStatus.RETURNED
                  ? "bg-orange-500"
                  : "bg-purple-500"
              }`}
            />
            {status}
          </span>
        );
      },
    },
    {
      header: "Action",
      accessorKey: "actions" as keyof IOrder,
      cell: (_value, row) => {
        const order = row as IOrder;
        return (
          <Button
            className="w-9! min-h-9 border border-[#E6E6E6] flex items-center justify-center rounded-lg bg-light hover:bg-light cursor-pointer"
            size="sm"
            onClick={() => onView?.(order.id)}
          >
            <Eye className="h-4 w-4 text-secondary-foreground" />
          </Button>
        );
      },
    },
  ];
};
