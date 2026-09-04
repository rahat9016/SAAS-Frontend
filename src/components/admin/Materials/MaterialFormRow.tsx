"use client";

import { useMemo, useState } from "react";
import { Check, X } from "lucide-react";
import { toast } from "react-toastify";
import { Checkbox } from "@/src/components/ui/checkbox";
import {
  MATERIAL_TYPES,
  getMaterialClasses,
  getMaterialSubClasses,
} from "./data/materialHierarchy";
import { IMaterial, MaterialFormValues } from "./types";

const fieldClass =
  "w-full h-9 bg-white border border-light-dark rounded px-2 text-xs text-secondary-dark focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-light disabled:text-secondary-gary";

const emptyValues: MaterialFormValues = {
  materialType: "",
  materialClass: "",
  materialSubClass: "",
  material: "",
  materialDescription: "",
  isSustainable: false,
};

interface MaterialFormRowProps {
  initial?: IMaterial;
  colSpan: number;
  onSave: (values: MaterialFormValues) => void;
  onCancel: () => void;
}

export default function MaterialFormRow({
  initial,
  colSpan,
  onSave,
  onCancel,
}: MaterialFormRowProps) {
  const [values, setValues] = useState<MaterialFormValues>(
    initial
      ? {
          materialType: initial.materialType,
          materialClass: initial.materialClass,
          materialSubClass: initial.materialSubClass,
          material: initial.material,
          materialDescription: initial.materialDescription,
          isSustainable: initial.isSustainable,
        }
      : emptyValues
  );

  const classOptions = useMemo(
    () => getMaterialClasses(values.materialType),
    [values.materialType]
  );
  const subClassOptions = useMemo(
    () => getMaterialSubClasses(values.materialType, values.materialClass),
    [values.materialType, values.materialClass]
  );

  const handleTypeChange = (materialType: string) => {
    setValues((prev) => ({
      ...prev,
      materialType,
      materialClass: "",
      materialSubClass: "",
    }));
  };

  const handleClassChange = (materialClass: string) => {
    setValues((prev) => ({ ...prev, materialClass, materialSubClass: "" }));
  };

  const handleSave = () => {
    if (
      !values.materialType ||
      !values.materialClass ||
      !values.materialSubClass ||
      !values.material.trim()
    ) {
      toast.error("Material Type, Class, Sub Class and Material are required");
      return;
    }
    onSave(values);
  };

  return (
    <tr className="bg-primary/5 border-b border-light-dark">
      <td colSpan={colSpan} className="p-3">
        <div className="flex flex-wrap items-end gap-2">
          <div className="flex flex-col gap-1 w-40">
            <label className="text-[10px] uppercase font-semibold text-secondary-gary">
              Material Type
            </label>
            <select
              className={fieldClass}
              value={values.materialType}
              onChange={(e) => handleTypeChange(e.target.value)}
            >
              <option value="">Select Type</option>
              {MATERIAL_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1 w-40">
            <label className="text-[10px] uppercase font-semibold text-secondary-gary">
              Material Class
            </label>
            <select
              className={fieldClass}
              value={values.materialClass}
              onChange={(e) => handleClassChange(e.target.value)}
              disabled={!values.materialType}
            >
              <option value="">Select Class</option>
              {classOptions.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1 w-44">
            <label className="text-[10px] uppercase font-semibold text-secondary-gary">
              Material Sub Class
            </label>
            <select
              className={fieldClass}
              value={values.materialSubClass}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, materialSubClass: e.target.value }))
              }
              disabled={!values.materialClass}
            >
              <option value="">Select Sub Class</option>
              {subClassOptions.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1 w-48">
            <label className="text-[10px] uppercase font-semibold text-secondary-gary">
              Material
            </label>
            <input
              className={fieldClass}
              placeholder="e.g. 100% Cotton Poplin"
              value={values.material}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, material: e.target.value }))
              }
            />
          </div>

          <div className="flex flex-col gap-1 w-56">
            <label className="text-[10px] uppercase font-semibold text-secondary-gary">
              Material Description
            </label>
            <input
              className={fieldClass}
              placeholder="Description"
              value={values.materialDescription}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, materialDescription: e.target.value }))
              }
            />
          </div>

          <div className="flex flex-col gap-1 items-center">
            <label className="text-[10px] uppercase font-semibold text-secondary-gary">
              Sustainable
            </label>
            <Checkbox
              checked={values.isSustainable}
              onCheckedChange={(checked) =>
                setValues((prev) => ({ ...prev, isSustainable: checked === true }))
              }
              className="h-9"
            />
          </div>

          <div className="flex items-center gap-1 ml-auto">
            <button
              type="button"
              onClick={handleSave}
              title="Save"
              className="inline-flex items-center justify-center size-8 rounded bg-primary text-white hover:bg-primary/90 transition-colors cursor-pointer"
            >
              <Check className="size-4" />
            </button>
            <button
              type="button"
              onClick={onCancel}
              title="Cancel"
              className="inline-flex items-center justify-center size-8 rounded border border-light-dark text-secondary-dark hover:bg-light transition-colors cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      </td>
    </tr>
  );
}
