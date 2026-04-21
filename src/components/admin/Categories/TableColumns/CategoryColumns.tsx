import StatusBadge from "@/src/components/shared/Status/Status";
import { Button } from "@/src/components/ui/button";
import { ColumnDef } from "@/src/components/ui/data-table";
import { StatusType } from "@/src/types/common/common";
import { Pencil, Trash2, UserRound } from "lucide-react";
import Image from "next/image";
import { ICategory } from "../types";

export const GetCategoryColumns = (
  onEdit?: (item: ICategory) => void,
  onDelete?: (id: string) => void
): ColumnDef<ICategory>[] => {
  return [
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
          <div className="w-9 h-9 border border-[#E6E6E6] flex items-center justify-center rounded-lg bg-light">
            <UserRound className="h-4 w-4 text-gray-400" />
          </div>
        );
      },
    },
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
          <span className="text-sm text-secondary-gary">{desc || "—"}</span>
        );
      },
    },
    {
      header: "Parent Category",
      accessorKey: "parentCategoryName",
      cell: (_value, row) => {
        const item = row as ICategory;
        return (
          <span>
            {item.parentCategoryName || item.parentCategory?.name || "—"}
          </span>
        );
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (value) => {
        const normalizedStatus =
          String(value || StatusType.INACTIVE).toUpperCase() ===
          StatusType.ACTIVE
            ? StatusType.ACTIVE
            : StatusType.INACTIVE;

        return <StatusBadge status={normalizedStatus} className="px-2 py-1" />;
      },
    },
    {
      header: "Action",
      accessorKey: "actions",
      cell: (_value, row) => {
        const item = row as ICategory;
        return (
          <div className="flex items-center justify-end gap-2 w-full">
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
