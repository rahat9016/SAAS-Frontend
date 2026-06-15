"use client";

import { ProductStatus } from "@/src/types/plm/productLifecycleTypes";
import {
  PRODUCT_STATUS_LABELS,
  PRODUCT_STATUS_COLORS,
} from "@/src/constants/plm/plmConstants";

interface StatusBadgeProps {
  status: ProductStatus;
  size?: "sm" | "md" | "lg";
  showDot?: boolean;
}

export default function StatusBadge({
  status,
  size = "md",
  showDot = true,
}: StatusBadgeProps) {
  const colors = PRODUCT_STATUS_COLORS[status];
  const label = PRODUCT_STATUS_LABELS[status];

  const sizeClasses = {
    sm: "text-[10px] px-1.5 py-0.5",
    md: "text-xs px-2.5 py-1",
    lg: "text-sm px-3 py-1.5",
  };

  const dotSizes = {
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
    lg: "w-2.5 h-2.5",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${colors.bg} ${colors.text} ${sizeClasses[size]}`}
    >
      {showDot && (
        <span className={`${dotSizes[size]} rounded-full ${colors.dot}`} />
      )}
      {label}
    </span>
  );
}
