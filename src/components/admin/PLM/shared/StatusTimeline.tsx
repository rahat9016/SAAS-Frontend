"use client";

import { IStatusHistoryEntry } from "@/src/types/plm/productLifecycleTypes";
import {
  PRODUCT_STATUS_LABELS,
  PRODUCT_STATUS_COLORS,
} from "@/src/constants/plm/plmConstants";
import { PLM_ROLE_LABELS } from "@/src/constants/plm/plmConstants";
import { format } from "date-fns";
import { motion } from "framer-motion";

interface StatusTimelineProps {
  history: IStatusHistoryEntry[];
}

export default function StatusTimeline({ history }: StatusTimelineProps) {
  const sortedHistory = [...history].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return (
    <div className="relative pl-6">
      {/* Vertical line */}
      <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-200" />

      <div className="space-y-6">
        {sortedHistory.map((entry, index) => {
          const colors = PRODUCT_STATUS_COLORS[entry.toStatus];
          const isLatest = index === sortedHistory.length - 1;

          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08, duration: 0.3 }}
              className="relative"
            >
              {/* Dot */}
              <div
                className={`absolute -left-6 top-1 w-[22px] h-[22px] rounded-full flex items-center justify-center ${
                  isLatest ? colors.bg : "bg-gray-100"
                } ring-2 ring-white`}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    isLatest ? colors.dot : "bg-gray-300"
                  }`}
                />
              </div>

              {/* Content */}
              <div
                className={`p-3 rounded-lg border ${
                  isLatest
                    ? "border-gray-200 bg-white shadow-sm"
                    : "border-gray-100 bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${colors.dot}`}
                    />
                    {PRODUCT_STATUS_LABELS[entry.toStatus]}
                  </span>
                  <span className="text-[11px] text-gray-400">
                    {format(new Date(entry.timestamp), "MMM d, yyyy h:mm a")}
                  </span>
                </div>
                <div className="mt-1.5 text-xs text-gray-500">
                  <span className="font-medium text-gray-700">
                    {entry.changedBy}
                  </span>
                  <span className="text-gray-400 mx-1">•</span>
                  <span>{PLM_ROLE_LABELS[entry.changedByRole]}</span>
                </div>
                {entry.reason && (
                  <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
                    <span className="font-medium">Reason:</span>{" "}
                    {entry.reason}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
