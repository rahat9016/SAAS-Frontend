"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { CheckCircle2, ChevronRight } from "lucide-react";

interface PropertyCreatedDialogProps {
  isOpen: boolean;
  code: string | null;
  onClose: () => void;
  onViewDetails: () => void;
}

export default function PropertyCreatedDialog({
  isOpen,
  code,
  onClose,
  onViewDetails,
}: PropertyCreatedDialogProps) {
  if (!code) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-white sm:max-w-110">
        <DialogHeader>
          <DialogTitle className="text-secondary text-xl font-semibold flex items-center gap-2">
            <CheckCircle2 className="size-5 text-emerald-600" />
            Property Created
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-secondary-gary -mt-2">
          A unique property code has been generated. Click it to view the full
          details.
        </p>

        <button
          type="button"
          onClick={onViewDetails}
          className="w-full flex items-center justify-between gap-3 rounded-xl border-2 border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors px-5 py-4 text-left cursor-pointer"
        >
          <div>
            <p className="text-xs font-medium text-secondary-gary uppercase tracking-wide mb-1">
              Property Code
            </p>
            <p className="text-2xl font-bold text-primary tracking-wide">
              {code}
            </p>
          </div>
          <ChevronRight className="size-6 text-primary shrink-0" />
        </button>
      </DialogContent>
    </Dialog>
  );
}
