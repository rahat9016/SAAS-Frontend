"use client";

import { ledgerEntries } from "@/src/data/financeData";
import {
  ScrollText,
  ArrowUpRight,
  ArrowDownLeft,
  Receipt,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";

const typeConfig = {
  Sale: {
    icon: <ArrowUpRight className="w-3 h-3 text-emerald-500" />,
    bg: "bg-emerald-50",
    label: "text-emerald-700",
  },
  Refund: {
    icon: <ArrowDownLeft className="w-3 h-3 text-rose-500" />,
    bg: "bg-rose-50",
    label: "text-rose-700",
  },
  Expense: {
    icon: <Receipt className="w-3 h-3 text-amber-500" />,
    bg: "bg-amber-50",
    label: "text-amber-700",
  },
};

export default function TransactionLedger() {
  // Show entries in reverse chronological order for display
  const displayEntries = [...ledgerEntries].reverse();
  const finalBalance = ledgerEntries[ledgerEntries.length - 1]?.balance ?? 0;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-50">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-linear-to-br from-indigo-500 to-blue-400 flex items-center justify-center shadow-lg">
            <ScrollText className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-gray-900">
              Transaction Ledger
            </h3>
            <p className="text-[11px] text-gray-400">
              Complete deposit & withdrawal history
            </p>
          </div>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow className="border-b border-gray-50 bg-light h-15 border-t-0">
              <TableHead className="font-medium text-sm text-secondary-dark px-5">Date</TableHead>
              <TableHead className="font-medium text-sm text-secondary-dark px-5">Type</TableHead>
              <TableHead className="font-medium text-sm text-secondary-dark px-5">Description</TableHead>
              <TableHead className="font-medium text-sm text-secondary-dark px-5 text-right">Amount</TableHead>
              <TableHead className="font-medium text-sm text-secondary-dark px-5 text-right">Current Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white">
            {displayEntries.map((entry, idx) => {
              const cfg = typeConfig[entry.type];
              return (
                <TableRow
                  key={entry.id}
                  className={`h-18 transition-colors ${
                    idx % 2 === 1 ? "bg-gray-50/30" : ""
                  } hover:bg-gray-50/60`}
                >
                  <TableCell className="max-w-50 truncate whitespace-nowrap px-5 text-sm text-gray-500 border-b border-light-dark">
                    {new Date(entry.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="max-w-50 truncate whitespace-nowrap px-5 text-sm border-b border-light-dark">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.label}`}
                    >
                      {cfg.icon}
                      {entry.type}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate whitespace-nowrap px-5 text-sm text-gray-600 border-b border-light-dark">
                    {entry.description}
                  </TableCell>
                  <TableCell className="max-w-50 truncate whitespace-nowrap px-5 text-sm font-semibold text-right border-b border-light-dark">
                    {entry.credit > 0 ? (
                      <span className="text-emerald-600">
                        +৳{entry.credit.toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-gray-900">
                        -৳{entry.debit.toLocaleString()}
                      </span>
                    )}
                  </TableCell>
                  <TableCell
                    className="max-w-50 truncate whitespace-nowrap px-5 text-sm font-bold text-right border-b border-light-dark text-gray-900"
                  >
                    ৳{entry.balance.toLocaleString()}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden divide-y divide-gray-50">
        {displayEntries.map((entry) => {
          const cfg = typeConfig[entry.type];
          return (
            <div key={entry.id} className="px-4 py-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${cfg.bg}`}
                  >
                    {cfg.icon}
                  </span>
                  <div>
                    <p className="text-xs font-medium text-gray-800">
                      {entry.type}
                    </p>
                    <p className="text-[10px] text-gray-400 truncate max-w-[180px]">
                      {entry.description}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {entry.credit > 0 ? (
                    <p className="text-xs font-semibold text-emerald-600">
                      +৳{entry.credit.toLocaleString()}
                    </p>
                  ) : (
                    <p className="text-xs font-semibold text-gray-900">
                      -৳{entry.debit.toLocaleString()}
                    </p>
                  )}
                  <p className="text-[10px] text-gray-900 font-medium mt-0.5">
                    Bal: ৳{entry.balance.toLocaleString()}
                  </p>
                </div>
              </div>
              <p className="text-[10px] text-gray-400">
                {new Date(entry.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
