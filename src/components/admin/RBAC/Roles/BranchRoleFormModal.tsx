"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Shield, Save } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { usePost } from "@/src/hooks/usePost";
import { usePatch } from "@/src/hooks/usePatch";
import { toast } from "react-toastify";
import ResourcePermissionMatrix, {
  type SelectedGrants,
} from "../shared/ResourcePermissionMatrix";
import {
  scopeToMap,
  mapToScope,
  type RbacRole,
} from "@/src/types/rbac/rbac";

interface BranchRoleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  editingRole: RbacRole | null;
  /** Branch scope ceiling (resource -> allowed actions). */
  scope: SelectedGrants;
  /** Required only for Super Admin creating into a chosen branch. */
  branchId?: string;
}

// Strip the "CODE - " namespace prefix the API adds to role names.
const stripPrefix = (name: string) => name.replace(/^[^-]+ - /, "");

export default function BranchRoleFormModal({
  isOpen,
  onClose,
  onSaved,
  editingRole,
  scope,
  branchId,
}: BranchRoleFormModalProps) {
  const [name, setName] = useState("");
  const [grants, setGrants] = useState<SelectedGrants>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isOpen) return;
    if (editingRole) {
      setName(stripPrefix(editingRole.name));
      setGrants(scopeToMap(editingRole.resourcePermissions));
    } else {
      setName("");
      setGrants({});
    }
    setErrors({});
  }, [isOpen, editingRole]);

  const createMut = usePost(
    "/api/branches/roles",
    () => {
      toast.success("Role created");
      onSaved();
      onClose();
    },
    [["rbac-roles"]],
  );

  const patchMut = usePatch(
    () => {
      toast.success("Role updated");
      onSaved();
      onClose();
    },
    [["rbac-roles"]],
  );

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Role name is required";
    if (Object.keys(grants).length === 0)
      e.grants = "Select at least one permission";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const permissions = mapToScope(grants);
    if (editingRole) {
      patchMut.mutate({
        url: `/api/branches/roles/${editingRole.id}`,
        data: { name: name.trim(), permissions },
      });
    } else {
      createMut.mutate({
        name: name.trim(),
        permissions,
        ...(branchId ? { branchId } : {}),
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col pointer-events-auto">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">
                    {editingRole ? "Edit Role" : "Create Role"}
                  </h2>
                  <p className="text-xs text-gray-400">
                    Permissions are limited to the branch&apos;s allowed scope
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="ml-auto p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              <div className="overflow-y-auto flex-1 p-6 space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Role Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Orders Manager"
                    className={`w-full text-sm px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                      errors.name ? "border-red-300" : "border-gray-200"
                    }`}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-2">
                    Permissions
                  </p>
                  <ResourcePermissionMatrix
                    selected={grants}
                    onChange={setGrants}
                    scope={scope}
                  />
                  {errors.grants && (
                    <p className="text-xs text-red-500 mt-2">{errors.grants}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="text-sm cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={createMut.isPending || patchMut.isPending}
                  className="text-sm bg-primary hover:bg-primary/80 text-white cursor-pointer gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  {editingRole ? "Update Role" : "Create Role"}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
