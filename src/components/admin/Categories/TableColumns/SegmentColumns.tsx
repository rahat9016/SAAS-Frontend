import StatusBadge from "@/src/components/shared/Status/Status";
import { Button } from "@/src/components/ui/button";
import { ColumnDef } from "@/src/components/ui/data-table";
import { StatusType } from "@/src/types/common/common";
import { Pencil, Trash2 } from "lucide-react";
import { ISegment } from "../types";

export const GetSegmentColumns = (
  onEdit?: (item: ISegment) => void,
  onDelete?: (id: string) => void
): ColumnDef<ISegment>[] => {
  return [
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Category",
      accessorKey: "categoryName",
      cell: (_value, row) => {
        return <span>{row.categoryName || row.category?.name || "—"}</span>;
      },
    },
    {
      header: "Description",
      accessorKey: "description",
      cell: (value) => {
        const desc = value as string | undefined;
        return (
          <span className="text-sm text-secondary-gary">{desc || "—"}</span>
        );
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (value) => {
        const normalizedStatus =
          String(value || StatusType.INACTIVE).toUpperCase() ===
          StatusType.ACTIVE
            ? StatusType.ACTIVE
            : StatusType.INACTIVE;

        return <StatusBadge status={normalizedStatus} className="px-2 py-1" />;
      },
    },
    {
      header: "Action",
      accessorKey: "actions",
      cell: (_value, row) => {
        return (
          <div className="flex items-center gap-2 w-full">
            <Button
              className="w-9! min-h-9 border border-[#E6E6E6] flex items-center justify-center rounded-lg bg-light hover:bg-light"
              size="sm"
              onClick={() => onEdit?.(row)}
            >
              <Pencil className="h-4 w-4 text-secondary-foreground" />
            </Button>
            <Button
              className="w-9! min-h-9 border border-red-200 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100"
              size="sm"
              onClick={() => onDelete?.(row.id)}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        );
      },
    },
  ];
};
