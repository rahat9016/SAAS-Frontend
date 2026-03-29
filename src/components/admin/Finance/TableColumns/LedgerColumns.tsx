import { ColumnDef } from "@/src/components/ui/data-table";
import { LedgerEntry } from "@/src/data/financeData";
import { ArrowUpRight, ArrowDownLeft, Receipt } from "lucide-react";

export const GetLedgerColumns = (): ColumnDef<LedgerEntry>[] => {
  return [
    {
      header: "Date",
      accessorKey: "date",
      cell: (value) => {
        return (
          <span className="text-sm font-medium text-gray-500 whitespace-nowrap">
            {new Date(value as string).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        );
      },
    },
    {
      header: "Type",
      accessorKey: "type",
      cell: (value) => {
        const type = value as "Sale" | "Refund" | "Expense";
        if (type === "Sale") {
          return (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
              <ArrowUpRight className="w-3 h-3 text-emerald-500" />
              {type}
            </span>
          );
        }
        if (type === "Refund") {
          return (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700">
              <ArrowDownLeft className="w-3 h-3 text-rose-500" />
              {type}
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
            <Receipt className="w-3 h-3 text-amber-500" />
            {type}
          </span>
        );
      },
    },
    {
      header: "Description",
      accessorKey: "description",
      cell: (value) => (
        <span className="text-sm text-gray-600 truncate max-w-[300px]">
          {value as string}
        </span>
      ),
    },
    {
      header: "Amount",
      accessorKey: "amount",
      cell: (_value, row) => {
        const entry = row as LedgerEntry;
        if (entry.credit > 0) {
          return (
            <span className="text-emerald-600 text-sm font-semibold whitespace-nowrap">
              +৳{entry.credit.toLocaleString()}
            </span>
          );
        }
        return (
          <span className="text-gray-900 text-sm font-semibold whitespace-nowrap">
            -৳{entry.debit.toLocaleString()}
          </span>
        );
      },
    },
    {
      header: "Current Balance",
      accessorKey: "balance",
      cell: (value) => {
        const bal = value as number;
        return (
          <span className="text-gray-900 text-sm font-bold whitespace-nowrap">
            ৳{bal.toLocaleString()}
          </span>
        );
      },
    },
  ];
};
