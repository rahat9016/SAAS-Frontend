import { Button } from "@/src/components/ui/button";
import { ColumnDef } from "@/src/components/ui/data-table";
import { Eye, Trash2 } from "lucide-react";
import Image from "next/image";
import { IProductListItem } from "../types";

export const GetProductColumns = (
  onView?: (id: string) => void,
  onDelete?: (id: string) => void
): ColumnDef<IProductListItem>[] => {
  return [
    {
      header: "Image",
      accessorKey: "image",
      cell: (value) => {
        const img = value as string | undefined;
        return img ? (
          <div className="w-12 h-12 border border-[#E6E6E6] flex items-center justify-center rounded-lg bg-light overflow-hidden">
            <Image
              src={img}
              alt="product"
              width={48}
              height={48}
              className="object-cover w-full h-full"
            />
          </div>
        ) : (
          <div className="w-12 h-12 border border-[#E6E6E6] flex items-center justify-center rounded-lg bg-light">
            <span className="text-xs text-gray-400">—</span>
          </div>
        );
      },
    },
    {
      header: "Product Name",
      accessorKey: "name",
      cell: (value) => (
        <span className="font-medium text-secondary">
          {value as string}
        </span>
      ),
    },
    {
      header: "Category",
      accessorKey: "category",
    },
    {
      header: "Price",
      accessorKey: "price",
      cell: (value) => (
        <span className="font-medium">৳{Number(value).toFixed(2)}</span>
      ),
    },
    {
      header: "Stock",
      accessorKey: "stock",
      cell: (value) => {
        const stock = value as number;
        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              stock > 10
                ? "bg-green-100 text-green-800"
                : stock > 0
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
            }`}
          >
            {stock > 0 ? `${stock} in stock` : "Out of stock"}
          </span>
        );
      },
    },
    {
      header: "Status",
      accessorKey: "status",
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
        const item = row as IProductListItem;
        return (
          <div className="flex items-center gap-2">
            <Button
              className="w-9! min-h-9 border border-[#E6E6E6] flex items-center justify-center rounded-lg bg-light hover:bg-light cursor-pointer"
              size="sm"
              onClick={() => onView?.(item.id)}
            >
              <Eye className="h-4 w-4 text-secondary-foreground" />
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
