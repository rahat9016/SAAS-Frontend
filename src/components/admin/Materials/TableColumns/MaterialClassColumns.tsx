import { ColumnDef } from "@/src/components/ui/data-table";
import { IMaterialClass } from "../types";
import TableRowActions from "./TableRowActions";

export const GetMaterialClassColumns = (
  countSubClasses: (classId: string) => number,
  onEdit: (item: IMaterialClass) => void,
  onDelete: (item: IMaterialClass) => void
): ColumnDef<IMaterialClass>[] => [
  {
    header: "Material Type",
    accessorKey: "materialType",
  },
  {
    header: "Material Class",
    accessorKey: "name",
    cell: (value) => (
      <span className="font-medium text-secondary-dark">{value as string}</span>
    ),
  },
  {
    header: "Sub Classes",
    accessorKey: "id",
    cell: (_value, row) => countSubClasses(row.id).toString().padStart(2, "0"),
  },
  {
    header: "Action",
    accessorKey: "actions",
    cell: (_value, row) => (
      <TableRowActions
        onEdit={() => onEdit(row)}
        onDelete={() => onDelete(row)}
      />
    ),
  },
];
