"use client";

import { useMemo, useState } from "react";
import { useGet } from "@/src/hooks/useGet";
import { useDelete } from "@/src/hooks/useDelete";
import { useAppSelector } from "@/src/lib/redux/hooks";
import {
  selectRbac,
  selectRbacUser,
} from "@/src/lib/redux/features/rbac/rbacSelectors";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Shield,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  Users,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { toast } from "react-toastify";
import { ACTIONS, type Action } from "@/src/config/rbac";
import BranchRoleFormModal from "./BranchRoleFormModal";
import ResourcePermissionMatrix, {
  type SelectedGrants,
} from "../shared/ResourcePermissionMatrix";
import DeleteConfirmDialog from "@/src/components/shared/DeleteConfirmDialog";
import {
  scopeToMap,
  type RbacBranch,
  type RbacRole,
} from "@/src/types/rbac/rbac";
import type { PermissionMap } from "@/src/config/rbac";

const stripPrefix = (name: string) => name.replace(/^[^-]+ - /, "");

/** Effective permission map → matrix grants (actions that are true). */
function mapToGrants(map: PermissionMap): SelectedGrants {
  const out: SelectedGrants = {};
  for (const [resource, actions] of Object.entries(map)) {
    const on = ACTIONS.filter((a) => actions[a as Action]);
    if (on.length) out[resource] = on as Action[];
  }
  return out;
}

export default function BranchRolesManager() {
  const user = useAppSelector(selectRbacUser);
  const rbac = useAppSelector(selectRbac);
  const isSuperAdmin = user.role === "SUPER_ADMIN";

  const [selectedBranchId, setSelectedBranchId] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RbacRole | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Super Admin picks a branch; Branch Admin is fixed to their own.
  const { data: branchData } = useGet<RbacBranch[]>(
    "/api/super-admin/branches",
    ["rbac-branches"],
    undefined,
    { enabled: isSuperAdmin },
  );
  const branches = useMemo(() => branchData?.data ?? [], [branchData]);
  const activeBranchId = isSuperAdmin ? selectedBranchId : user.branchId ?? "";

  // Scope ceiling for the matrix.
  const scope: SelectedGrants = useMemo(() => {
    if (isSuperAdmin) {
      const b = branches.find((x) => x.id === selectedBranchId);
      return b ? scopeToMap(b.branchPermissions) : {};
    }
    return mapToGrants(rbac.permissions);
  }, [isSuperAdmin, branches, selectedBranchId, rbac.permissions]);

  const { data: rolesData, isLoading, refetch } = useGet<RbacRole[]>(
    "/api/branches/roles",
    ["rbac-roles"],
    isSuperAdmin ? { branchId: selectedBranchId } : undefined,
    { enabled: !isSuperAdmin || !!selectedBranchId },
  );
  const roles = rolesData?.data ?? [];

  const { mutate: deleteMutate } = useDelete(() => {
    toast.success("Role deleted");
    setDeleteId(null);
    refetch();
  }, [["rbac-roles"]]);

  const canManage = !isSuperAdmin || !!selectedBranchId;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-secondary">Branch Roles</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Reusable roles, scoped to what the branch is allowed to grant
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
            onClick={() => {
              setEditingRole(null);
              setIsModalOpen(true);
            }}
            disabled={!canManage}
            className="bg-primary hover:bg-primary/80 text-white text-sm gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            Create Role
          </Button>
        </div>
      </div>

      {!canManage ? (
        <p className="text-sm text-gray-400 py-8 text-center">
          Select a branch to manage its roles.
        </p>
      ) : isLoading ? (
        <p className="text-sm text-gray-400 py-8 text-center">Loading…</p>
      ) : roles.length === 0 ? (
        <p className="text-sm text-gray-400 py-8 text-center">
          No roles yet. Create one to assign to users.
        </p>
      ) : (
        <div className="space-y-3">
          {roles.map((role, i) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-white border border-gray-100 rounded-xl overflow-hidden"
            >
              <div className="flex items-center gap-3 px-5 py-4">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-gray-900 truncate">
                    {stripPrefix(role.name)}
                  </h3>
                  <p className="text-xs text-gray-400 truncate mt-0.5">
                    {role.resourcePermissions.length} resource(s)
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-full text-xs font-semibold text-gray-600">
                    <Users className="w-3 h-3 text-gray-400" />
                    {role._count?.directUsers ?? 0}
                  </span>
                  <button
                    onClick={() =>
                      setExpandedId(expandedId === role.id ? null : role.id)
                    }
                    className="p-1.5 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    {expandedId === role.id ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setEditingRole(role);
                      setIsModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
                  >
                    <Pencil className="w-4 h-4 text-blue-400" />
                  </button>
                  <button
                    onClick={() => setDeleteId(role.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {expandedId === role.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden border-t border-gray-100"
                  >
                    <div className="p-5 bg-gray-50/50">
                      <ResourcePermissionMatrix
                        selected={scopeToMap(role.resourcePermissions)}
                        onChange={() => {}}
                        scope={scopeToMap(role.resourcePermissions)}
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

      <BranchRoleFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingRole(null);
        }}
        onSaved={() => refetch()}
        editingRole={editingRole}
        scope={scope}
        branchId={isSuperAdmin ? activeBranchId : undefined}
      />

      <DeleteConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutate({ url: `/api/branches/roles/${deleteId}` })}
        title="Delete Role"
        description="This permanently removes the role. Assigned users keep their account but lose this role."
      />
    </div>
  );
}
