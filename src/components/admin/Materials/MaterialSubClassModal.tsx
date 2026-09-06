"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import InputLabel from "@/src/components/shared/InputLabel";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { MATERIAL_TYPES } from "./data/materialHierarchy";
import SearchableSelect from "./SearchableSelect";
import {
  IMaterialClass,
  IMaterialSubClass,
  MaterialSubClassFormValues,
} from "./types";

interface MaterialSubClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  initial?: IMaterialSubClass | null;
  classes: IMaterialClass[];
  onSubmit: (values: MaterialSubClassFormValues) => void;
}

export default function MaterialSubClassModal({
  isOpen,
  onClose,
  initial,
  classes,
  onSubmit,
}: MaterialSubClassModalProps) {
  // Material Type only narrows the parent class list — the sub class itself is
  // stored against a parent class id, which is mandatory.
  const [materialType, setMaterialType] = useState("");
  const [classId, setClassId] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    const parent = initial
      ? classes.find((c) => c.id === initial.classId)
      : undefined;
    setMaterialType(parent?.materialType ?? "");
    setClassId(initial?.classId ?? "");
    setName(initial?.name ?? "");
  }, [isOpen, initial, classes]);

  const parentOptions = useMemo(
    () => classes.filter((c) => c.materialType === materialType),
    [classes, materialType]
  );

  const handleSubmit = () => {
    if (!classId) {
      toast.error("Parent Material Class is required");
      return;
    }
    if (!name.trim()) {
      toast.error("Material Sub Class name is required");
      return;
    }
    onSubmit({ classId, name: name.trim() });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-secondary-dark">
            {initial ? "Edit Material Sub Class" : "Create Material Sub Class"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <InputLabel label="Material Type" required />
            <SearchableSelect
              value={materialType}
              options={MATERIAL_TYPES}
              onChange={(type) => {
                setMaterialType(type);
                setClassId("");
              }}
              placeholder="Select Material Type"
              searchPlaceholder="Search material type..."
            />
          </div>

          <div>
            <InputLabel label="Parent Material Class" required />
            <SearchableSelect
              value={classId}
              options={parentOptions.map((cls) => ({
                value: cls.id,
                label: cls.name,
              }))}
              onChange={setClassId}
              disabled={!materialType}
              placeholder={
                materialType
                  ? "Select Parent Class"
                  : "Select a Material Type first"
              }
              searchPlaceholder="Search parent class..."
              emptyMessage={`No class under ${materialType}. Create one first.`}
            />
          </div>

          <div>
            <InputLabel label="Material Sub Class" required />
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Cotton Woven"
              className="h-11"
            />
          </div>
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
