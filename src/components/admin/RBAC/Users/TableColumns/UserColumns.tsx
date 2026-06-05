import { Button } from "@/src/components/ui/button";
import { ColumnDef } from "@/src/components/ui/data-table";
import { Pencil, Trash2 } from "lucide-react";
import { RbacBranchUser } from "../types";

const stripPrefix = (name: string) => name.replace(/^[^-]+ - /, "");

export const GetUserColumns = (
  onEdit?: (item: RbacBranchUser) => void,
  onDelete?: (id: string) => void,
): ColumnDef<RbacBranchUser>[] => {
  return [
    {
      header: "Name",
      accessorKey: "name",
      cell: (value, row) => {
        const u = row as RbacBranchUser;
        return <span className="font-medium">{(value as string) || u.email}</span>;
      },
    },
    { header: "Email", accessorKey: "email" },
    {
      header: "Role",
      accessorKey: "role",
      cell: (_value, row) => {
        const u = row as RbacBranchUser;
        return (
          <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
            {u.role ? stripPrefix(u.role.name) : "No role"}
          </span>
        );
      },
    },
    {
      header: "Action",
      accessorKey: "actions",
      cell: (_value, row) => {
        const item = row as RbacBranchUser;
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
