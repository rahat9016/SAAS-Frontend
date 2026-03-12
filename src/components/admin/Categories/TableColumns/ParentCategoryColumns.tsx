import { Button } from "@/src/components/ui/button";
import { ColumnDef } from "@/src/components/ui/data-table";
import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { IParentCategory } from "../types";

export const GetParentCategoryColumns = (
  onEdit?: (item: IParentCategory) => void,
  onDelete?: (id: string) => void
): ColumnDef<IParentCategory>[] => {
  return [
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Description",
      accessorKey: "description",
      cell: (value) => {
        const desc = value as string | undefined;
        return (
          <span className="text-sm text-secondary-gary">
            {desc || "—"}
          </span>
        );
      },
    },
    {
      header: "Icon",
      accessorKey: "icon",
      cell: (value) => {
        const icon = value as string | undefined;
        return icon ? (
          <div className="w-9 h-9 border border-[#E6E6E6] flex items-center justify-center rounded-lg bg-light">
            <Image src={icon} alt="icon" width={24} height={24} />
          </div>
        ) : (
          <span className="text-sm text-gray-400">—</span>
        );
      },
    },
    {
      header: "Action",
      accessorKey: "actions",
      cell: (_value, row) => {
        const item = row as IParentCategory;
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
