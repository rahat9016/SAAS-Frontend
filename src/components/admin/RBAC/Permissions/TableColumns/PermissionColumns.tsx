import { Button } from "@/src/components/ui/button";
import { ColumnDef } from "@/src/components/ui/data-table";
import { Eye, Pencil } from "lucide-react";
import { RbacUser } from "@/src/types/rbac/rbac";

export const GetPermissionColumns = (
  onView?: (item: RbacUser) => void,
  onEdit?: (item: RbacUser) => void,
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
      cell: (_value, row) => {
        const u = row as RbacUser;
        return (
          <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
            {u.role?.name ?? "—"}
          </span>
        );
      },
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
            {u.permissions?.length ?? 0} resource(s)
          </span>
        );
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
              title="View"
              onClick={() => onView?.(item)}
            >
              <Eye className="h-4 w-4 text-secondary-foreground" />
            </Button>
            <Button
              className="w-9! min-h-9 border border-blue-200 flex items-center justify-center rounded-lg bg-blue-50 hover:bg-blue-100"
              size="sm"
              title="Edit permissions"
              onClick={() => onEdit?.(item)}
            >
              <Pencil className="h-4 w-4 text-blue-500" />
            </Button>
          </div>
        );
      },
    },
  ];
};
