import { X } from "lucide-react";
import { Checkbox } from "@/src/components/ui/checkbox";
import { ColumnDef } from "@/src/components/ui/data-table";
import { ColorwayTextField } from "@/src/lib/redux/features/colorway/colorwaySlice";
import { IColorway } from "@/src/lib/redux/features/colorway/colorwayTypes";

const editableCellClass =
  "w-full bg-transparent border border-transparent rounded px-1 py-0.5 -mx-1 focus:outline-none";

function EditableTextCell({
  value,
  code,
  field,
  type = "text",
  onCommit,
}: {
  value: string;
  code: string;
  field: ColorwayTextField;
  type?: string;
  onCommit?: (code: string, field: ColorwayTextField, value: string) => void;
}) {
  return (
    <input
      key={value}
      type={type}
      defaultValue={value}
      onBlur={(e) => {
        if (e.target.value !== value) onCommit?.(code, field, e.target.value);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.currentTarget.blur();
      }}
      className={editableCellClass}
    />
  );
}

function SwatchCell({ row }: { row: IColorway }) {
  return (
    <div
      className="w-8 h-8 mx-auto rounded border border-light-dark overflow-hidden shrink-0"
      style={!row.image ? { backgroundColor: row.colorHex || "#ffffff" } : undefined}
      title={row.name}
    >
      {row.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={row.image} alt={row.name} className="w-full h-full object-cover" />
      )}
    </div>
  );
}

export const GetArticleColorwayColumns = (
  onRemove?: (code: string) => void,
  onFieldChange?: (code: string, field: ColorwayTextField, value: string) => void
): ColumnDef<IColorway>[] => {
  return [
    {
      header: (
        <>
          Color Marketing
          <br />
          Name
        </>
      ),
      accessorKey: "name",
      filterLabel: "All",
    },
    {
      header: (
        <span className="inline-flex items-center gap-1">
          Colorway <span className="text-[10px] opacity-70">↕</span>
        </span>
      ),
      accessorKey: "colorway",
      filterLabel: "All",
      cell: (value) => <span className="text-primary font-medium">{value as string}</span>,
    },
    {
      header: (
        <>
          Color
          <br />
          Specification
        </>
      ),
      accessorKey: "spec",
      filterLabel: "All",
    },
    {
      header: "Description",
      accessorKey: "description",
      filterLabel: "All",
    },
    {
      header: (
        <>
          Color
          <br />
          Standard
        </>
      ),
      accessorKey: "standard",
      filterLabel: "All",
    },
    {
      header: "Pantone",
      accessorKey: "pantone",
      filterLabel: "All",
    },
    {
      header: "Image",
      accessorKey: "image",
      align: "center",
      cell: (_value, row) => <SwatchCell row={row} />,
    },
    {
      header: "Active",
      accessorKey: "active",
      align: "center",
      filterLabel: "All",
      cell: (_value, row) => <Checkbox checked={row.active} disabled className="mx-auto" />,
    },
    {
      header: (
        <>
          In
          <br />
          Theme
        </>
      ),
      accessorKey: "inTheme",
      align: "center",
      cell: (_value, row) => <Checkbox checked={row.inTheme} disabled className="mx-auto" />,
    },
    {
      header: (
        <>
          Color
          <br />
          Start Date
        </>
      ),
      accessorKey: "startDate",
      filterLabel: "All",
      cell: (value, row) => (
        <EditableTextCell
          value={value as string}
          code={row.code}
          field="startDate"
          type="date"
          onCommit={onFieldChange}
        />
      ),
    },
    {
      header: (
        <>
          Color
          <br />
          End Date
        </>
      ),
      accessorKey: "endDate",
      filterLabel: "All",
      cell: (value, row) => (
        <EditableTextCell
          value={value as string}
          code={row.code}
          field="endDate"
          type="date"
          onCommit={onFieldChange}
        />
      ),
    },
    {
      header: (
        <>
          Stock
          <br />
          Clearance Date
        </>
      ),
      accessorKey: "clearanceDate",
      filterLabel: "All",
      cell: (value, row) => (
        <EditableTextCell
          value={value as string}
          code={row.code}
          field="clearanceDate"
          type="date"
          onCommit={onFieldChange}
        />
      ),
    },
    {
      header: "",
      accessorKey: "code",
      align: "center",
      cell: (_value, row) => (
        <button
          type="button"
          onClick={() => onRemove?.(row.code)}
          className="inline-flex items-center justify-center size-6 rounded text-secondary-dark/60 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          title="Remove from this style"
        >
          <X className="size-4" />
        </button>
      ),
    },
  ];
};
