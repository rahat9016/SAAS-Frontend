import { Button } from "@/src/components/ui/button";
import { ColumnDef } from "@/src/components/ui/data-table";
import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { IBrand } from "../types";

export const GetBrandColumns = (
  onEdit?: (item: IBrand) => void,
  onDelete?: (id: string) => void
): ColumnDef<IBrand>[] => {
  return [
    {
      header: "Logo",
      accessorKey: "logo",
      cell: (value) => {
        const logo = value as string | undefined;
        return logo ? (
          <div className="w-9 h-9 border border-[#E6E6E6] flex items-center justify-center rounded-lg bg-light">
            <Image src={logo} alt="logo" width={24} height={24} />
          </div>
        ) : (
          <span className="text-sm text-gray-400">—</span>
        );
      },
    },
    {
      header: "Title",
      accessorKey: "title",
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
      header: "Status",
      accessorKey: "isActive",
      cell: (value) => {
        const isActive = value as boolean;
        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              isActive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {isActive ? "Active" : "Inactive"}
          </span>
        );
      },
    },
    {
      header: "Action",
      accessorKey: "actions",
      cell: (_value, row) => {
        const item = row as IBrand;
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
