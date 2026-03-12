"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Award } from "lucide-react";
import { useGet } from "@/src/hooks/useGet";
import BestSellingProductsSkeleton from "./Skeleton/BestSellingProductsSkeleton";

interface BestSellingProduct {
  rank: number;
  name: string;
  sold: number;
  revenue: string;
  percent: number;
  color: string;
}

export default function BestSellingProducts() {
  const { data, isLoading } = useGet<BestSellingProduct[]>(
    "/api/dashboard/best-selling",
    ["dashboard", "best-selling"]
  );
  const products = data?.data;

  if (isLoading || !products) return <BestSellingProductsSkeleton />;

  return (
    <Card className="border-gray-100 shadow-sm rounded-2xl py-4 sm:py-5 h-full">
      <CardHeader className="pb-2 px-4 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#d97706] to-[#fbbf24] flex items-center justify-center shrink-0">
            <Award className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">
              Best Selling Products
            </CardTitle>
            <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5">
              Top 5 products this month
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2 px-3 sm:px-6">
        <div className="space-y-3 sm:space-y-4">
          {products.map((product) => (
            <div key={product.rank} className="flex items-center gap-2 sm:gap-3 group">
              {/* Rank */}
              <span
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-md sm:rounded-lg flex items-center justify-center text-[10px] sm:text-xs font-bold text-white shrink-0"
                style={{ backgroundColor: product.color }}
              >
                {product.rank}
              </span>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-800 truncate pr-2">
                    {product.name}
                  </p>
                  <span className="text-xs sm:text-sm font-semibold text-gray-900 shrink-0">
                    {product.revenue}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {/* Progress bar */}
                  <div className="flex-1 h-1 sm:h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${product.percent}%`,
                        backgroundColor: product.color,
                      }}
                    />
                  </div>
                  <span className="text-[10px] sm:text-[11px] text-gray-400 shrink-0 w-12 sm:w-16 text-right">
                    {product.sold} sold
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
