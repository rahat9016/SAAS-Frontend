"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/src/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover";
import { Button } from "@/src/components/ui/button";
import InputLabel from "@/src/components/shared/InputLabel";
import { IColorway } from "@/src/lib/redux/features/colorway/colorwayTypes";
import { cn } from "@/src/lib/utils";

interface MapColorwayModalProps {
  isOpen: boolean;
  onClose: () => void;
  options: IColorway[];
  onSubmit: (codes: string[]) => void;
}

function CheckboxMark({ checked }: { checked: boolean }) {
  return (
    <span
      className={cn(
        "flex items-center justify-center size-3.5 shrink-0 rounded-[4px] border",
        checked ? "bg-primary border-primary text-white" : "border-input"
      )}
    >
      {checked && <Check className="size-2.5" />}
    </span>
  );
}

export default function MapColorwayModal({
  isOpen,
  onClose,
  options,
  onSubmit,
}: MapColorwayModalProps) {
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setSelectedCodes([]);
    onClose();
  };

  const handleSubmit = () => {
    if (selectedCodes.length === 0) return;
    onSubmit(selectedCodes);
    setSelectedCodes([]);
  };

  const toggle = (code: string) => {
    setSelectedCodes((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const selectedLabel =
    selectedCodes.length === 0
      ? "Select a colorway"
      : selectedCodes.length === 1
      ? (() => {
          const opt = options.find((o) => o.code === selectedCodes[0]);
          return opt ? `${opt.name} (${opt.colorway})` : selectedCodes[0];
        })()
      : `${selectedCodes.length} colorways selected`;

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
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="w-full flex items-center justify-between gap-1 bg-white border rounded-md px-3 py-2 text-sm text-secondary-dark shadow-none focus:outline-none"
                >
                  <span className="truncate text-left">{selectedLabel}</span>
                  <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="w-(--radix-popover-trigger-width) p-0"
                align="start"
              >
                <Command>
                  <CommandInput placeholder="Search colorway..." className="h-9 text-sm" />
                  <CommandList>
                    <CommandEmpty>No colorways available</CommandEmpty>
                    <CommandGroup>
                      {options.map((opt) => (
                        <CommandItem
                          key={opt.code}
                          value={`${opt.name} ${opt.colorway}`}
                          onSelect={() => toggle(opt.code)}
                        >
                          <CheckboxMark checked={selectedCodes.includes(opt.code)} />
                          {opt.name} ({opt.colorway})
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
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
              disabled={selectedCodes.length === 0}
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
