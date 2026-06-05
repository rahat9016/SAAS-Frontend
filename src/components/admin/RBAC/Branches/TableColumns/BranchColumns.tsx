import { ColumnDef } from "@/src/components/ui/data-table";
import { RbacBranch } from "../types";

export const GetBranchColumns = (): ColumnDef<RbacBranch>[] => {
  return [
    { header: "Name", accessorKey: "name" },
    {
      header: "Code",
      accessorKey: "code",
      cell: (value) => (
        <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
          {String(value)}
        </span>
      ),
    },
    {
      header: "Organization",
      accessorKey: "organization",
      cell: (_value, row) => {
        const b = row as RbacBranch;
        return <span className="text-sm">{b.organization?.name ?? "—"}</span>;
      },
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
      header: "Scope",
      accessorKey: "branchPermissions",
      cell: (_value, row) => {
        const b = row as RbacBranch;
        return (
          <span className="text-sm text-secondary-gary">
            {b.branchPermissions.length} resource(s)
          </span>
        );
      },
    },
  ];
};
