import { Button } from "@/src/components/ui/button";
import { ColumnDef } from "@/src/components/ui/data-table";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { IAttribute } from "../types";

export const GetAttributeColumns = (
  onView?: (item: IAttribute) => void,
  onEdit?: (item: IAttribute) => void,
  onDelete?: (id: string) => void
): ColumnDef<IAttribute>[] => {
  return [
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Action",
      accessorKey: "actions",
      cell: (_value, row) => {
        const item = row as IAttribute;
        return (
          <div className="flex items-center gap-2">
            <Button
              className="w-9! min-h-9 border border-[#E6E6E6] flex items-center justify-center rounded-lg bg-light hover:bg-light cursor-pointer"
              size="sm"
              onClick={() => onView?.(item)}
            >
              <Eye className="h-4 w-4 text-secondary-foreground" />
            </Button>
            <Button
              className="w-9! min-h-9 border border-[#E6E6E6] flex items-center justify-center rounded-lg bg-light hover:bg-light cursor-pointer"
              size="sm"
              onClick={() => onEdit?.(item)}
            >
              <Pencil className="h-4 w-4 text-secondary-foreground" />
            </Button>
            <Button
              className="w-9! min-h-9 border border-red-200 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 cursor-pointer"
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
