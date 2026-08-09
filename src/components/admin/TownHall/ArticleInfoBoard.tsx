"use client";

import { DataTable, type ColumnDef } from "@/src/components/ui/data-table";
import { articleInfo } from "@/src/data/dashboard/townHallData";
import type { ArticleInfoRow } from "@/src/types/dashboard/townHall";
import { FileText } from "lucide-react";
import { BoardCard, KeyChip, Pill, count, money } from "./boardUtils";

const inspectionTone: Record<
  string,
  "success" | "warning" | "danger" | "neutral"
> = {
  Passed: "success",
  Pending: "warning",
  Failed: "danger",
};

const columns: ColumnDef<ArticleInfoRow>[] = [
  {
    header: "Intended Month",
    accessorKey: "intendedMonth",
    cell: (value) => (
      <span className="font-semibold text-sky-600">{value as string}</span>
    ),
  },
  { header: "FIT", accessorKey: "fit" },
  {
    header: "Supplier",
    accessorKey: "supplier",
    cell: (value) => (
      <span className="font-medium text-secondary-dark">{value as string}</span>
    ),
  },
  {
    header: "Quality Inspection",
    accessorKey: "qualityInspection",
    cell: (value) => (
      <Pill tone={inspectionTone[value as string] ?? "neutral"} dot>
        {value as string}
      </Pill>
    ),
  },
  {
    header: "Publishing Date",
    accessorKey: "publishingDate",
    cell: (value) => (
      <span className="font-mono text-xs">{value as string}</span>
    ),
  },
  { header: "Duration", accessorKey: "duration" },
  {
    header: "Number of Viewers",
    accessorKey: "numberOfViewers",
    align: "right",
    cell: (value) => count(value as number),
  },
  {
    header: "Retail Price",
    accessorKey: "retailPrice",
    align: "right",
    cell: (value) => (
      <span className="font-semibold text-secondary-dark">
        {money(value as number)}
      </span>
    ),
  },
  {
    header: "FOB",
    accessorKey: "fob",
    align: "right",
    cell: (value) => money(value as number),
  },
  {
    header: "Success Amount",
    accessorKey: "successAmount",
    align: "right",
    cell: (value) => (
      <span className="font-medium text-emerald-600">
        {count(value as number)}
      </span>
    ),
  },
  {
    header: "Failure",
    accessorKey: "failure",
    align: "right",
    cell: (value) => (
      <span className="font-medium text-red-500">{count(value as number)}</span>
    ),
  },
  {
    header: "Claim",
    accessorKey: "claim",
    align: "right",
    cell: (value) => (
      <span className="font-medium text-amber-600">
        {count(value as number)}
      </span>
    ),
  },
  {
    header: "GPA-5",
    accessorKey: "gpa5",
    align: "right",
    cell: (value) => <Pill tone="info">{value as string}</Pill>,
  },
];

export default function ArticleInfoBoard() {
  return (
    <BoardCard
      title="Article Info"
      subtitle="Article performance, pricing and quality"
      icon={FileText}
      gradient="from-sky-500 to-sky-400"
      badge={
        <KeyChip label="Article Number" value={articleInfo.articleNumber} />
      }
    >
      <DataTable<ArticleInfoRow>
        variant="plain"
        columns={columns}
        data={articleInfo.rows}
      />
    </BoardCard>
  );
}
