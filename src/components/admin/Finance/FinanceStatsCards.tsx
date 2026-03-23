"use client";

import { motion } from "framer-motion";
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  RotateCcw,
  Wallet,
  BarChart3,
  Clock,
  Percent,
} from "lucide-react";
import { financeStats } from "@/src/data/financeData";

const stats = [
  {
    label: "Today's Revenue",
    value: `৳${financeStats.todayRevenue.toLocaleString()}`,
    change: "+12.5%",
    isPositive: true,
    icon: DollarSign,
    gradient: "from-emerald-500 to-green-400",
    sub: "vs yesterday",
  },
  {
    label: "Today's Orders",
    value: financeStats.todayOrders.toString(),
    change: "+8.2%",
    isPositive: true,
    icon: ShoppingCart,
    gradient: "from-blue-500 to-cyan-400",
    sub: "vs yesterday",
  },
  {
    label: "Today's Profit",
    value: `৳${financeStats.todayProfit.toLocaleString()}`,
    change: "+15.3%",
    isPositive: true,
    icon: TrendingUp,
    gradient: "from-violet-500 to-purple-400",
    sub: "vs yesterday",
  },
  {
    label: "Today's Refunds",
    value: `৳${financeStats.todayRefunds.toLocaleString()}`,
    change: "-3.1%",
    isPositive: false,
    icon: RotateCcw,
    gradient: "from-rose-500 to-pink-400",
    sub: "vs yesterday",
  },
  {
    label: "This Week Revenue",
    value: `৳${financeStats.weekRevenue.toLocaleString()}`,
    change: "+22.1%",
    isPositive: true,
    icon: Wallet,
    gradient: "from-amber-500 to-yellow-400",
    sub: "vs last week",
  },
  {
    label: "Avg. Order Value",
    value: `৳${financeStats.avgOrderValue.toLocaleString()}`,
    change: "+5.7%",
    isPositive: true,
    icon: BarChart3,
    gradient: "from-teal-500 to-emerald-400",
    sub: "vs last month",
  },
  {
    label: "Pending Payments",
    value: `৳${financeStats.pendingPayments.toLocaleString()}`,
    change: "3 orders",
    isPositive: false,
    icon: Clock,
    gradient: "from-orange-500 to-amber-400",
    sub: "awaiting",
  },
  {
    label: "Conversion Rate",
    value: `${financeStats.conversionRate}%`,
    change: "+2.4%",
    isPositive: true,
    icon: Percent,
    gradient: "from-indigo-500 to-blue-400",
    sub: "vs last month",
  },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function FinanceStatsCards() {
  return (
    <motion.div
      className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            variants={cardVariants}
            className="group relative bg-white rounded-xl border border-gray-100 p-3 sm:p-4 xl:p-5 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
          >
            <div
              className={`absolute -top-6 -right-6 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-linear-to-br ${stat.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}
            />
            <div
              className={`absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-linear-to-br ${stat.gradient} flex items-center justify-center shadow-lg z-10`}
            >
              <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            </div>

            <div className="relative z-10 pr-10 sm:pr-12">
              <p className="text-[11px] sm:text-xs font-medium text-gray-500 mb-0.5 truncate">
                {stat.label}
              </p>
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 tracking-tight">
                {stat.value}
              </h3>
              <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                <span
                  className={`inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                    stat.isPositive
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-red-50 text-red-500"
                  }`}
                >
                  {stat.isPositive ? (
                    <ArrowUpRight className="w-2.5 h-2.5" />
                  ) : (
                    <ArrowDownRight className="w-2.5 h-2.5" />
                  )}
                  {stat.change}
                </span>
                <span className="text-[10px] text-gray-400 hidden sm:inline">
                  {stat.sub}
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
