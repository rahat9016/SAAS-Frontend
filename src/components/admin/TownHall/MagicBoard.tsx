"use client";

import { DataTable, type ColumnDef } from "@/src/components/ui/data-table";
import { magicBoardRows } from "@/src/data/dashboard/townHallData";
import type { MagicBoardRow } from "@/src/types/dashboard/townHall";
import { Sparkles } from "lucide-react";
import { BoardCard, Pill, money } from "./boardUtils";

const columns: ColumnDef<MagicBoardRow>[] = [
  {
    header: "Week",
    accessorKey: "week",
    cell: (value) => (
      <span className="font-semibold text-indigo-600">{value as string}</span>
    ),
  },
  {
    header: "Weekly Sales",
    accessorKey: "weeklySales",
    align: "right",
    cell: (value) => (
      <span className="font-semibold text-secondary-dark">
        {money(value as number)}
      </span>
    ),
  },
  {
    header: "Fixed Cost",
    accessorKey: "fixedCost",
    align: "right",
    cell: (value) => money(value as number),
  },
  {
    header: "Overhead Cost",
    accessorKey: "overheadCost",
    align: "right",
    cell: (value) => money(value as number),
  },
  {
    header: "Maintenance Cost",
    accessorKey: "maintenanceCost",
    align: "right",
    cell: (value) => money(value as number),
  },
  {
    header: "Delivery Cost",
    accessorKey: "deliveryCost",
    align: "right",
    cell: (value) => money(value as number),
  },
  {
    header: "Net Cost",
    accessorKey: "netCost",
    align: "right",
    cell: (value) => (
      <span className="font-medium text-red-500">{money(value as number)}</span>
    ),
  },
  {
    header: "Weekly Profit",
    accessorKey: "weeklyProfit",
    align: "right",
    cell: (value) => (
      <span className="font-semibold text-emerald-600">
        {money(value as number)}
      </span>
    ),
  },
];

export default function MagicBoard() {
  const totalProfit = magicBoardRows.reduce((s, r) => s + r.weeklyProfit, 0);

  return (
    <BoardCard
      title="Magic Board"
      subtitle="Weekly sales against cost breakdown"
      icon={Sparkles}
      gradient="from-indigo-600 to-indigo-400"
      className="h-full min-w-0"
      badge={<Pill tone="success">Month profit {money(totalProfit)}</Pill>}
    >
      <DataTable<MagicBoardRow>
        variant="plain"
        columns={columns}
        data={magicBoardRows}
      />
    </BoardCard>
  );
}
