import { ColumnDef } from "@/src/components/ui/data-table";
import { IMaterialSubClassRow } from "../types";
import TableRowActions from "./TableRowActions";

export const GetMaterialSubClassColumns = (
  onEdit: (item: IMaterialSubClassRow) => void,
  onDelete: (item: IMaterialSubClassRow) => void
): ColumnDef<IMaterialSubClassRow>[] => [
  {
    header: "Material Type",
    accessorKey: "materialType",
  },
  {
    header: "Parent Material Class",
    accessorKey: "className",
  },
  {
    header: "Material Sub Class",
    accessorKey: "name",
    cell: (value) => (
      <span className="font-medium text-secondary-dark">{value as string}</span>
    ),
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
