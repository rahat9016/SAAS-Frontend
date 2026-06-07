import { Button } from "@/src/components/ui/button";
import { ColumnDef } from "@/src/components/ui/data-table";
import { Pencil, Trash2 } from "lucide-react";
import { RbacRoleItem } from "../types";

export const GetRoleColumns = (
  onEdit?: (item: RbacRoleItem) => void,
  onDelete?: (id: string) => void,
): ColumnDef<RbacRoleItem>[] => {
  return [
    {
      header: "Name",
      accessorKey: "name",
      cell: (value) => <span className="font-medium">{String(value)}</span>,
    },
    {
      header: "Type",
      accessorKey: "isBuiltIn",
      cell: (_value, row) => {
        const r = row as RbacRoleItem;
        return r.isSuperAdmin ? (
          <span className="text-[10px] font-bold bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full uppercase">
            Super Admin
          </span>
        ) : r.isBuiltIn ? (
          <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full uppercase">
            Built-in
          </span>
        ) : (
          <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase">
            Custom
          </span>
        );
      },
    },
    {
      header: "Users",
      accessorKey: "_count",
      cell: (_value, row) => {
        const r = row as RbacRoleItem;
        return <span className="text-sm">{r._count?.users ?? 0}</span>;
      },
    },
    {
      header: "Action",
      accessorKey: "actions",
      cell: (_value, row) => {
        const item = row as RbacRoleItem;
        const locked = item.isBuiltIn || item.isSuperAdmin;
        return (
          <div className="flex items-center gap-2">
            <Button
              className="w-9! min-h-9 border border-[#E6E6E6] flex items-center justify-center rounded-lg bg-light hover:bg-light disabled:opacity-40"
              size="sm"
              disabled={locked}
              onClick={() => onEdit?.(item)}
            >
              <Pencil className="h-4 w-4 text-secondary-foreground" />
            </Button>
            <Button
              className="w-9! min-h-9 border border-red-200 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 disabled:opacity-40"
              size="sm"
              disabled={locked}
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
