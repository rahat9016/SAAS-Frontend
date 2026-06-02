"use client";

import { useAppSelector, useAppDispatch } from "@/src/lib/redux/hooks";
import { updateDesignStatus } from "@/src/lib/redux/features/plm/plmSlice";
import StatusBadge from "../shared/StatusBadge";
import StatusTimeline from "../shared/StatusTimeline";
import { PRODUCT_STATUS_LABELS } from "@/src/constants/plm/plmConstants";
import { DESIGN_CATEGORIES } from "@/src/constants/plm/plmConstants";
import {
  ProductStatus,
  STATUS_TRANSITIONS,
} from "@/src/types/plm/productLifecycleTypes";

import { toast } from "react-toastify";
import { ArrowLeft, Calendar, MapPin, User, Tag } from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/src/components/ui/button";

interface DesignDetailProps {
  designId: string;
}

export default function DesignDetail({ designId }: DesignDetailProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const design = useAppSelector((state) =>
    state.plm.designs.find((d) => d.id === designId)
  );
  const userProfile = useAppSelector((state) => state.plm.userProfile);

  if (!design) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Design not found.</p>
      </div>
    );
  }

  const categoryLabel =
    DESIGN_CATEGORIES.find((c) => c.value === design.category)?.label ||
    design.category;

  const allowedTransitions = STATUS_TRANSITIONS[design.status] || [];

  // RBAC: Only show transition actions if the user has permission to advance
  const canAdvance = userProfile.permissions.includes("plm.design.advance");

  const handleTransition = (newStatus: ProductStatus) => {
    dispatch(
      updateDesignStatus({
        designId: design.id,
        newStatus,
        changedBy: userProfile.name,
        changedByRole: userProfile.roles[0],
      })
    );
    toast.success(`Status updated to ${PRODUCT_STATUS_LABELS[newStatus]}`);
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-6"
        >
          <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
            <div>
              <h1 className="text-xl font-bold text-secondary">
                {design.name}
              </h1>
              <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  {design.designerName}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {design.branchName}
                </span>
                <span className="flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" />
                  {categoryLabel}
                </span>
              </div>
            </div>
            <StatusBadge status={design.status} size="lg" />
          </div>

          <div className="border-t border-gray-100 pt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Description
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {design.description}
            </p>
          </div>

          {/* Rejection Reason */}
          {design.rejectionReason && (
            <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg">
              <p className="text-xs font-semibold text-red-700 mb-1">
                Rejection Reason
              </p>
              <p className="text-sm text-red-600">{design.rejectionReason}</p>
            </div>
          )}

          {/* Dates */}
          <div className="mt-4 flex items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Created: {format(new Date(design.createdAt), "MMM d, yyyy")}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Updated: {format(new Date(design.updatedAt), "MMM d, yyyy")}
            </span>
          </div>

          {/* Status Transition Actions — only if user has advance permission */}
          {canAdvance && allowedTransitions.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Available Actions
              </h3>
              <div className="flex flex-wrap gap-2">
                {allowedTransitions.map((nextStatus) => (
                  <Button
                    key={nextStatus}
                    onClick={() => handleTransition(nextStatus)}
                    className="text-xs cursor-pointer bg-primary hover:bg-primary/80 text-white"
                    size="sm"
                  >
                    → {PRODUCT_STATUS_LABELS[nextStatus]}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Timeline Sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-gray-100 p-6"
        >
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            Status History
          </h3>
          <StatusTimeline history={design.statusHistory} />
        </motion.div>
      </div>
    </div>
  );
}
