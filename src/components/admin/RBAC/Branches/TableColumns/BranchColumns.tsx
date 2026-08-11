import StatusBadge from "@/src/components/shared/Status/Status";
import { Button } from "@/src/components/ui/button";
import { ColumnDef } from "@/src/components/ui/data-table";
import { StatusType } from "@/src/types/common/common";
import { Pencil, Power, Trash2 } from "lucide-react";
import { RbacBranch } from "../types";

export const GetBranchColumns = (
  onEdit?: (item: RbacBranch) => void,
  onDelete?: (id: string) => void,
  onToggle?: (item: RbacBranch) => void,
): ColumnDef<RbacBranch>[] => {
  return [
    {
      header: "Name",
      accessorKey: "name",
      cell: (value) => (
        <span className="text-sm font-medium">{(value as string) || "—"}</span>
      ),
    },
    {
      header: "Code",
      accessorKey: "code",
      cell: (value) => (
        <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
          {(value as string) || "—"}
        </span>
      ),
    },
    {
      header: "City",
      accessorKey: "city",
      cell: (value) => <span className="text-sm">{(value as string) || "—"}</span>,
    },
    {
      header: "Country",
      accessorKey: "country",
      cell: (value) => <span className="text-sm">{(value as string) || "—"}</span>,
    },
    {
      header: "Contact",
      accessorKey: "contact",
      cell: (value) => (
        <span className="text-sm text-secondary-gary">{(value as string) || "—"}</span>
      ),
    },
    {
      header: "Users",
      accessorKey: "_count",
      cell: (_value, row) => {
        const b = row as RbacBranch;
        return <span className="text-sm">{b._count?.users ?? 0}</span>;
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (value) => {
        const normalized =
          String(value).toUpperCase() === StatusType.ACTIVE
            ? StatusType.ACTIVE
            : StatusType.INACTIVE;
        return <StatusBadge status={normalized} className="px-2 py-1" />;
      },
    },
    {
      header: "Action",
      accessorKey: "actions",
      cell: (_value, row) => {
        const item = row as RbacBranch;
        const active = String(item.status).toUpperCase() === "ACTIVE";
        return (
          <div className="flex items-center gap-2">
            <Button
              className="w-9! min-h-9 border border-[#E6E6E6] flex items-center justify-center rounded-lg bg-light hover:bg-light"
              size="sm"
              onClick={() => onEdit?.(item)}
            >
              <Pencil className="h-4 w-4 text-secondary-foreground" />
            </Button>
            <Button
              className={`w-9! min-h-9 border flex items-center justify-center rounded-lg ${
                active
                  ? "border-amber-200 bg-amber-50 hover:bg-amber-100"
                  : "border-green-200 bg-green-50 hover:bg-green-100"
              }`}
              size="sm"
              title={active ? "Deactivate" : "Activate"}
              onClick={() => onToggle?.(item)}
            >
              <Power className={`h-4 w-4 ${active ? "text-amber-500" : "text-green-600"}`} />
            </Button>
            <Button
              className="w-9! min-h-9 border border-red-200 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100"
              size="sm"
              onClick={() => onDelete?.(item.id)}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        );
      },
    },
  ];
};
