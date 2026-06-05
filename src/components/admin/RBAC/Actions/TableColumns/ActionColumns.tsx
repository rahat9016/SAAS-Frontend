import { Button } from "@/src/components/ui/button";
import { ColumnDef } from "@/src/components/ui/data-table";
import { Pencil, Trash2 } from "lucide-react";
import { IActionItem } from "../types";

export const GetActionColumns = (
  onEdit?: (item: IActionItem) => void,
  onDelete?: (id: string) => void,
): ColumnDef<IActionItem>[] => {
  return [
    {
      header: "Key",
      accessorKey: "key",
      cell: (value) => (
        <code className="text-xs bg-light px-2 py-1 rounded text-secondary-foreground">
          {String(value)}
        </code>
      ),
    },
    { header: "Label", accessorKey: "label" },
    {
      header: "Type",
      accessorKey: "isBuiltIn",
      cell: (value) =>
        value ? (
          <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full uppercase">
            Built-in
          </span>
        ) : (
          <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase">
            Custom
          </span>
        ),
    },
    {
      header: "Action",
      accessorKey: "actions",
      cell: (_value, row) => {
        const item = row as IActionItem;
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
              className="w-9! min-h-9 border border-red-200 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 disabled:opacity-40"
              size="sm"
              disabled={item.isBuiltIn}
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
