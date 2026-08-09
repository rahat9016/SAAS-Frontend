"use client";

import { DataTable, type ColumnDef } from "@/src/components/ui/data-table";
import { orderPipelineRows } from "@/src/data/dashboard/townHallData";
import type {
  OrderPipelineRow,
  OrderPriority,
  PipelineStage,
  PipelineState,
} from "@/src/types/dashboard/townHall";
import { Check, Loader2, Minus, Truck, X } from "lucide-react";
import { BoardCard, Pill } from "./boardUtils";

const stages: { key: PipelineStage; label: string }[] = [
  { key: "address", label: "Address" },
  { key: "sample", label: "Sample" },
  { key: "store", label: "Store" },
  { key: "package", label: "Package" },
  { key: "shipped", label: "Shipped" },
  { key: "central", label: "Central" },
  { key: "transport", label: "Transport" },
  { key: "awb", label: "AWB" },
  { key: "customer", label: "Customer" },
  { key: "money", label: "Money" },
  { key: "return", label: "Return" },
  { key: "cost", label: "Cost" },
  { key: "stow", label: "Stow" },
  { key: "payBack", label: "Pay Back" },
];

const stateStyles: Record<PipelineState, string> = {
  done: "bg-emerald-500 text-white",
  progress: "bg-amber-400 text-white",
  blocked: "bg-red-500 text-white",
  idle: "bg-light-dark text-light-silver",
};

const stateIcon: Record<PipelineState, typeof Check> = {
  done: Check,
  progress: Loader2,
  blocked: X,
  idle: Minus,
};

const stateLabel: Record<PipelineState, string> = {
  done: "Completed",
  progress: "In progress",
  blocked: "Blocked",
  idle: "Not started",
};

const priorityTone: Record<OrderPriority, "success" | "neutral" | "warning"> = {
  "Fast Track": "success",
  Normal: "neutral",
  Low: "warning",
};

const columns: ColumnDef<OrderPipelineRow>[] = [
  {
    header: "Branch",
    accessorKey: "branch",
    cell: (value) => (
      <span className="font-semibold text-secondary-dark">
        {value as string}
      </span>
    ),
  },
  {
    header: "Date",
    accessorKey: "date",
    cell: (value) => (
      <span className="font-mono text-xs">{value as string}</span>
    ),
  },
  {
    header: "Daily Order List",
    accessorKey: "dailyOrderList",
    cell: (value) => (
      <span className="font-mono text-xs text-secondary-dark">
        {value as string}
      </span>
    ),
  },
  ...stages.map<ColumnDef<OrderPipelineRow>>((stage) => ({
    header: stage.label,
    accessorKey: stage.key,
    align: "center",
    cell: (value) => {
      const state = value as PipelineState;
      const Icon = stateIcon[state];
      return (
        <span
          title={`${stage.label}: ${stateLabel[state]}`}
          className={`inline-flex h-6 w-6 items-center justify-center rounded-md ${stateStyles[state]}`}
        >
          <Icon
            className={`h-3.5 w-3.5 ${
              state === "progress" ? "animate-spin animation-duration-[2.5s]" : ""
            }`}
          />
        </span>
      );
    },
  })),
  {
    header: "Priority",
    accessorKey: "priority",
    align: "center",
    cell: (value) => (
      <Pill tone={priorityTone[value as OrderPriority]}>{value as string}</Pill>
    ),
  },
];

export default function OrderPipelineBoard() {
  return (
    <BoardCard
      title="Daily Order Pipeline"
      subtitle="Branch wise order flow from address to pay back"
      icon={Truck}
      gradient="from-teal-600 to-teal-400"
      badge={<Legend />}
    >
      <DataTable<OrderPipelineRow>
        variant="plain"
        columns={columns}
        data={orderPipelineRows}
      />
    </BoardCard>
  );
}

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {(Object.keys(stateLabel) as PipelineState[]).map((state) => (
        <span
          key={state}
          className="inline-flex items-center gap-1.5 text-[11px] text-secondary-foreground"
        >
          <span
            className={`h-2.5 w-2.5 rounded-sm ${stateStyles[state].split(" ")[0]}`}
          />
          {stateLabel[state]}
        </span>
      ))}
    </div>
  );
}
