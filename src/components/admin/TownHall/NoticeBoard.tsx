"use client";

import { DataTable, type ColumnDef } from "@/src/components/ui/data-table";
import { noticeBoardRows } from "@/src/data/dashboard/townHallData";
import type { NoticeBoardRow } from "@/src/types/dashboard/townHall";
import { Bell } from "lucide-react";
import { BoardCard, count } from "./boardUtils";

const columns: ColumnDef<NoticeBoardRow>[] = [
  {
    header: "Monthly",
    accessorKey: "monthly",
    cell: (value, row) => {
      const total = row.success + row.failure;
      const successPct = total ? (row.success / total) * 100 : 0;

      return (
        <div className="min-w-40">
          <p className="font-medium text-secondary-dark">{value as string}</p>
          <div className="mt-1.5 flex h-1.5 w-full overflow-hidden rounded-full bg-red-100">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${successPct}%` }}
            />
          </div>
          <p className="mt-1 text-[10px] text-secondary-foreground">
            {successPct.toFixed(1)}% success · {count(total)} total
          </p>
        </div>
      );
    },
  },
  {
    header: "Success",
    accessorKey: "success",
    align: "right",
    cell: (value) => (
      <span className="inline-flex rounded-md bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-xs font-semibold text-emerald-600">
        {count(value as number)}
      </span>
    ),
  },
  {
    header: "Failure",
    accessorKey: "failure",
    align: "right",
    cell: (value) => (
      <span className="inline-flex rounded-md bg-red-50 border border-red-200 px-2 py-0.5 text-xs font-semibold text-red-500">
        {count(value as number)}
      </span>
    ),
  },
];

export default function NoticeBoard() {
  return (
    <BoardCard
      title="Notice Board"
      subtitle="Monthly success vs failure signals"
      icon={Bell}
      gradient="from-primary to-orange-500"
      className="h-full min-w-0"
    >
      <DataTable<NoticeBoardRow>
        variant="plain"
        columns={columns}
        data={noticeBoardRows}
      />
    </BoardCard>
  );
}
