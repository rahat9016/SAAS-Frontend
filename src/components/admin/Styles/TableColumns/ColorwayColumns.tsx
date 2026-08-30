import { Upload } from "lucide-react";
import { useRef } from "react";
import { Checkbox } from "@/src/components/ui/checkbox";
import { ColumnDef } from "@/src/components/ui/data-table";
import {
  ColorwayFlag,
  ColorwayTextField,
} from "@/src/lib/redux/features/colorway/colorwaySlice";
import { IColorway } from "@/src/lib/redux/features/colorway/colorwayTypes";
import { colorwayStandardOptions } from "../Schema/colorwaySchema";

const editableCellClass =
  "w-full bg-transparent border border-transparent rounded px-1 py-0.5 -mx-1 focus:outline-none";

function EditableTextCell({
  value,
  code,
  field,
  placeholder,
  className,
  onCommit,
}: {
  value: string;
  code: string;
  field: ColorwayTextField;
  placeholder?: string;
  className?: string;
  onCommit?: (code: string, field: ColorwayTextField, value: string) => void;
}) {
  return (
    <input
      key={value}
      defaultValue={value}
      placeholder={placeholder}
      onBlur={(e) => {
        if (e.target.value !== value) onCommit?.(code, field, e.target.value);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.currentTarget.blur();
      }}
      className={`${editableCellClass} ${className ?? ""}`}
    />
  );
}

function EditableStandardCell({
  value,
  code,
  onCommit,
}: {
  value: string;
  code: string;
  onCommit?: (code: string, field: ColorwayTextField, value: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onCommit?.(code, "standard", e.target.value)}
      className={`${editableCellClass} text-sm`}
    >
      <option value="">Select</option>
      {colorwayStandardOptions.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

function ImageCell({
  row,
  onUpload,
}: {
  row: IColorway;
  onUpload?: (code: string, image: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onUpload?.(row.code, reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      className="group relative w-8 h-8 mx-auto rounded border border-light-dark overflow-hidden cursor-pointer shrink-0"
      style={!row.image ? { backgroundColor: row.colorHex || "#ffffff" } : undefined}
      title="Upload image"
    >
      {row.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={row.image} alt={row.name} className="w-full h-full object-cover" />
      )}
      <span className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-colors opacity-0 group-hover:opacity-100">
        <Upload className="size-3.5 text-white" />
      </span>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </button>
  );
}

function FlagCell({
  row,
  field,
  onToggle,
}: {
  row: IColorway;
  field: ColorwayFlag;
  onToggle?: (code: string, field: ColorwayFlag, value: boolean) => void;
}) {
  return (
    <Checkbox
      checked={row[field]}
      onCheckedChange={(checked) => onToggle?.(row.code, field, checked === true)}
      className="mx-auto"
    />
  );
}

export const GetColorwayColumns = (
  onToggle?: (code: string, field: ColorwayFlag, value: boolean) => void,
  onImageUpload?: (code: string, image: string) => void,
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
      cell: (value, row) => (
        <EditableTextCell
          value={value as string}
          code={row.code}
          field="name"
          placeholder="e.g. yellow"
          onCommit={onFieldChange}
        />
      ),
    },
    {
      header: (
        <span className="inline-flex items-center gap-1">
          Colorway <span className="text-[10px] opacity-70">↕</span>
        </span>
      ),
      accessorKey: "colorway",
      filterLabel: "All",
      cell: (value, row) => (
        <EditableTextCell
          value={value as string}
          code={row.code}
          field="colorway"
          placeholder="e.g. 1015"
          className="text-primary font-medium"
          onCommit={onFieldChange}
        />
      ),
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
      cell: (value, row) => (
        <EditableTextCell
          value={value as string}
          code={row.code}
          field="spec"
          placeholder="e.g. 1015"
          className="text-primary font-medium"
          onCommit={onFieldChange}
        />
      ),
    },
    {
      header: "Description",
      accessorKey: "description",
      filterLabel: "All",
      cell: (value, row) => (
        <EditableTextCell
          value={value as string}
          code={row.code}
          field="description"
          placeholder="Description"
          onCommit={onFieldChange}
        />
      ),
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
      cell: (value, row) => (
        <EditableStandardCell
          value={value as string}
          code={row.code}
          onCommit={onFieldChange}
        />
      ),
    },
    {
      header: "Pantone",
      accessorKey: "pantone",
      filterLabel: "All",
      cell: (value, row) => (
        <EditableTextCell
          value={value as string}
          code={row.code}
          field="pantone"
          placeholder="e.g. PANTONE® 11-0616 TCX"
          onCommit={onFieldChange}
        />
      ),
    },
    {
      header: "Image",
      accessorKey: "image",
      align: "center",
      cell: (_value, row) => (
        <ImageCell row={row} onUpload={onImageUpload} />
      ),
    },
    {
      header: "Active",
      accessorKey: "active",
      align: "center",
      filterLabel: "All",
      cell: (_value, row) => (
        <FlagCell row={row} field="active" onToggle={onToggle} />
      ),
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
      cell: (_value, row) => (
        <FlagCell row={row} field="inTheme" onToggle={onToggle} />
      ),
    },
    {
      header: (
        <>
          Sust
          <br />
          Label
          <br />
          Off
        </>
      ),
      accessorKey: "sustLabelOff",
      align: "center",
      filterLabel: "All",
      cell: (_value, row) => (
        <FlagCell row={row} field="sustLabelOff" onToggle={onToggle} />
      ),
    },
    {
      header: (
        <>
          Plan
          <br />
          SMS
        </>
      ),
      accessorKey: "planSms",
      align: "center",
      filterLabel: "All",
      cell: (_value, row) => (
        <FlagCell row={row} field="planSms" onToggle={onToggle} />
      ),
    },
    {
      header: (
        <>
          Plan
          <br />
          3D SMS
        </>
      ),
      accessorKey: "plan3dSms",
      align: "center",
      filterLabel: "All",
      cell: (_value, row) => (
        <FlagCell row={row} field="plan3dSms" onToggle={onToggle} />
      ),
    },
    {
      header: (
        <>
          Actual
          <br />
          SMS
        </>
      ),
      accessorKey: "actualSms",
      align: "center",
      filterLabel: "All",
      cell: (_value, row) => (
        <FlagCell row={row} field="actualSms" onToggle={onToggle} />
      ),
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
    },
  ];
};
