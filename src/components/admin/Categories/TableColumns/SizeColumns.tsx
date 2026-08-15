import StatusBadge from "@/src/components/shared/Status/Status";
import { Button } from "@/src/components/ui/button";
import { ColumnDef } from "@/src/components/ui/data-table";
import { StatusType } from "@/src/types/common/common";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { ISize } from "../data/mockSizeData";

export const GetSizeColumns = (
  onView?: (item: ISize) => void,
  onEdit?: (item: ISize) => void,
  onDelete?: (id: string) => void
): ColumnDef<ISize>[] => {
  return [
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Code",
      accessorKey: "code",
      cell: (value) => (
        <span className="text-sm font-medium uppercase">
          {value as string}
        </span>
      ),
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
      header: "Sort Order",
      accessorKey: "sortOrder",
      cell: (value) => (
        <span className="text-sm text-secondary-gary">
          {(value as number | undefined) ?? "—"}
        </span>
      ),
    },
    {
      header: "Measurements",
      accessorKey: "chest",
      cell: (_value, row) => {
        const parts = [
          row.chest !== undefined && `Chest ${row.chest}`,
          row.waist !== undefined && `Waist ${row.waist}`,
          row.hip !== undefined && `Hip ${row.hip}`,
          row.length !== undefined && `Length ${row.length}`,
        ].filter(Boolean);
        return (
          <span className="text-sm text-secondary-gary">
            {parts.length ? `${parts.join(" · ")} ${row.unit || "in"}` : "—"}
          </span>
        );
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (value) => {
        return (
          <StatusBadge status={value as StatusType} className="px-2 py-1" />
        );
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
              title="View"
              onClick={() => onView?.(row)}
            >
              <Eye className="h-4 w-4 text-secondary-foreground" />
            </Button>
            <Button
              className="w-9! min-h-9 border border-[#E6E6E6] flex items-center justify-center rounded-lg bg-light hover:bg-light"
              size="sm"
              title="Edit"
              onClick={() => onEdit?.(row)}
            >
              <Pencil className="h-4 w-4 text-secondary-foreground" />
            </Button>
            <Button
              className="w-9! min-h-9 border border-red-200 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100"
              size="sm"
              title="Delete"
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
