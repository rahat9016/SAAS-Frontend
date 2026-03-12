"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Package } from "lucide-react";
import { useGet } from "@/src/hooks/useGet";
import RecentOrdersSkeleton from "./Skeleton/RecentOrdersSkeleton";
import type { OrderStatus, RecentOrder } from "@/src/types/dashboard/dashboard";



const statusStyles: Record<OrderStatus, string> = {
  Completed: "bg-emerald-50 text-emerald-600 border-emerald-200",
  Processing: "bg-amber-50 text-amber-600 border-amber-200",
  Cancelled: "bg-red-50 text-red-500 border-red-200",
};

const statusDot: Record<OrderStatus, string> = {
  Completed: "bg-emerald-500",
  Processing: "bg-amber-500",
  Cancelled: "bg-red-500",
};

export default function RecentOrders() {
  const { data, isLoading } = useGet<RecentOrder[]>(
    "/api/dashboard/recent-orders",
    ["dashboard", "recent-orders"]
  );
  const orders = data?.data;

  if (isLoading || !orders) return <RecentOrdersSkeleton />;

  return (
    <Card className="border-gray-100 shadow-sm rounded-2xl py-4 sm:py-5 h-full">
      <CardHeader className="pb-2 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#4f46e5] to-[#818cf8] flex items-center justify-center shrink-0">
            <Package className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">
              Recent Orders
            </CardTitle>
            <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5">
              Latest 6 orders placed
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2 px-2 sm:px-6">
        {/* Mobile card view */}
        <div className="block sm:hidden space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-3 rounded-xl bg-gray-50/70 border border-gray-100"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-gray-800">
                    {order.id}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${statusStyles[order.status]}`}
                  >
                    <span
                      className={`w-1 h-1 rounded-full ${statusDot[order.status]}`}
                    />
                    {order.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 truncate">
                  {order.customer}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {order.date}
                </p>
              </div>
              <span className="text-sm font-bold text-gray-900 shrink-0 ml-3">
                {order.amount}
              </span>
            </div>
          ))}
        </div>

        {/* Desktop/tablet table view */}
        <div className="hidden sm:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-100 hover:bg-transparent">
                <TableHead className="text-xs text-gray-400 font-medium">
                  Order ID
                </TableHead>
                <TableHead className="text-xs text-gray-400 font-medium">
                  Customer
                </TableHead>
                <TableHead className="text-xs text-gray-400 font-medium hidden md:table-cell">
                  Date
                </TableHead>
                <TableHead className="text-xs text-gray-400 font-medium text-right">
                  Amount
                </TableHead>
                <TableHead className="text-xs text-gray-400 font-medium text-right">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow
                  key={order.id}
                  className="border-gray-50 hover:bg-gray-50/50 transition-colors"
                >
                  <TableCell className="text-sm font-medium text-gray-800">
                    {order.id}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {order.customer}
                  </TableCell>
                  <TableCell className="text-sm text-gray-400 hidden md:table-cell">
                    {order.date}
                  </TableCell>
                  <TableCell className="text-sm font-semibold text-gray-900 text-right">
                    {order.amount}
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${statusStyles[order.status]}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${statusDot[order.status]}`}
                      />
                      {order.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
