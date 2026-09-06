"use client";

import { useEffect, useState } from "react";
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
import { IMaterialClass, MaterialClassFormValues } from "./types";

const emptyValues: MaterialClassFormValues = {
  materialType: "",
  name: "",
};

interface MaterialClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  initial?: IMaterialClass | null;
  onSubmit: (values: MaterialClassFormValues) => void;
}

export default function MaterialClassModal({
  isOpen,
  onClose,
  initial,
  onSubmit,
}: MaterialClassModalProps) {
  const [values, setValues] = useState<MaterialClassFormValues>(emptyValues);

  useEffect(() => {
    if (!isOpen) return;
    setValues(
      initial
        ? {
            materialType: initial.materialType,
            name: initial.name,
          }
        : emptyValues
    );
  }, [isOpen, initial]);

  const handleSubmit = () => {
    if (!values.materialType) {
      toast.error("Material Type is required");
      return;
    }
    if (!values.name.trim()) {
      toast.error("Material Class name is required");
      return;
    }
    onSubmit({ ...values, name: values.name.trim() });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-secondary-dark">
            {initial ? "Edit Material Class" : "Create Material Class"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <InputLabel label="Material Type" required />
            <SearchableSelect
              value={values.materialType}
              options={MATERIAL_TYPES}
              onChange={(materialType) =>
                setValues((prev) => ({ ...prev, materialType }))
              }
              placeholder="Select Material Type"
              searchPlaceholder="Search material type..."
            />
          </div>

          <div>
            <InputLabel label="Material Class" required />
            <Input
              value={values.name}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="e.g. Woven"
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
