"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Button } from "@/src/components/ui/button";
import InputLabel from "@/src/components/shared/InputLabel";
import { IColorway } from "@/src/lib/redux/features/colorway/colorwayTypes";

interface MapColorwayModalProps {
  isOpen: boolean;
  onClose: () => void;
  options: IColorway[];
  onSubmit: (code: string) => void;
}

export default function MapColorwayModal({
  isOpen,
  onClose,
  options,
  onSubmit,
}: MapColorwayModalProps) {
  const [selectedCode, setSelectedCode] = useState("");

  const handleClose = () => {
    setSelectedCode("");
    onClose();
  };

  const handleSubmit = () => {
    if (!selectedCode) return;
    onSubmit(selectedCode);
    setSelectedCode("");
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent className="bg-white sm:max-w-125">
        <DialogHeader>
          <DialogTitle className="text-secondary text-xl font-semibold">
            Manage Colorways
          </DialogTitle>
        </DialogHeader>

        <div className="w-full space-y-4 mt-2">
          <div>
            <InputLabel
              label="Colorway"
              required
              className="text-sm font-semibold text-secondary-dark"
            />
            <Select value={selectedCode} onValueChange={setSelectedCode}>
              <SelectTrigger className="w-full bg-white shadow-none">
                <SelectValue placeholder="Select a colorway" />
              </SelectTrigger>
              <SelectContent>
                {options.length === 0 ? (
                  <div className="px-2 py-1.5 text-sm text-secondary-dark/60">
                    No colorways available
                  </div>
                ) : (
                  options.map((opt) => (
                    <SelectItem key={opt.code} value={opt.code}>
                      {opt.name} ({opt.colorway})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-end gap-4 pt-2">
            <Button
              type="button"
              onClick={handleClose}
              className="text-secondary-foreground bg-transparent hover:bg-transparent border shadow-none cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={!selectedCode}
              className="cursor-pointer"
            >
              Add
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
