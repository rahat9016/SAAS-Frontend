"use client";

import { useState } from "react";
import { useAppSelector } from "@/src/lib/redux/hooks";
import { useGet } from "@/src/hooks/useGet";
import { usePost } from "@/src/hooks/usePost";
import { usePatch } from "@/src/hooks/usePatch";
import { ProductStatus } from "@/src/types/plm/productLifecycleTypes";
import StatusBadge from "../shared/StatusBadge";
import RoleSwitcher from "../shared/RoleSwitcher";
import BranchSelector from "../shared/BranchSelector";
import RejectionReasonDialog from "../shared/RejectionReasonDialog";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  Send,
  Eye,
  RotateCcw,
  ArrowDownToLine,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useRouter } from "next/navigation";

export default function ModerationPanel() {
  const router = useRouter();
  const selectedBranchId = useAppSelector(
    (state) => state.plm.selectedBranchId
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [rejectDesignId, setRejectDesignId] = useState<string | null>(null);
  const [redesignDesignId, setRedesignDesignId] = useState<string | null>(null);

  // Fetch designs pending moderator review or action (submitted or super admin rejected)
  const { data: pendingData, isLoading: isPendingLoading } = useGet<any>(
    "/api/plm/approval/moderator",
    ["pendingModeration", selectedBranchId || "all"],
    {
      ...(selectedBranchId && { branchId: selectedBranchId }),
    }
  );
  const pendingDesignsAll = pendingData?.data || [];

  // Split pending list on client side
  const pendingDesigns = pendingDesignsAll.filter((d: any) =>
    [ProductStatus.DESIGN_SUBMITTED, ProductStatus.MODERATOR_REVIEW].includes(d.status)
  );

  const returnedDesigns = pendingDesignsAll.filter((d: any) =>
    d.status === ProductStatus.SUPER_ADMIN_REJECTED
  );

  // Fetch approved designs
  const { data: approvedData } = useGet<any>(
    "/api/plm/design",
    ["approvedModeration", selectedBranchId || "all"],
    {
      status: ProductStatus.MODERATOR_APPROVED,
      limit: "50",
      ...(selectedBranchId && { branchId: selectedBranchId }),
    }
  );
  const approvedDesigns = approvedData?.data || [];

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === pendingDesigns.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(pendingDesigns.map((d: any) => d.id));
    }
  };

  // Status update mutation using PATCH
  const { mutate: patchMutate } = usePatch(
    () => {},
    [["pendingModeration"], ["approvedModeration"], ["designs"]]
  );

  const handleMoveToReview = (designId: string) => {
    patchMutate({
      url: `/api/plm/design/${designId}`,
      data: { status: ProductStatus.MODERATOR_REVIEW },
    }, {
      onSuccess: () => {
        toast.success("Design moved to review");
      }
    });
  };

  // Batch approve mutation
  const { mutate: batchApproveMutate } = usePost(
    "/api/plm/approval/moderator",
    () => {
      setSelectedIds([]);
      toast.success("Selected designs approved");
    },
    [["pendingModeration"], ["approvedModeration"], ["designs"]]
  );

  const handleApproveSelected = () => {
    const reviewIds = selectedIds.filter((id) => {
      const d = pendingDesignsAll.find((d: any) => d.id === id);
      return d?.status === ProductStatus.MODERATOR_REVIEW;
    });

    if (reviewIds.length === 0) {
      toast.warning("Please select designs in review status to approve.");
      return;
    }

    batchApproveMutate({
      approvedIds: reviewIds,
    });
  };

  const handleReject = (reason: string) => {
    if (rejectDesignId) {
      patchMutate({
        url: `/api/plm/design/${rejectDesignId}`,
        data: { status: ProductStatus.REDESIGN_REQUIRED, reason },
      }, {
        onSuccess: () => {
          setRejectDesignId(null);
          toast.success("Design sent back for redesign");
        }
      });
    }
  };

  // Send to Super Admin mutation
  const { mutate: sendToAdminMutate } = usePost(
    "/api/plm/approval/send-to-admin",
    () => {
      toast.success("Approved designs sent to Super Admin for final review");
    },
    [["approvedModeration"], ["pendingModeration"], ["designs"]]
  );

  const handleSendToAdmin = () => {
    const approvedIds = approvedDesigns.map((d: any) => d.id);
    if (approvedIds.length === 0) {
      toast.warning("No approved designs to send.");
      return;
    }
    sendToAdminMutate({ designIds: approvedIds });
  };

  const handleResubmitToAdmin = (designId: string) => {
    patchMutate({
      url: `/api/plm/design/${designId}`,
      data: { status: ProductStatus.MODERATOR_REVIEW, reason: "Resubmitted after admin rejection" },
    }, {
      onSuccess: () => {
        toast.success("Design resubmitted — now in moderator review");
      }
    });
  };

  const handleSendToRedesign = (reason: string) => {
    if (redesignDesignId) {
      patchMutate({
        url: `/api/plm/design/${redesignDesignId}`,
        data: { status: ProductStatus.REDESIGN_REQUIRED, reason },
      }, {
        onSuccess: () => {
          setRedesignDesignId(null);
          toast.success("Design sent back to design team for redesign");
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="w-full sm:w-64">
          <RoleSwitcher />
        </div>
        <BranchSelector />
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-secondary">Moderation Panel</h1>
        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <Button
              onClick={handleApproveSelected}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1 cursor-pointer"
              size="sm"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Approve ({selectedIds.length})
            </Button>
          )}
          {approvedDesigns.length > 0 && (
            <Button
              onClick={handleSendToAdmin}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs gap-1 cursor-pointer"
              size="sm"
            >
              <Send className="w-3.5 h-3.5" />
              Send to Admin ({approvedDesigns.length})
            </Button>
          )}
        </div>
      </div>

      {/* ─── Section 3: Returned from Admin (show first for urgency) ── */}
      {returnedDesigns.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-red-600 mb-3 uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" />
            Returned from Admin ({returnedDesigns.length})
          </h2>
          <div className="space-y-3">
            {returnedDesigns.map((design: any, index: number) => (
              <motion.div
                key={design.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-red-50/50 rounded-xl border border-red-200 p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-secondary text-sm truncate">
                        {design.name}
                      </h3>
                      <StatusBadge status={design.status} size="sm" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {design.designerName} • {design.branchName}
                    </p>
                    {/* Rejection reason from admin */}
                    {design.rejectionReason && (
                      <div className="mt-2 p-2 bg-red-100/70 rounded-lg border border-red-200">
                        <p className="text-xs font-semibold text-red-700 mb-0.5">
                          Admin Rejection Reason:
                        </p>
                        <p className="text-xs text-red-600">
                          {design.rejectionReason}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <Button
                      size="sm"
                      className="h-8 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs gap-1 cursor-pointer"
                      onClick={() => handleResubmitToAdmin(design.id)}
                    >
                      <RotateCcw className="w-3 h-3" />
                      Re-review
                    </Button>
                    <Button
                      size="sm"
                      className="h-8 bg-amber-100 hover:bg-amber-200 text-amber-700 text-xs gap-1 cursor-pointer"
                      onClick={() => setRedesignDesignId(design.id)}
                    >
                      <ArrowDownToLine className="w-3 h-3" />
                      Send to Redesign
                    </Button>
                    <Button
                      size="sm"
                      className="w-8! h-8 bg-gray-100 hover:bg-gray-200 cursor-pointer"
                      onClick={() =>
                        router.push(`/admin/plm/designs/${design.id}`)
                      }
                    >
                      <Eye className="w-3.5 h-3.5 text-gray-600" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Section 1: Pending Designs ───────────────────────────── */}
      <div>
        <h2 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wider">
          Pending Review ({pendingDesigns.length})
        </h2>
        {isPendingLoading ? (
          <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-400 text-sm">
            Loading designs pending review...
          </div>
        ) : pendingDesigns.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-400 text-sm">
            No designs pending review
          </div>
        ) : (
          <div className="space-y-3">
            {/* Select All */}
            <div className="flex items-center gap-2 px-1">
              <input
                type="checkbox"
                checked={
                  selectedIds.length === pendingDesigns.length &&
                  pendingDesigns.length > 0
                }
                onChange={toggleSelectAll}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
              />
              <span className="text-xs text-gray-500 font-medium">
                Select All
              </span>
            </div>

            {pendingDesigns.map((design: any, index: number) => (
              <motion.div
                key={design.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white rounded-xl border p-4 transition-all ${
                  selectedIds.includes(design.id)
                    ? "border-primary shadow-sm ring-1 ring-primary/20"
                    : "border-gray-100 hover:border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(design.id)}
                    onChange={() => toggleSelect(design.id)}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-secondary text-sm truncate">
                        {design.name}
                      </h3>
                      <StatusBadge status={design.status} size="sm" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                      {design.description}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                      <span>{design.designerName}</span>
                      <span>•</span>
                      <span>{design.branchName}</span>
                      <span>•</span>
                      <span className="capitalize">{design.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <Button
                      size="sm"
                      className="w-8! h-8 bg-gray-100 hover:bg-gray-200 cursor-pointer"
                      onClick={() =>
                        router.push(`/admin/plm/designs/${design.id}`)
                      }
                    >
                      <Eye className="w-3.5 h-3.5 text-gray-600" />
                    </Button>
                    {design.status === ProductStatus.DESIGN_SUBMITTED && (
                      <Button
                        size="sm"
                        className="w-8! h-8 bg-blue-100 hover:bg-blue-200 cursor-pointer"
                        onClick={() => handleMoveToReview(design.id)}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                      </Button>
                    )}
                    {design.status === ProductStatus.MODERATOR_REVIEW && (
                      <Button
                        size="sm"
                        className="w-8! h-8 bg-red-100 hover:bg-red-200 cursor-pointer"
                        onClick={() => setRejectDesignId(design.id)}
                      >
                        <XCircle className="w-3.5 h-3.5 text-red-500" />
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ─── Section 2: Approved & Ready to Send ──────────────────── */}
      {approvedDesigns.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wider">
            Approved — Ready to Send ({approvedDesigns.length})
          </h2>
          <div className="space-y-3">
            {approvedDesigns.map((design: any) => (
              <div
                key={design.id}
                className="bg-emerald-50/50 rounded-xl border border-emerald-100 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-secondary text-sm">
                        {design.name}
                      </h3>
                      <StatusBadge status={design.status} size="sm" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {design.designerName} • {design.branchName}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rejection Dialog (moderator rejects design → back to design team) */}
      <RejectionReasonDialog
        isOpen={!!rejectDesignId}
        onClose={() => setRejectDesignId(null)}
        onConfirm={handleReject}
        title="Reject Design"
        description="Please provide a reason for rejecting this design. The design team will be notified."
      />

      {/* Redesign Dialog (returned item → send back to design team) */}
      <RejectionReasonDialog
        isOpen={!!redesignDesignId}
        onClose={() => setRedesignDesignId(null)}
        onConfirm={handleSendToRedesign}
        title="Send to Redesign"
        description="Provide instructions for the design team. The admin's rejection reason will also be visible."
      />
    </div>
  );
}
