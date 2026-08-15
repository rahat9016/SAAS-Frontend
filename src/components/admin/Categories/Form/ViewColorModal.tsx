"use client";

import StatusBadge from "@/src/components/shared/Status/Status";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { StatusType } from "@/src/types/common/common";
import { IColor } from "../data/mockColorData";

interface ViewColorModalProps {
  isOpen: boolean;
  onClose: () => void;
  color?: IColor;
}

export default function ViewColorModal({
  isOpen,
  onClose,
  color,
}: ViewColorModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-white sm:max-w-125">
        <DialogHeader>
          <DialogTitle className="text-secondary text-xl font-semibold">
            Color Details
          </DialogTitle>
        </DialogHeader>

        {color && (
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <Detail label="Name" value={color.name} />
              <Detail label="Code" value={color.code} />
              <Detail
                label="Status"
                value={
                  <StatusBadge
                    status={color.status as StatusType}
                    className="px-2 py-1"
                  />
                }
              />
              <Detail label="Created At" value={color.createdAt} />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase">
                Description
              </p>
              <p className="text-sm text-secondary-gary mt-1">
                {color.description || "—"}
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
