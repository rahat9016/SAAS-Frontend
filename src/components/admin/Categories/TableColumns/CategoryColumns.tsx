import { Button } from "@/src/components/ui/button";
import { ColumnDef } from "@/src/components/ui/data-table";
import { Pencil, Trash2 } from "lucide-react";
import { ICategory } from "../types";

export const GetCategoryColumns = (
  onEdit?: (item: ICategory) => void,
  onDelete?: (id: string) => void
): ColumnDef<ICategory>[] => {
  return [
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Parent Category",
      accessorKey: "parentCategoryName",
    },
    {
      header: "Action",
      accessorKey: "actions",
      cell: (_value, row) => {
        const item = row as ICategory;
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
