"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useGet } from "@/src/hooks/useGet";
import StatsCardsSkeleton from "./Skeleton/StatsCardsSkeleton";
import { statsCardConfigs } from "@/src/data/dashboard/statsCardConfigs";
import type { DashboardStatResponse } from "@/src/types/dashboard/dashboard";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
};

export default function StatsCards() {
  const { data, isLoading } = useGet<DashboardStatResponse[]>(
    "/api/dashboard/stats",
    ["dashboard", "stats"]
  );
  const statsData = data?.data;

  if (isLoading || !statsData) return <StatsCardsSkeleton />;

  // Map dynamic data by key for easy lookup
  const statsMap = new Map(statsData.map((s) => [s.key, s]));

  return (
    <motion.div
      className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 xl:gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {statsCardConfigs.map((config) => {
        const Icon = config.icon;
        const stat = statsMap.get(config.key);
        if (!stat) return null;

        return (
          <motion.div
            key={config.key}
            variants={cardVariants}
            className="group relative bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-3 sm:p-4 xl:p-6 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
          >
            <div
              className={`absolute -top-6 -right-6 sm:-top-8 sm:-right-8 w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-linear-to-br ${config.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}
            />
            <div
              className={`absolute top-3 right-3 sm:top-4 sm:right-4 lg:top-5 lg:right-5 w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl bg-linear-to-br ${config.gradient} flex items-center justify-center shadow-lg z-10`}
            >
              <Icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
            </div>

            <div className="relative z-10 pr-12 sm:pr-14 lg:pr-16">
              <p className="text-xs sm:text-sm font-medium text-gray-500 mb-0.5 sm:mb-1 truncate">
                {config.label}
              </p>
              <h3 className="text-lg sm:text-xl lg:text-[1.7rem] font-bold text-gray-900 tracking-tight">
                {stat.value}
              </h3>
              <div className="flex items-center gap-1 mt-1.5 sm:mt-2.5 flex-wrap">
                <span
                  className={`inline-flex items-center gap-0.5 text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 rounded-full ${
                    stat.isPositive
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-red-50 text-red-500"
                  }`}
                >
                  {stat.isPositive ? (
                    <ArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  ) : (
                    <ArrowDownRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  )}
                  {stat.change}
                </span>
                <span className="text-[10px] sm:text-xs text-gray-400 hidden sm:inline">
                  vs last month
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
