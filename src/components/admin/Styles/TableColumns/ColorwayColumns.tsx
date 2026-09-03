import { Check, ChevronsUpDown, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { Checkbox } from "@/src/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/src/components/ui/command";
import { ColumnDef } from "@/src/components/ui/data-table";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover";
import { cn } from "@/src/lib/utils";
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
  type = "text",
  onCommit,
}: {
  value: string;
  code: string;
  field: ColorwayTextField;
  placeholder?: string;
  className?: string;
  type?: string;
  onCommit?: (code: string, field: ColorwayTextField, value: string) => void;
}) {
  return (
    <input
      key={value}
      type={type}
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
      className="group absolute inset-0 overflow-hidden cursor-pointer"
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

export function ColumnFilterSelect({
  value,
  options,
  onChange,
  renderLabel,
}: {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  renderLabel?: (value: string) => string;
}) {
  const [open, setOpen] = useState(false);
  const label = value === "all" ? "All" : renderLabel ? renderLabel(value) : value;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="w-full flex items-center justify-between gap-1 bg-transparent text-secondary-dark font-medium focus:outline-none"
        >
          <span className="truncate">{label}</span>
          <ChevronsUpDown className="size-3 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-0" align="start">
        <Command>
          <CommandInput placeholder="Search..." className="h-8 text-xs" />
          <CommandList>
            <CommandEmpty>No results.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                value="all"
                onSelect={() => {
                  onChange("all");
                  setOpen(false);
                }}
              >
                <Check
                  className={cn("size-3.5", value === "all" ? "opacity-100" : "opacity-0")}
                />
                All
              </CommandItem>
              {options.map((opt) => (
                <CommandItem
                  key={opt}
                  value={opt}
                  onSelect={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn("size-3.5", value === opt ? "opacity-100" : "opacity-0")}
                  />
                  {renderLabel ? renderLabel(opt) : opt}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
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

export type ColorwayFilterableField =
  | "name"
  | "colorway"
  | "spec"
  | "standard"
  | "pantone"
  | "active";

export const GetColorwayColumns = (
  onToggle?: (code: string, field: ColorwayFlag, value: boolean) => void,
  onImageUpload?: (code: string, image: string) => void,
  onFieldChange?: (code: string, field: ColorwayTextField, value: string) => void,
  filterOptions: Partial<Record<ColorwayFilterableField, string[]>> = {},
  columnFilters: Partial<Record<ColorwayFilterableField, string>> = {},
  onColumnFilterChange?: (field: ColorwayFilterableField, value: string) => void
): ColumnDef<IColorway>[] => {
  const columnFilter = (
    field: ColorwayFilterableField,
    renderLabel?: (value: string) => string
  ) => (
    <ColumnFilterSelect
      value={columnFilters[field] ?? "all"}
      options={filterOptions[field] ?? []}
      onChange={(value) => onColumnFilterChange?.(field, value)}
      renderLabel={renderLabel}
    />
  );

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
      filterLabel: columnFilter("name"),
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
      filterLabel: columnFilter("colorway"),
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
      filterLabel: columnFilter("spec"),
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
      filterLabel: columnFilter("standard"),
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
      filterLabel: columnFilter("pantone"),
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
      noPadding: true,
      cell: (_value, row) => (
        <ImageCell row={row} onUpload={onImageUpload} />
      ),
    },
    {
      header: "Active",
      accessorKey: "active",
      align: "center",
      filterLabel: columnFilter("active", (v) =>
        v === "true" ? "Active" : "Inactive"
      ),
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
  ];
};
