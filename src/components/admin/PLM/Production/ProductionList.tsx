"use client";

import { useMemo } from "react";
import { useAppSelector } from "@/src/lib/redux/hooks";
import { useGet } from "@/src/hooks/useGet";
import { usePatch } from "@/src/hooks/usePatch";
import { ProductStatus } from "@/src/types/plm/productLifecycleTypes";
import { PRODUCT_STATUS_LABELS } from "@/src/constants/plm/plmConstants";
import StatusBadge from "../shared/StatusBadge";
import RoleSwitcher from "../shared/RoleSwitcher";
import BranchSelector from "../shared/BranchSelector";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Factory, Calendar, User, ChevronRight } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

export default function ProductionList() {
  const router = useRouter();
  const selectedBranchId = useAppSelector((state) => state.plm.selectedBranchId);

  // Fetch approved designs not yet in production
  const { data: designsData } = useGet<any>(
    "/api/plm/design",
    ["designsWaitingProduction", selectedBranchId || "all"],
    {
      limit: "50",
      ...(selectedBranchId && { branchId: selectedBranchId }),
    }
  );

  const approvedDesigns = useMemo(() => {
    const list = designsData?.data || [];
    return list.filter((d: any) =>
      [
        ProductStatus.SUPER_ADMIN_APPROVED,
        ProductStatus.SUPER_ADMIN_PARTIAL_APPROVED,
        ProductStatus.SAMPLE_DEVELOPMENT,
      ].includes(d.status)
    );
  }, [designsData]);

  // Fetch production worksheets
  const { data: worksheetsData, isLoading: isWorksheetsLoading } = useGet<any>(
    "/api/plm/production/worksheet",
    ["worksheets", selectedBranchId || "all"],
    {
      ...(selectedBranchId && { branchId: selectedBranchId }),
    }
  );

  const activeWorksheets = useMemo(() => {
    const list = worksheetsData?.data || [];
    return list.map((ws: any) => {
      let materialsList = [];
      try {
        materialsList = typeof ws.materials === "string" ? JSON.parse(ws.materials) : ws.materials;
      } catch (e) {
        console.error("Failed to parse materials JSON", e);
      }
      return {
        ...ws,
        designName: ws.design?.name || "Unknown Design",
        branchName: ws.branch?.name || "Unknown Branch",
        materials: Array.isArray(materialsList) ? materialsList : [],
      };
    });
  }, [worksheetsData]);

  const progressStatuses: ProductStatus[] = [
    ProductStatus.SAMPLE_DEVELOPMENT,
    ProductStatus.RAW_MATERIAL_ALLOCATED,
    ProductStatus.PRODUCTION_WORKSHEET_CREATED,
    ProductStatus.READY_FOR_PRODUCTION,
    ProductStatus.IN_PRODUCTION,
    ProductStatus.QUALITY_CHECK,
    ProductStatus.READY_FOR_BRANCH,
    ProductStatus.LIVE_FOR_SALE,
  ];

  const getProgress = (status: ProductStatus) => {
    const idx = progressStatuses.indexOf(status);
    return idx >= 0 ? Math.round(((idx + 1) / progressStatuses.length) * 100) : 0;
  };

  const { mutate: patchMutate } = usePatch(
    () => {},
    [["worksheets"], ["designsWaitingProduction"], ["designs"]]
  );

  const handleAdvanceStatus = (worksheetId: string, currentStatus: ProductStatus) => {
    const idx = progressStatuses.indexOf(currentStatus);
    if (idx >= 0 && idx < progressStatuses.length - 1) {
      const nextStatus = progressStatuses[idx + 1];
      patchMutate({
        url: `/api/plm/production/worksheet/${worksheetId}`,
        data: { status: nextStatus },
      }, {
        onSuccess: () => {
          toast.success(`Advanced to ${PRODUCT_STATUS_LABELS[nextStatus]}`);
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="w-full sm:w-64"><RoleSwitcher /></div>
        <BranchSelector />
      </div>
      <h1 className="text-xl font-bold text-secondary">Production Queue</h1>

      {/* Active Worksheets */}
      <div>
        <h2 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wider">Active Production ({activeWorksheets.length})</h2>
        {isWorksheetsLoading ? (
          <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-400 text-sm">Loading active production...</div>
        ) : activeWorksheets.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-400 text-sm">No active production</div>
        ) : (
          <div className="space-y-4">
            {activeWorksheets.map((ws: any, i: number) => {
              const progress = getProgress(ws.status);
              return (
                <motion.div key={ws.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white rounded-xl border border-gray-100 p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="font-semibold text-secondary text-sm">{ws.designName}</h3>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><User className="w-3 h-3" /> {ws.assignedTo}</span>
                        <span>{ws.branchName}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Due: {format(new Date(ws.estimatedCompletionDate), "MMM d, yyyy")}</span>
                      </div>
                    </div>
                    <StatusBadge status={ws.status} size="sm" />
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">Progress</span>
                      <span className="text-xs font-semibold text-primary">{progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.8 }} className="h-full bg-primary rounded-full" />
                    </div>
                  </div>

                  {/* Materials */}
                  {ws.materials.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-medium text-gray-600 mb-1">Materials:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {ws.materials.map((m: any) => (
                          <span key={m.materialId} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{m.materialName} ({m.allocatedQty}/{m.requiredQty} {m.unit})</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Advance Action */}
                  <div className="pt-3 border-t border-gray-100 flex justify-end">
                    <Button onClick={() => handleAdvanceStatus(ws.id, ws.status)} className="text-xs bg-primary hover:bg-primary/80 text-white gap-1 cursor-pointer" size="sm">
                      Advance <ChevronRight className="w-3 h-3" />
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Approved Designs Awaiting Production */}
      {approvedDesigns.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wider">Approved — Awaiting Production ({approvedDesigns.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {approvedDesigns.map((d: any) => (
              <div key={d.id} className="bg-emerald-50/50 rounded-xl border border-emerald-100 p-4 flex items-center gap-3">
                <Factory className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-secondary text-sm truncate">{d.name}</h3>
                  <p className="text-xs text-gray-500">{d.branchName}</p>
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
