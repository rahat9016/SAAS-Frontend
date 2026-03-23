"use client";

import { paymentMethodBreakdown } from "@/src/data/financeData";
import { CreditCard } from "lucide-react";

const methodColors: Record<string, string> = {
  COD: "bg-amber-500",
  BKASH: "bg-pink-500",
  NAGAD: "bg-orange-500",
  SSLCOMMERZ: "bg-emerald-500",
  STRIPE: "bg-indigo-500",
};

const methodBg: Record<string, string> = {
  COD: "bg-amber-50",
  BKASH: "bg-pink-50",
  NAGAD: "bg-orange-50",
  SSLCOMMERZ: "bg-emerald-50",
  STRIPE: "bg-indigo-50",
};

export default function PaymentMethodBreakdown() {
  const totalAmount = paymentMethodBreakdown.reduce(
    (s, m) => s + m.amount,
    0
  );

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2.5 px-4 sm:px-6 py-4 border-b border-gray-50">
        <div className="w-9 h-9 rounded-lg bg-linear-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
          <CreditCard className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="text-sm sm:text-base font-semibold text-gray-900">
            Payment Methods
          </h3>
          <p className="text-[11px] text-gray-400">
            Revenue by payment method
          </p>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-4 space-y-3">
        {paymentMethodBreakdown.map((pm) => (
          <div key={pm.method} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span
                  className={`w-6 h-6 rounded-md flex items-center justify-center ${
                    methodBg[pm.method] ?? "bg-gray-50"
                  }`}
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      methodColors[pm.method] ?? "bg-gray-400"
                    }`}
                  />
                </span>
                <span className="font-medium text-gray-800 text-xs">
                  {pm.method}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400">
                  {pm.count} orders
                </span>
                <span className="text-xs font-semibold text-gray-900 min-w-[70px] text-right">
                  ৳{pm.amount.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  methodColors[pm.method] ?? "bg-gray-400"
                }`}
                style={{
                  width: `${(pm.amount / totalAmount) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}

        <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500">Total</span>
          <span className="text-sm font-bold text-gray-900">
            ৳{totalAmount.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
