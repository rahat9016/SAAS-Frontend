import StatusBadge from "@/src/components/shared/Status/Status";
import { Button } from "@/src/components/ui/button";
import { ColumnDef } from "@/src/components/ui/data-table";
import { StatusType } from "@/src/types/common/common";
import { Pencil, Trash2 } from "lucide-react";
import { RbacUser } from "../types";

export const GetUserColumns = (
  onEdit?: (item: RbacUser) => void,
  onDelete?: (id: string) => void,
): ColumnDef<RbacUser>[] => {
  return [
    {
      header: "Name",
      accessorKey: "firstName",
      cell: (_value, row) => {
        const u = row as RbacUser;
        return (
          <span className="font-medium">
            {[u.firstName, u.lastName].filter(Boolean).join(" ")}
          </span>
        );
      },
    },
    { header: "Email", accessorKey: "email" },
    {
      header: "Role",
      accessorKey: "role",
      cell: (value) => (
        <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
          {String(value)}
        </span>
      ),
    },
    {
      header: "Branch",
      accessorKey: "branch",
      cell: (_value, row) => {
        const u = row as RbacUser;
        return <span className="text-sm">{u.branch?.code ?? "—"}</span>;
      },
    },
    {
      header: "Permissions",
      accessorKey: "permissions",
      cell: (_value, row) => {
        const u = row as RbacUser;
        return (
          <span className="text-sm text-secondary-gary">
            {u.role === "SUPER_ADMIN" ? "All" : `${u.permissions?.length ?? 0} res`}
          </span>
        );
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
        const item = row as RbacUser;
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
