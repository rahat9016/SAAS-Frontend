import { ColumnDef } from "@/src/components/ui/data-table";
import { Button } from "@/src/components/ui/button";
import { Eye, Trash2 } from "lucide-react";
import { IDesignListItem } from "@/src/types/plm/productLifecycleTypes";
import StatusBadge from "../../shared/StatusBadge";
import { format } from "date-fns";

export const GetDesignColumns = (
  onView?: (id: string) => void,
  onDelete?: (id: string) => void
): ColumnDef<IDesignListItem>[] => {
  return [
    {
      header: "Design Name",
      accessorKey: "name",
      cell: (value) => (
        <span className="font-medium text-secondary">{value as string}</span>
      ),
    },
    {
      header: "Category",
      accessorKey: "category",
      cell: (value) => (
        <span className="capitalize text-gray-600">{value as string}</span>
      ),
    },
    {
      header: "Designer",
      accessorKey: "designerName",
      cell: (value) => (
        <span className="text-gray-600">{value as string}</span>
      ),
    },
    {
      header: "Branch",
      accessorKey: "branchName",
      cell: (value) => (
        <span className="text-gray-500 text-xs font-medium bg-gray-100 px-2 py-0.5 rounded">
          {value as string}
        </span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (value) => <StatusBadge status={value as IDesignListItem["status"]} size="sm" />,
    },
    {
      header: "Created",
      accessorKey: "createdAt",
      cell: (value) => (
        <span className="text-gray-500 text-xs">
          {format(new Date(value as string), "MMM d, yyyy")}
        </span>
      ),
    },
    {
      header: "Action",
      accessorKey: "actions",
      cell: (_value, row) => {
        const item = row as IDesignListItem;
        return (
          <div className="flex items-center gap-2">
            <Button
              className="w-9! min-h-9 border border-[#E6E6E6] flex items-center justify-center rounded-lg bg-light hover:bg-light cursor-pointer"
              size="sm"
              onClick={() => onView?.(item.id)}
            >
              <Eye className="h-4 w-4 text-secondary-foreground" />
            </Button>
            {onDelete && (
              <Button
                className="w-9! min-h-9 border border-red-200 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 cursor-pointer"
                size="sm"
                onClick={() => onDelete(item.id)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            )}
          </div>
        );
      },
    },
  ];
};
