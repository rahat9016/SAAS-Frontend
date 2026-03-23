"use client";

import { recentTransactions } from "@/src/data/financeData";
import {
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

const statusIcon = {
  success: <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />,
  pending: <Clock className="w-3.5 h-3.5 text-amber-500" />,
  failed: <XCircle className="w-3.5 h-3.5 text-red-500" />,
};

const statusStyle = {
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  failed: "bg-red-50 text-red-700 border-red-200",
};

export default function TransactionTable() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-50">
        <div>
          <h3 className="text-sm sm:text-base font-semibold text-gray-900">
            Recent Transactions
          </h3>
          <p className="text-[11px] text-gray-400">
            All payment & refund activity
          </p>
        </div>
        <span className="text-xs text-gray-400">
          {recentTransactions.length} transactions
        </span>
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-400 border-b border-gray-50">
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Method</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium text-right">Amount</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {recentTransactions.slice(0, 15).map((txn) => (
              <tr
                key={txn.id}
                className="hover:bg-gray-50/50 transition-colors"
              >
                <td className="px-6 py-3 text-xs text-gray-500 whitespace-nowrap">
                  {new Date(txn.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                  <span className="text-gray-300 ml-1">
                    {new Date(txn.date).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs font-medium text-gray-800">
                  {txn.orderNumber}
                </td>
                <td className="px-4 py-3 text-xs text-gray-600">
                  {txn.customer}
                </td>
                <td className="px-4 py-3">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                    {txn.method}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      txn.type === "refund"
                        ? "bg-rose-50 text-rose-600"
                        : "bg-blue-50 text-blue-600"
                    }`}
                  >
                    {txn.type === "refund" ? (
                      <ArrowDownLeft className="w-2.5 h-2.5" />
                    ) : (
                      <ArrowUpRight className="w-2.5 h-2.5" />
                    )}
                    {txn.type}
                  </span>
                </td>
                <td
                  className={`px-4 py-3 text-sm font-semibold text-right whitespace-nowrap ${
                    txn.amount < 0 ? "text-rose-600" : "text-gray-900"
                  }`}
                >
                  {txn.amount < 0 ? "-" : "+"}৳
                  {Math.abs(txn.amount).toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                      statusStyle[txn.status]
                    }`}
                  >
                    {statusIcon[txn.status]}
                    {txn.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden divide-y divide-gray-50">
        {recentTransactions.slice(0, 10).map((txn) => (
          <div key={txn.id} className="px-4 py-3 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    txn.type === "refund" ? "bg-rose-50" : "bg-blue-50"
                  }`}
                >
                  {txn.type === "refund" ? (
                    <ArrowDownLeft className="w-3 h-3 text-rose-500" />
                  ) : (
                    <ArrowUpRight className="w-3 h-3 text-blue-500" />
                  )}
                </span>
                <div>
                  <p className="text-xs font-medium text-gray-800">
                    {txn.orderNumber}
                  </p>
                  <p className="text-[10px] text-gray-400">{txn.customer}</p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`text-sm font-semibold ${
                    txn.amount < 0 ? "text-rose-600" : "text-gray-900"
                  }`}
                >
                  {txn.amount < 0 ? "-" : "+"}৳
                  {Math.abs(txn.amount).toLocaleString()}
                </p>
                <span
                  className={`inline-flex items-center gap-0.5 text-[9px] font-semibold px-1.5 py-0.5 rounded-full border ${
                    statusStyle[txn.status]
                  }`}
                >
                  {statusIcon[txn.status]}
                  {txn.status}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-gray-400">
              <span>{txn.method}</span>
              <span>·</span>
              <span>
                {new Date(txn.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
