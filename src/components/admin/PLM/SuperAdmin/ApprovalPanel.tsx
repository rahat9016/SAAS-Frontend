"use client";

import { useMemo, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/src/lib/redux/hooks";
import {
  superAdminBatchDecision,
} from "@/src/lib/redux/features/plm/plmSlice";
import { ProductStatus } from "@/src/types/plm/productLifecycleTypes";
import StatusBadge from "../shared/StatusBadge";
import RoleSwitcher from "../shared/RoleSwitcher";
import BranchSelector from "../shared/BranchSelector";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  Eye,
  Send,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useRouter } from "next/navigation";

export default function ApprovalPanel() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const designs = useAppSelector((state) => state.plm.designs);
  const selectedBranchId = useAppSelector(
    (state) => state.plm.selectedBranchId
  );

  // Multi-select: these are the items the admin APPROVES
  const [approvedIds, setApprovedIds] = useState<string[]>([]);
  // Per-item rejection reasons
  const [rejectionReasons, setRejectionReasons] = useState<
    Record<string, string>
  >({});
  // Step: 'select' or 'confirm'
  const [step, setStep] = useState<"select" | "confirm">("select");

  // Designs pending Super Admin review
  const pendingApproval = useMemo(() => {
    let filtered = designs.filter(
      (d) => d.status === ProductStatus.SUPER_ADMIN_REVIEW
    );
    if (selectedBranchId)
      filtered = filtered.filter((d) => d.branchId === selectedBranchId);
    return filtered;
  }, [designs, selectedBranchId]);

  // Recently decided
  const recentDecisions = useMemo(() => {
    let filtered = designs.filter((d) =>
      [
        ProductStatus.SUPER_ADMIN_APPROVED,
        ProductStatus.SUPER_ADMIN_REJECTED,
        ProductStatus.SUPER_ADMIN_PARTIAL_APPROVED,
      ].includes(d.status)
    );
    if (selectedBranchId)
      filtered = filtered.filter((d) => d.branchId === selectedBranchId);
    return filtered.slice(0, 10);
  }, [designs, selectedBranchId]);

  // Items NOT selected = will be rejected
  const rejectedIds = pendingApproval
    .filter((d) => !approvedIds.includes(d.id))
    .map((d) => d.id);

  const toggleApprove = (id: string) => {
    setApprovedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleApproveAll = () => {
    if (approvedIds.length === pendingApproval.length) {
      setApprovedIds([]);
    } else {
      setApprovedIds(pendingApproval.map((d) => d.id));
    }
  };

  const handleProceedToConfirm = () => {
    if (approvedIds.length === 0 && rejectedIds.length === 0) {
      toast.warning("No items to process.");
      return;
    }
    // Pre-populate rejection reasons
    const reasons: Record<string, string> = {};
    rejectedIds.forEach((id) => {
      reasons[id] = rejectionReasons[id] || "";
    });
    setRejectionReasons(reasons);
    setStep("confirm");
  };

  const handleSubmitDecision = () => {
    // Validate all rejected items have reasons
    const missingReasons = rejectedIds.filter(
      (id) => !rejectionReasons[id]?.trim()
    );
    if (missingReasons.length > 0) {
      toast.error("Please provide rejection reasons for all rejected items.");
      return;
    }

    dispatch(
      superAdminBatchDecision({
        approvedIds,
        rejectedIds,
        rejectedReasons: rejectionReasons,
        adminName: "Super Admin",
      })
    );

    toast.success(
      `${approvedIds.length} approved, ${rejectedIds.length} rejected`
    );
    setApprovedIds([]);
    setRejectionReasons({});
    setStep("select");
  };

  const handleBack = () => {
    setStep("select");
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
      <h1 className="text-xl font-bold text-secondary">Approval Panel</h1>

      {/* ─── STEP 1: SELECT ITEMS ─────────────────────────────────── */}
      {step === "select" && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
              Pending Review ({pendingApproval.length})
            </h2>
            {pendingApproval.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">
                  {approvedIds.length} selected to approve
                  {rejectedIds.length > 0 && (
                    <span className="text-red-500 font-medium">
                      {" "}
                      • {rejectedIds.length} will be rejected
                    </span>
                  )}
                </span>
                <Button
                  onClick={handleProceedToConfirm}
                  disabled={
                    approvedIds.length === 0 &&
                    pendingApproval.length === 0
                  }
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs gap-1 cursor-pointer disabled:opacity-50"
                  size="sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  Submit Decision
                </Button>
              </div>
            )}
          </div>

          {pendingApproval.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-400 text-sm">
              No designs pending approval
            </div>
          ) : (
            <div className="space-y-3">
              {/* Select All */}
              <div className="flex items-center gap-2 px-1">
                <input
                  type="checkbox"
                  checked={
                    approvedIds.length === pendingApproval.length &&
                    pendingApproval.length > 0
                  }
                  onChange={toggleApproveAll}
                  className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs text-gray-500 font-medium">
                  Select All for Approval
                </span>
              </div>

              {pendingApproval.map((design, index) => {
                const isApproved = approvedIds.includes(design.id);
                return (
                  <motion.div
                    key={design.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`bg-white rounded-xl border p-4 transition-all ${
                      isApproved
                        ? "border-emerald-300 ring-1 ring-emerald-100 shadow-sm"
                        : "border-red-200 bg-red-50/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isApproved}
                        onChange={() => toggleApprove(design.id)}
                        className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-secondary text-sm truncate">
                            {design.name}
                          </h3>
                          {isApproved ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3 h-3" /> Will Approve
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                              <XCircle className="w-3 h-3" /> Will Reject
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                          {design.description}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                          <span>{design.designerName}</span>
                          <span>•</span>
                          <span>{design.branchName}</span>
                          <span>•</span>
                          <span className="capitalize">{design.category}</span>
                        </div>
                      </div>
                      <Button
                        onClick={() =>
                          router.push(`/admin/plm/designs/${design.id}`)
                        }
                        className="w-8! h-8 bg-gray-100 hover:bg-gray-200 cursor-pointer flex-shrink-0"
                        size="sm"
                      >
                        <Eye className="w-3.5 h-3.5 text-gray-600" />
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ─── STEP 2: CONFIRM & ADD REJECTION REASONS ─────────────── */}
      {step === "confirm" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <Button
              onClick={handleBack}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs cursor-pointer"
              size="sm"
            >
              ← Back to Selection
            </Button>
            <Button
              onClick={handleSubmitDecision}
              className="bg-primary hover:bg-primary/80 text-white text-xs gap-1 cursor-pointer"
              size="sm"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Confirm Decision
            </Button>
          </div>

          {/* Approved Summary */}
          {approvedIds.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-emerald-700 mb-3 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Approving (
                {approvedIds.length})
              </h2>
              <div className="space-y-2">
                {pendingApproval
                  .filter((d) => approvedIds.includes(d.id))
                  .map((design) => (
                    <div
                      key={design.id}
                      className="bg-emerald-50 rounded-lg border border-emerald-100 p-3 flex items-center gap-3"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-secondary text-sm truncate">
                          {design.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {design.branchName} • {design.designerName}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Rejected — need reasons */}
          {rejectedIds.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-red-700 mb-3 uppercase tracking-wider flex items-center gap-1.5">
                <XCircle className="w-4 h-4" /> Rejecting ({rejectedIds.length}
                ) — Provide Reasons
              </h2>
              <div className="space-y-3">
                {pendingApproval
                  .filter((d) => rejectedIds.includes(d.id))
                  .map((design) => (
                    <div
                      key={design.id}
                      className="bg-red-50/50 rounded-lg border border-red-100 p-4"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                        <h3 className="font-medium text-secondary text-sm truncate">
                          {design.name}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {design.branchName}
                        </span>
                      </div>
                      <textarea
                        value={rejectionReasons[design.id] || ""}
                        onChange={(e) =>
                          setRejectionReasons((prev) => ({
                            ...prev,
                            [design.id]: e.target.value,
                          }))
                        }
                        placeholder="Enter rejection reason (required)..."
                        rows={2}
                        className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 resize-none ${
                          rejectionReasons[design.id]?.trim()
                            ? "border-gray-200 focus:ring-primary/20 focus:border-primary"
                            : "border-red-300 focus:ring-red-200 focus:border-red-400"
                        }`}
                      />
                      {!rejectionReasons[design.id]?.trim() && (
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Reason required
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── Recent Decisions ─────────────────────────────────────── */}
      {recentDecisions.length > 0 && step === "select" && (
        <div>
          <h2 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wider">
            Recent Decisions
          </h2>
          <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
            {recentDecisions.map((d) => (
              <div key={d.id} className="p-4 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-secondary text-sm truncate">
                    {d.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {d.branchName}
                  </p>
                  {d.rejectionReason && (
                    <p className="text-xs text-red-500 mt-1 line-clamp-1">
                      Reason: {d.rejectionReason}
                    </p>
                  )}
                </div>
                <StatusBadge status={d.status} size="sm" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
