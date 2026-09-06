"use client";

import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import InputLabel from "@/src/components/shared/InputLabel";
import { Button } from "@/src/components/ui/button";
import { Checkbox } from "@/src/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import SearchableSelect from "./SearchableSelect";
import { MATERIAL_TYPES } from "./data/materialHierarchy";
import { IMaterial, MaterialFormValues } from "./types";

const emptyValues: MaterialFormValues = {
  material: "",
  materialType: "",
  materialClass: "",
  materialSubClass: "",
  materialDescription: "",
  isSustainable: false,
};

interface MaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  initial?: IMaterial | null;
  /** Class / sub class names come from the live taxonomy, not a static map. */
  getClassOptions: (materialType: string) => string[];
  getSubClassOptions: (materialType: string, materialClass: string) => string[];
  onSubmit: (values: MaterialFormValues) => void;
}

export default function MaterialModal({
  isOpen,
  onClose,
  initial,
  getClassOptions,
  getSubClassOptions,
  onSubmit,
}: MaterialModalProps) {
  // Remounted by the caller on every open (see its `key`), so the initial
  // state is always in sync with `initial` — no effect needed.
  const [values, setValues] = useState<MaterialFormValues>(() =>
    initial
      ? {
          material: initial.material,
          materialType: initial.materialType,
          materialClass: initial.materialClass,
          materialSubClass: initial.materialSubClass,
          materialDescription: initial.materialDescription,
          isSustainable: initial.isSustainable,
        }
      : emptyValues
  );

  const classOptions = useMemo(
    () => getClassOptions(values.materialType),
    [getClassOptions, values.materialType]
  );
  const subClassOptions = useMemo(
    () => getSubClassOptions(values.materialType, values.materialClass),
    [getSubClassOptions, values.materialType, values.materialClass]
  );

  // Changing a parent invalidates everything below it in the hierarchy.
  const handleTypeChange = (materialType: string) =>
    setValues((prev) => ({
      ...prev,
      materialType,
      materialClass: "",
      materialSubClass: "",
    }));

  const handleClassChange = (materialClass: string) =>
    setValues((prev) => ({ ...prev, materialClass, materialSubClass: "" }));

  const handleSubmit = () => {
    if (!values.materialType) {
      toast.error("Material Type is required");
      return;
    }
    if (!values.materialClass) {
      toast.error("Material Class is required");
      return;
    }
    if (!values.materialSubClass) {
      toast.error("Material Sub Class is required");
      return;
    }
    if (!values.material.trim()) {
      toast.error("Material is required");
      return;
    }
    onSubmit({
      ...values,
      material: values.material.trim(),
      materialDescription: values.materialDescription.trim(),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-secondary-dark">
            {initial ? "Edit Material" : "Create Material"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <InputLabel label="Material Type" required />
            <SearchableSelect
              value={values.materialType}
              options={MATERIAL_TYPES}
              onChange={handleTypeChange}
              placeholder="Select Material Type"
              searchPlaceholder="Search material type..."
            />
          </div>

          <div>
            <InputLabel label="Material Class" required />
            <SearchableSelect
              value={values.materialClass}
              options={classOptions}
              onChange={handleClassChange}
              disabled={!values.materialType}
              placeholder="Select Material Class"
              searchPlaceholder="Search material class..."
            />
          </div>

          <div>
            <InputLabel label="Material Sub Class" required />
            <SearchableSelect
              value={values.materialSubClass}
              options={subClassOptions}
              onChange={(materialSubClass) =>
                setValues((prev) => ({ ...prev, materialSubClass }))
              }
              disabled={!values.materialClass}
              placeholder="Select Material Sub Class"
              searchPlaceholder="Search material sub class..."
            />
          </div>

          <div>
            <InputLabel label="Material" required />
            <Input
              value={values.material}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, material: e.target.value }))
              }
              placeholder="e.g. 100% Cotton Poplin 120gsm"
              className="h-11"
            />
          </div>

          <div>
            <InputLabel label="Material Description" />
            <Textarea
              value={values.materialDescription}
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  materialDescription: e.target.value,
                }))
              }
              placeholder="Short description"
              rows={3}
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer w-fit">
            <Checkbox
              checked={values.isSustainable}
              onCheckedChange={(checked) =>
                setValues((prev) => ({
                  ...prev,
                  isSustainable: checked === true,
                }))
              }
            />
            <span className="text-sm font-medium text-secondary-dark">
              Sustainable
            </span>
          </label>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="h-11 border-light-dark"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="h-11 bg-primary text-white hover:bg-primary/90"
          >
            {initial ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
