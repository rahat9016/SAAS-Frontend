"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { TrendingUp } from "lucide-react";
import { useGet } from "@/src/hooks/useGet";
import RevenueChartSkeleton from "./Skeleton/RevenueChartSkeleton";

interface RevenueDataPoint {
  month: string;
  revenue: number;
  orders: number;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; dataKey: string }[];
  label?: string;
}) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-3 min-w-[160px]">
        <p className="text-xs font-medium text-gray-400 mb-1.5">{label}</p>
        {payload.map((entry) => (
          <div
            key={entry.dataKey}
            className="flex items-center justify-between gap-4"
          >
            <span className="text-sm text-gray-600 capitalize">
              {entry.dataKey}
            </span>
            <span className="text-sm font-semibold text-gray-900">
              {entry.dataKey === "revenue"
                ? `৳${(entry.value / 1000).toFixed(0)}k`
                : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export default function RevenueChart() {
  const { data, isLoading } = useGet<RevenueDataPoint[]>(
    "/api/dashboard/revenue",
    ["dashboard", "revenue"]
  );
  const revenueData = data?.data;

  if (isLoading || !revenueData) return <RevenueChartSkeleton />;

  return (
    <Card className="border-gray-100 shadow-sm rounded-2xl py-4 sm:py-5">
      <CardHeader className="pb-2 px-4 sm:px-6">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#009dab] to-[#00c9db] flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">
                Revenue Overview
              </CardTitle>
              <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5">
                Monthly revenue for the last 7 months
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600">
            <TrendingUp className="w-3 h-3" />
            +14.2%
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-2 px-2 sm:px-6">
        <div className="w-full h-[220px] sm:h-[280px] lg:h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={revenueData}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#009dab" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#009dab" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="ordersGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f1f5f9"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#009dab"
                strokeWidth={2.5}
                fill="url(#revenueGrad)"
                dot={false}
                activeDot={{
                  r: 5,
                  fill: "#009dab",
                  stroke: "#fff",
                  strokeWidth: 2,
                }}
              />
              <Area
                type="monotone"
                dataKey="orders"
                stroke="#4f46e5"
                strokeWidth={2}
                fill="url(#ordersGrad)"
                dot={false}
                activeDot={{
                  r: 4,
                  fill: "#4f46e5",
                  stroke: "#fff",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#009dab]" />
            <span className="text-xs text-gray-500">Revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#4f46e5]" />
            <span className="text-xs text-gray-500">Orders</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
