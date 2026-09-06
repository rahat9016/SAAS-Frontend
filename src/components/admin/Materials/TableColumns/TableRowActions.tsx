import { Button } from "@/src/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface TableRowActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

/** Edit / delete pair shared by every Material table. */
export default function TableRowActions({
  onEdit,
  onDelete,
}: TableRowActionsProps) {
  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        className="w-9! min-h-9 border border-[#E6E6E6] flex items-center justify-center rounded-lg bg-light hover:bg-light"
        size="sm"
        title="Edit"
        onClick={onEdit}
      >
        <Pencil className="h-4 w-4 text-secondary-foreground" />
      </Button>
      <Button
        className="w-9! min-h-9 border border-red-200 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100"
        size="sm"
        title="Delete"
        onClick={onDelete}
      >
        <Trash2 className="h-4 w-4 text-red-500" />
      </Button>
    </div>
  );
}
