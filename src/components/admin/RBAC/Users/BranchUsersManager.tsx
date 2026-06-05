"use client";

import { useState } from "react";
import { useGet } from "@/src/hooks/useGet";
import { useAppSelector } from "@/src/lib/redux/hooks";
import { selectRbacUser } from "@/src/lib/redux/features/rbac/rbacSelectors";
import { motion } from "framer-motion";
import { Plus, UserPlus, Mail, Shield } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { format } from "date-fns";
import BranchUserFormModal from "./BranchUserFormModal";
import { type RbacBranch, type RbacBranchUser } from "@/src/types/rbac/rbac";

const stripPrefix = (name: string) => name.replace(/^[^-]+ - /, "");

export default function BranchUsersManager() {
  const user = useAppSelector(selectRbacUser);
  const isSuperAdmin = user.role === "SUPER_ADMIN";

  const [selectedBranchId, setSelectedBranchId] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: branchData } = useGet<RbacBranch[]>(
    "/api/super-admin/branches",
    ["rbac-branches"],
    undefined,
    { enabled: isSuperAdmin },
  );
  const branches = branchData?.data ?? [];
  const activeBranchId = isSuperAdmin ? selectedBranchId : user.branchId ?? "";

  const { data: usersData, isLoading, refetch } = useGet<RbacBranchUser[]>(
    "/api/branches/users",
    ["rbac-users"],
    isSuperAdmin ? { branchId: selectedBranchId } : undefined,
    { enabled: !isSuperAdmin || !!selectedBranchId },
  );
  const users = usersData?.data ?? [];
  const canManage = !isSuperAdmin || !!selectedBranchId;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-secondary">Branch Users</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Create users and assign them a dynamic role
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isSuperAdmin && (
            <select
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
              className="text-sm px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Select branch…</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.code})
                </option>
              ))}
            </select>
          )}
          <Button
            onClick={() => setIsModalOpen(true)}
            disabled={!canManage}
            className="bg-primary hover:bg-primary/80 text-white text-sm gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            Add User
          </Button>
        </div>
      </div>

      {!canManage ? (
        <p className="text-sm text-gray-400 py-8 text-center">
          Select a branch to manage its users.
        </p>
      ) : isLoading ? (
        <p className="text-sm text-gray-400 py-8 text-center">Loading…</p>
      ) : users.length === 0 ? (
        <p className="text-sm text-gray-400 py-8 text-center">
          No users yet.
        </p>
      ) : (
        <div className="space-y-2">
          {users.map((u, i) => (
            <motion.div
              key={u.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-white border border-gray-100 rounded-xl flex items-center gap-3 px-5 py-3.5"
            >
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <UserPlus className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-gray-900 truncate">
                  {u.name || u.email}
                </h3>
                <p className="text-xs text-gray-400 truncate flex items-center gap-1 mt-0.5">
                  <Mail className="w-3 h-3" />
                  {u.email}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="flex items-center gap-1 bg-primary/5 text-primary px-2.5 py-1 rounded-full text-xs font-semibold">
                  <Shield className="w-3 h-3" />
                  {u.role ? stripPrefix(u.role.name) : "No role"}
                </span>
                <span className="text-[10px] text-gray-400">
                  {format(new Date(u.createdAt), "MMM d, yyyy")}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <BranchUserFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={() => refetch()}
        branchId={activeBranchId}
        isSuperAdmin={isSuperAdmin}
      />
    </div>
  );
}
