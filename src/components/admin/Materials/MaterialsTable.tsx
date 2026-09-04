"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Layers, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { Input } from "@/src/components/ui/input";
import { Checkbox } from "@/src/components/ui/checkbox";
import { MATERIAL_TYPES } from "./data/materialHierarchy";
import { useMaterials } from "./hooks/useMaterials";
import MaterialFormRow from "./MaterialFormRow";
import { IMaterial, MaterialFormValues } from "./types";

const columns = [
  "Material Class",
  "Material Sub Class",
  "Material",
  "Description",
  "Sustainable",
  "Actions",
];
const columnClass = "py-3 px-4 border-r border-light-dark last:border-r-0";

export default function MaterialsTable() {
  const { materials, addMaterial, updateMaterial, deleteMaterial } = useMaterials();

  const [search, setSearch] = useState("");
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(
    () => new Set(MATERIAL_TYPES)
  );
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const filteredMaterials = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return materials;
    return materials.filter((m) =>
      [m.materialType, m.materialClass, m.materialSubClass, m.material, m.materialDescription]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [materials, search]);

  // Group strictly by Material Type — every type always shows, even with 0 items,
  // so a newly created material always has a visible home to land in.
  const groupedMaterials = useMemo(() => {
    const map = new Map<string, IMaterial[]>();
    MATERIAL_TYPES.forEach((type) => map.set(type, []));
    filteredMaterials.forEach((item) => {
      if (!map.has(item.materialType)) map.set(item.materialType, []);
      map.get(item.materialType)!.push(item);
    });
    return Array.from(map.entries()).map(([materialType, items]) => ({
      materialType,
      items,
    }));
  }, [filteredMaterials]);

  const toggleGroup = (type: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  const expandGroup = (type: string) => {
    setCollapsedGroups((prev) => {
      if (!prev.has(type)) return prev;
      const next = new Set(prev);
      next.delete(type);
      return next;
    });
  };

  const handleCreate = (values: MaterialFormValues) => {
    const item = addMaterial(values);
    setIsCreating(false);
    expandGroup(item.materialType);
    toast.success(`Material "${item.material}" created`);
  };

  const handleUpdate = (id: string, values: MaterialFormValues) => {
    updateMaterial(id, values);
    setEditingId(null);
    expandGroup(values.materialType);
    toast.success(`Material "${values.material}" updated`);
  };

  const handleDelete = (item: IMaterial) => {
    deleteMaterial(item.id);
    toast.info(`Material "${item.material}" deleted`);
  };

  return (
    <div className="w-full space-y-4">
      {/* Header card */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 bg-white border border-light-dark rounded-lg px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-11 rounded-lg bg-primary/10 text-primary shrink-0">
            <Layers className="size-5" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl text-secondary-dark font-bold tracking-tight">
              Material Management
            </h1>
            <p className="text-xs md:text-sm text-secondary-gary">
              Material Type → Material Class → Material Sub Class → Material
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 lg:ml-auto">
          <div className="flex items-center border border-light-dark px-3 rounded-[6px] h-11 w-full max-w-60">
            <Search className="text-[#BDBDBD] size-4 shrink-0" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search materials..."
              className="border-none shadow-none focus-visible:ring-0 h-auto placeholder:text-[#BDBDBD] bg-transparent"
            />
          </div>

          <button
            onClick={() => {
              setEditingId(null);
              setIsCreating((v) => !v);
            }}
            className="flex items-center gap-1.5 h-11 px-6 bg-primary text-white text-sm font-medium rounded-lg shadow-sm hover:bg-primary/90 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="size-4" />
            New Material
          </button>
        </div>
      </div>

      {/* Materials table */}
      <div className="bg-white border border-light-dark rounded-lg overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
            <thead>
              <tr className="bg-[#5098D5]">
                {columns.map((header) => (
                  <th
                    key={header}
                    className="py-3 px-4 border-r border-white/30 last:border-r-0 font-semibold text-white text-xs uppercase tracking-wide"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            {isCreating && (
              <tbody>
                <MaterialFormRow
                  colSpan={columns.length}
                  onSave={handleCreate}
                  onCancel={() => setIsCreating(false)}
                />
              </tbody>
            )}

            {groupedMaterials.map((group) => {
              const isCollapsed = collapsedGroups.has(group.materialType);
              return (
                <tbody key={group.materialType}>
                  <tr className="bg-light border-b border-light-dark">
                    <td colSpan={columns.length} className="p-0">
                      <button
                        onClick={() => toggleGroup(group.materialType)}
                        className="w-full flex items-center gap-2 py-2.5 px-4 text-sm font-semibold text-secondary-dark hover:bg-light-dark/40 transition-colors cursor-pointer"
                      >
                        {isCollapsed ? (
                          <ChevronRight className="size-4 text-primary" />
                        ) : (
                          <ChevronDown className="size-4 text-primary" />
                        )}
                        {group.materialType}
                        <span className="text-secondary-gary font-normal">
                          ({group.items.length.toString().padStart(2, "0")})
                        </span>
                      </button>
                    </td>
                  </tr>

                  {!isCollapsed && group.items.length === 0 && (
                    <tr className="border-b border-light-dark">
                      <td
                        colSpan={columns.length}
                        className="py-4 px-4 text-secondary-gary italic"
                      >
                        No materials yet under {group.materialType}.
                      </td>
                    </tr>
                  )}

                  {!isCollapsed &&
                    group.items.map((item) =>
                      editingId === item.id ? (
                        <MaterialFormRow
                          key={item.id}
                          initial={item}
                          colSpan={columns.length}
                          onSave={(values) => handleUpdate(item.id, values)}
                          onCancel={() => setEditingId(null)}
                        />
                      ) : (
                        <tr
                          key={item.id}
                          className="border-b border-light-dark even:bg-light/30 hover:bg-primary/5 transition-colors"
                        >
                          <td className={`${columnClass} text-secondary-dark`}>
                            {item.materialClass}
                          </td>
                          <td className={`${columnClass} text-secondary-dark`}>
                            {item.materialSubClass}
                          </td>
                          <td className={`${columnClass} text-secondary-dark font-medium`}>
                            {item.material}
                          </td>
                          <td className={`${columnClass} text-secondary-gary`}>
                            {item.materialDescription}
                          </td>
                          <td className={`${columnClass} text-center`}>
                            <Checkbox checked={item.isSustainable} disabled className="mx-auto" />
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setIsCreating(false);
                                  setEditingId(item.id);
                                }}
                                title="Edit"
                                className="inline-flex items-center justify-center size-7 rounded text-secondary-dark/60 hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                              >
                                <Pencil className="size-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(item)}
                                title="Delete"
                                className="inline-flex items-center justify-center size-7 rounded text-secondary-dark/60 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    )}
                </tbody>
              );
            })}
          </table>
        </div>
      </div>
    </div>
  );
}
