"use client";

import StatusBadge from "@/src/components/shared/Status/Status";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { StatusType } from "@/src/types/common/common";
import { ISize } from "../data/mockSizeData";

interface ViewSizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  size?: ISize;
}

export default function ViewSizeModal({
  isOpen,
  onClose,
  size,
}: ViewSizeModalProps) {
  const unit = size?.unit || "in";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-white sm:max-w-125">
        <DialogHeader>
          <DialogTitle className="text-secondary text-xl font-semibold">
            Size Details
          </DialogTitle>
        </DialogHeader>

        {size && (
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <Detail label="Name" value={size.name} />
              <Detail label="Code" value={size.code} />
              <Detail label="Sort Order" value={size.sortOrder ?? "—"} />
              <Detail
                label="Status"
                value={
                  <StatusBadge
                    status={size.status as StatusType}
                    className="px-2 py-1"
                  />
                }
              />
            </div>

            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase mb-2">
                Measurements ({unit})
              </p>
              <div className="grid grid-cols-4 gap-3">
                <Detail label="Chest" value={size.chest ?? "—"} />
                <Detail label="Waist" value={size.waist ?? "—"} />
                <Detail label="Hip" value={size.hip ?? "—"} />
                <Detail label="Length" value={size.length ?? "—"} />
              </div>
            </div>

            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase">
                Description
              </p>
              <p className="text-sm text-secondary-gary mt-1">
                {size.description || "—"}
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[10px] font-semibold text-gray-400 uppercase">
        {label}
      </p>
      <div className="text-sm text-secondary-gary mt-1">{value}</div>
    </div>
  );
}
