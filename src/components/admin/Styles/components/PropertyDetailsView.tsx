"use client";

import { IStyleProperty } from "@/src/lib/redux/features/styleProperty/stylePropertyTypes";
import { ArrowLeft, Tag as TagIcon } from "lucide-react";
import Link from "next/link";

interface PropertyDetailsViewProps {
  property: IStyleProperty;
  seasonName: string;
  deptName: string;
  backHref: string;
}

interface Row {
  label: string;
  value: string;
}

export default function PropertyDetailsView({
  property,
  seasonName,
  deptName,
  backHref,
}: PropertyDetailsViewProps) {
  const rows: Row[] = [
    { label: "Style Type", value: property.styleType },
    { label: "Size Chart Template", value: property.sizeChartTemplate || "-" },
    { label: "Delivery Month", value: property.deliveryMonth },
    { label: "Collection Type", value: property.collectionType },
    { label: "Category", value: property.categoryName },
    { label: "Season", value: seasonName },
    { label: "Department", value: deptName },
    { label: "Supplier", value: property.supplierId || "-" },
    { label: "Assigned Branch", value: property.assignedBranchName || "-" },
    { label: "Carry Over", value: property.carryOver ? "Yes" : "No" },
    { label: "Auto Proto SR", value: property.autoProtoSr ? "Yes" : "No" },
    { label: "Auto SMS SR", value: property.autoSmsSr ? "Yes" : "No" },
    { label: "Auto FFP SR", value: property.autoFfpSr ? "Yes" : "No" },
    {
      label: "Created",
      value: new Date(property.createdAt).toLocaleString(),
    },
  ];

  return (
    <div className="w-full space-y-4">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 text-sm text-secondary-gary hover:text-primary transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to Articles
      </Link>

      {/* Header card */}
      <div className="bg-white border border-light-dark rounded-lg px-5 py-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center justify-center size-11 rounded-lg bg-primary/10 text-primary shrink-0">
          <TagIcon className="size-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-secondary-gary uppercase tracking-wide">
            Property Code
          </p>
          <h1 className="text-xl md:text-2xl text-primary font-bold tracking-wide">
            {property.code}
          </h1>
        </div>
      </div>

      {/* Property details grid */}
      <div className="bg-white border border-light-dark rounded-lg overflow-hidden shadow-sm">
        <h3 className="bg-light border-b border-light-dark px-4 py-3 text-base font-bold text-secondary-dark">
          Property Details
        </h3>
        <table className="w-full text-sm text-left border-collapse">
          <tbody>
            {rows.map((row, idx) => (
              <tr
                key={row.label}
                className={idx < rows.length - 1 ? "border-b border-light-dark" : ""}
              >
                <td className="py-3 px-4 font-semibold text-secondary-dark bg-light border-r border-light-dark w-1/3">
                  {row.label}
                </td>
                <td className="py-3 px-4 text-secondary-gary">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
