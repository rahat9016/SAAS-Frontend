"use client";

import { useMemo } from "react";
import { useAppSelector } from "@/src/lib/redux/hooks";
import { ProductStatus } from "@/src/types/plm/productLifecycleTypes";
import PLMStatsCards from "../shared/PLMStatsCards";
import RoleSwitcher from "../shared/RoleSwitcher";
import StatusBadge from "../shared/StatusBadge";
import { Palette, CheckCircle2, Factory, ShoppingBag, AlertTriangle, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function PLMDashboard() {
  const designs = useAppSelector((state) => state.plm.designs);
  const worksheets = useAppSelector((state) => state.plm.worksheets);
  const rawMaterials = useAppSelector((state) => state.plm.rawMaterials);

  const stats = useMemo(() => {
    const totalDesigns = designs.length;
    const pendingReview = designs.filter((d) => [ProductStatus.DESIGN_SUBMITTED, ProductStatus.MODERATOR_REVIEW, ProductStatus.SUPER_ADMIN_REVIEW].includes(d.status)).length;
    const inProduction = designs.filter((d) => [ProductStatus.IN_PRODUCTION, ProductStatus.READY_FOR_PRODUCTION, ProductStatus.PRODUCTION_WORKSHEET_CREATED].includes(d.status)).length;
    const liveProducts = designs.filter((d) => d.status === ProductStatus.LIVE_FOR_SALE).length;
    const lowStockMaterials = rawMaterials.filter((m) => m.availableStock <= m.reorderLevel).length;

    return {
      cards: [
        { label: "Total Designs", value: totalDesigns, change: "+12%", isPositive: true, icon: Palette, gradient: "from-violet-500 to-purple-600" },
        { label: "Pending Review", value: pendingReview, change: "-5%", isPositive: false, icon: Clock, gradient: "from-amber-500 to-orange-600" },
        { label: "In Production", value: inProduction, change: "+8%", isPositive: true, icon: Factory, gradient: "from-blue-500 to-cyan-600" },
        { label: "Live Products", value: liveProducts, change: "+23%", isPositive: true, icon: ShoppingBag, gradient: "from-emerald-500 to-green-600" },
      ],
      lowStockMaterials,
    };
  }, [designs, rawMaterials]);

  // Pipeline breakdown
  const pipeline = useMemo(() => {
    const statusGroups: { status: ProductStatus; count: number }[] = Object.values(ProductStatus).map((s) => ({
      status: s,
      count: designs.filter((d) => d.status === s).length,
    })).filter((g) => g.count > 0);
    return statusGroups;
  }, [designs]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="w-full sm:w-64"><RoleSwitcher /></div>
        <h1 className="text-xl font-bold text-secondary">PLM Dashboard</h1>
      </div>

      <PLMStatsCards stats={stats.cards} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Design Pipeline</h2>
          <div className="space-y-2">
            {pipeline.map((item) => {
              const maxCount = Math.max(...pipeline.map((p) => p.count), 1);
              const width = (item.count / maxCount) * 100;
              return (
                <div key={item.status} className="flex items-center gap-3">
                  <div className="w-36 flex-shrink-0"><StatusBadge status={item.status} size="sm" /></div>
                  <div className="flex-1 h-6 bg-gray-50 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${width}%` }} transition={{ duration: 0.6, ease: "easeOut" }} className="h-full bg-primary/20 rounded-full flex items-center justify-end pr-2">
                      <span className="text-[10px] font-bold text-primary">{item.count}</span>
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Alerts */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Alerts & Notifications</h2>
          <div className="space-y-3">
            {stats.lowStockMaterials > 0 && (
              <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-amber-800">{stats.lowStockMaterials} material(s) below reorder level</p>
                  <p className="text-xs text-amber-600 mt-0.5">Check inventory for restocking</p>
                </div>
              </div>
            )}
            {designs.filter((d) => d.status === ProductStatus.SUPER_ADMIN_REVIEW).length > 0 && (
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-800">{designs.filter((d) => d.status === ProductStatus.SUPER_ADMIN_REVIEW).length} design(s) awaiting your approval</p>
                  <p className="text-xs text-blue-600 mt-0.5">Review and make decisions</p>
                </div>
              </div>
            )}
            {worksheets.filter((w) => w.status === ProductStatus.QUALITY_CHECK).length > 0 && (
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                <Factory className="w-5 h-5 text-purple-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-purple-800">{worksheets.filter((w) => w.status === ProductStatus.QUALITY_CHECK).length} product(s) in quality check</p>
                  <p className="text-xs text-purple-600 mt-0.5">Ready for final inspection</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
