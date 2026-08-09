"use client";

import { DataTable, type ColumnDef } from "@/src/components/ui/data-table";
import { productInfo } from "@/src/data/dashboard/townHallData";
import type {
  ProductInfoRow,
  ProductLifecycle,
} from "@/src/types/dashboard/townHall";
import { Boxes } from "lucide-react";
import { BoardCard, KeyChip, Pill, money } from "./boardUtils";

const statusTone: Record<
  ProductInfoRow["status"],
  "success" | "warning" | "danger"
> = {
  "On Track": "success",
  Delayed: "warning",
  Blocked: "danger",
};

const lifecycleTone: Record<
  ProductLifecycle,
  "info" | "neutral" | "brand"
> = {
  Active: "info",
  "Phase Out": "neutral",
  New: "brand",
};

const columns: ColumnDef<ProductInfoRow>[] = [
  {
    header: "Location",
    accessorKey: "location",
    cell: (value) => (
      <span className="font-semibold text-violet-600">{value as string}</span>
    ),
  },
  { header: "FIT", accessorKey: "fit" },
  { header: "Size", accessorKey: "size" },
  { header: "Color", accessorKey: "color" },
  {
    header: "Issues",
    accessorKey: "issues",
    cell: (value) =>
      value === "None" ? (
        <span className="text-secondary-foreground">None</span>
      ) : (
        <span className="font-medium text-red-500">{value as string}</span>
      ),
  },
  {
    header: "Supplier",
    accessorKey: "supplier",
    cell: (value) => (
      <span className="font-medium text-secondary-dark">{value as string}</span>
    ),
  },
  { header: "Consuming Duration", accessorKey: "consumingDuration" },
  {
    header: "Article Nr.",
    accessorKey: "articleNr",
    cell: (value) => (
      <span className="font-mono text-xs">{value as string}</span>
    ),
  },
  {
    header: "Delivery Cost",
    accessorKey: "deliveryCost",
    align: "right",
    cell: (value) => money(value as number),
  },
  { header: "Branch", accessorKey: "branch" },
  {
    header: "Revenue",
    accessorKey: "revenue",
    align: "right",
    cell: (value) => (
      <span className="font-semibold text-emerald-600">
        {money(value as number)}
      </span>
    ),
  },
  {
    header: "Total Cost",
    accessorKey: "totalCost",
    align: "right",
    cell: (value) => (
      <span className="font-medium text-secondary-dark">
        {money(value as number)}
      </span>
    ),
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: (value) => (
      <Pill tone={statusTone[value as ProductInfoRow["status"]]} dot>
        {value as string}
      </Pill>
    ),
  },
  {
    header: "Lifecycle",
    accessorKey: "lifecycle",
    cell: (value) => (
      <Pill tone={lifecycleTone[value as ProductLifecycle]}>
        {value as string}
      </Pill>
    ),
  },
  { header: "Note", accessorKey: "note" },
];

export default function ProductInfoBoard() {
  return (
    <BoardCard
      title="Product Info"
      subtitle="Purchase order line items and margin"
      icon={Boxes}
      gradient="from-violet-600 to-violet-400"
      badge={<KeyChip label="PO Number" value={productInfo.poNumber} />}
    >
      <DataTable<ProductInfoRow>
        variant="plain"
        columns={columns}
        data={productInfo.rows}
      />
    </BoardCard>
  );
}
