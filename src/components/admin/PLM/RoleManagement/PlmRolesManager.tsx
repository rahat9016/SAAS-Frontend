"use client";

import { useState } from "react";
import { useGet } from "@/src/hooks/useGet";
import { usePost } from "@/src/hooks/usePost";
import { usePatch } from "@/src/hooks/usePatch";
import { useDelete } from "@/src/hooks/useDelete";
import { PlmPermission } from "@/src/types/plm/plmPermissions";
import RoleFormModal from "./RoleFormModal";
import RolePermissionMatrix from "./RolePermissionMatrix";
import DeleteConfirmDialog from "@/src/components/shared/DeleteConfirmDialog";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Shield,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  Lock,
  Check,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { format } from "date-fns";
import { toast } from "react-toastify";

export default function PlmRolesManager() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<any | null>(null);
  const [deleteRoleId, setDeleteRoleId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Query roles from the Next.js API
  const { data: rolesData, isLoading } = useGet<any>("/api/plm/role", ["customRoles"]);
  const roles = rolesData?.data || [];

  // React Query post mutation for creating role
  const { mutate: createMutate } = usePost(
    "/api/plm/role",
    () => {
      toast.success("Role created successfully!");
      setIsModalOpen(false);
    },
    [["customRoles"]]
  );

  const handleCreate = (data: {
    name: string;
    description: string;
    permissions: PlmPermission[];
  }) => {
    createMutate({
      name: data.name,
      description: data.description,
      permissionKeys: data.permissions,
    });
  };

  // React Query patch mutation for updating role
  const { mutate: patchMutate } = usePatch(
    () => {
      toast.success("Role updated successfully!");
      setIsModalOpen(false);
      setEditingRole(null);
    },
    [["customRoles"]]
  );

  const handleUpdate = (data: {
    name: string;
    description: string;
    permissions: PlmPermission[];
  }) => {
    if (!editingRole) return;
    patchMutate({
      url: `/api/plm/role/${editingRole.id}`,
      data: {
        name: data.name,
        description: data.description,
        permissionKeys: data.permissions,
      },
    });
  };

  // React Query delete mutation for deleting role
  const { mutate: deleteMutate } = useDelete(() => {
    toast.success("Role deleted successfully!");
    setDeleteRoleId(null);
  }, [["customRoles"]]);

  const handleDelete = () => {
    if (!deleteRoleId) return;
    deleteMutate({ url: `/api/plm/role/${deleteRoleId}` });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-secondary">PLM Roles</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage PLM roles and their permission sets
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingRole(null);
            setIsModalOpen(true);
          }}
          className="bg-primary hover:bg-primary/80 text-white text-sm gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create Role
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Total Roles",
            value: roles.length,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Built-in",
            value: roles.filter((r: any) => r.isBuiltIn).length,
            color: "text-gray-600",
            bg: "bg-gray-50",
          },
          {
            label: "Custom",
            value: roles.filter((r: any) => !r.isBuiltIn).length,
            color: "text-primary",
            bg: "bg-primary/5",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`${stat.bg} rounded-xl p-4 text-center`}
          >
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Role Cards */}
      <div className="space-y-3">
        {roles.map((role: any, index: number) => (
          <motion.div
            key={role.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            className="bg-white border border-gray-100 rounded-xl overflow-hidden"
          >
            {/* Card Header */}
            <div className="flex items-center gap-3 px-5 py-4">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  role.isBuiltIn ? "bg-gray-100" : "bg-primary/10"
                }`}
              >
                {role.isBuiltIn ? (
                  <Lock className="w-4 h-4 text-gray-400" />
                ) : (
                  <Shield className="w-4 h-4 text-primary" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-gray-900 truncate">
                    {role.name}
                  </h3>
                  {role.isBuiltIn && (
                    <span className="text-[9px] font-bold bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full uppercase">
                      Built-in
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 truncate mt-0.5">
                  {role.description || "No description"}
                </p>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                {/* Permission count badge */}
                <div className="flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-full">
                  <Check className="w-3 h-3 text-gray-400" />
                  <span className="text-xs font-semibold text-gray-600">
                    {role.permissions.length} perms
                  </span>
                </div>

                {/* Expand toggle */}
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

                {/* Edit / Delete — only for custom roles */}
                {!role.isBuiltIn && (
                  <>
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
                      onClick={() => setDeleteRoleId(role.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Expanded: Permission Matrix */}
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
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Permission Matrix
                      </p>
                      <p className="text-[10px] text-gray-400">
                        Created{" "}
                        {format(new Date(role.createdAt), "MMM d, yyyy")} ·{" "}
                        {role.createdBy}
                      </p>
                    </div>
                    <RolePermissionMatrix
                      selected={role.permissions}
                      onChange={() => {}}
                      readOnly
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Create / Edit Modal */}
      <RoleFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingRole(null);
        }}
        onSave={editingRole ? handleUpdate : handleCreate}
        editingRole={editingRole}
      />

      {/* Delete Confirm */}
      <DeleteConfirmDialog
        isOpen={!!deleteRoleId}
        onClose={() => setDeleteRoleId(null)}
        onConfirm={handleDelete}
        title="Delete Role"
        description="This will permanently remove this custom role. Users assigned to it will lose the associated permissions."
      />
    </div>
  );
}
