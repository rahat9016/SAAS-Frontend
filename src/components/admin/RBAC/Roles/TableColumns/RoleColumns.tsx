import { Button } from "@/src/components/ui/button";
import { ColumnDef } from "@/src/components/ui/data-table";
import { Pencil, Trash2 } from "lucide-react";
import { RbacRole, stripRolePrefix } from "../types";

export const GetRoleColumns = (
  onEdit?: (item: RbacRole) => void,
  onDelete?: (id: string) => void,
): ColumnDef<RbacRole>[] => {
  return [
    {
      header: "Name",
      accessorKey: "name",
      cell: (value) => (
        <span className="font-medium">{stripRolePrefix(String(value))}</span>
      ),
    },
    {
      header: "Scope",
      accessorKey: "scope",
      cell: (value) =>
        value === "SUPER_ADMIN" ? (
          <span className="text-[10px] font-bold bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full uppercase">
            Global
          </span>
        ) : (
          <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase">
            Branch
          </span>
        ),
    },
    {
      header: "Permissions",
      accessorKey: "resourcePermissions",
      cell: (_value, row) => {
        const r = row as RbacRole;
        return (
          <span className="text-sm text-secondary-gary">
            {r.resourcePermissions.length} resource(s)
          </span>
        );
      },
    },
    {
      header: "Users",
      accessorKey: "_count",
      cell: (_value, row) => {
        const r = row as RbacRole;
        return <span className="text-sm">{r._count?.directUsers ?? 0}</span>;
      },
    },
    {
      header: "Action",
      accessorKey: "actions",
      cell: (_value, row) => {
        const item = row as RbacRole;
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
