"use client";

import { useState } from "react";
import { useGet } from "@/src/hooks/useGet";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  GitBranch,
  ChevronDown,
  ChevronUp,
  Users,
  Shield,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { format } from "date-fns";
import BranchFormModal from "./BranchFormModal";
import ResourcePermissionMatrix from "../shared/ResourcePermissionMatrix";
import { scopeToMap, type RbacBranch } from "@/src/types/rbac/rbac";

export default function BranchRbacManager() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data, isLoading, refetch } = useGet<RbacBranch[]>(
    "/api/super-admin/branches",
    ["rbac-branches"],
  );
  const branches = data?.data ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-secondary">Branches & Scope</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Create branches and define the permission scope they may grant
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary/80 text-white text-sm gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create Branch
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Branches", value: branches.length, color: "text-blue-600", bg: "bg-blue-50" },
          {
            label: "Total Users",
            value: branches.reduce((s, b) => s + (b._count?.users ?? 0), 0),
            color: "text-primary",
            bg: "bg-primary/5",
          },
          {
            label: "Total Roles",
            value: branches.reduce((s, b) => s + (b._count?.roles ?? 0), 0),
            color: "text-gray-600",
            bg: "bg-gray-50",
          },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4 text-center`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* List */}
      {isLoading ? (
        <p className="text-sm text-gray-400 py-8 text-center">Loading…</p>
      ) : branches.length === 0 ? (
        <p className="text-sm text-gray-400 py-8 text-center">
          No branches yet. Create one to get started.
        </p>
      ) : (
        <div className="space-y-3">
          {branches.map((branch, i) => (
            <motion.div
              key={branch.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-white border border-gray-100 rounded-xl overflow-hidden"
            >
              <div className="flex items-center gap-3 px-5 py-4">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <GitBranch className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-gray-900 truncate">
                      {branch.name}
                    </h3>
                    <span className="text-[9px] font-bold bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">
                      {branch.code}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 truncate mt-0.5">
                    {branch.organization?.name ?? "—"}
                    {branch.location ? ` · ${branch.location}` : ""}
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-full text-xs font-semibold text-gray-600">
                    <Users className="w-3 h-3 text-gray-400" />
                    {branch._count?.users ?? 0}
                  </span>
                  <span className="flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-full text-xs font-semibold text-gray-600">
                    <Shield className="w-3 h-3 text-gray-400" />
                    {branch.branchPermissions.length} res
                  </span>
                  <button
                    onClick={() =>
                      setExpandedId(expandedId === branch.id ? null : branch.id)
                    }
                    className="p-1.5 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    {expandedId === branch.id ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {expandedId === branch.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden border-t border-gray-100"
                  >
                    <div className="p-5 bg-gray-50/50">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Permission Scope
                        </p>
                        <p className="text-[10px] text-gray-400">
                          Created {format(new Date(branch.createdAt), "MMM d, yyyy")}
                        </p>
                      </div>
                      <ResourcePermissionMatrix
                        selected={scopeToMap(branch.branchPermissions)}
                        onChange={() => {}}
                        scope={scopeToMap(branch.branchPermissions)}
                        readOnly
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}

      <BranchFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={() => refetch()}
      />
    </div>
  );
}
