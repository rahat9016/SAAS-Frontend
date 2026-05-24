"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Shield, Save } from "lucide-react";
import { PlmPermission } from "@/src/types/plm/plmPermissions";
import { IPlmCustomRole } from "@/src/lib/redux/features/plm/plmRoleSlice";
import RolePermissionMatrix from "./RolePermissionMatrix";
import { Button } from "@/src/components/ui/button";

interface RoleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    name: string;
    description: string;
    permissions: PlmPermission[];
  }) => void;
  editingRole?: IPlmCustomRole | null;
}

export default function RoleFormModal({
  isOpen,
  onClose,
  onSave,
  editingRole,
}: RoleFormModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [permissions, setPermissions] = useState<PlmPermission[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingRole) {
      setName(editingRole.name);
      setDescription(editingRole.description);
      setPermissions([...editingRole.permissions]);
    } else {
      setName("");
      setDescription("");
      setPermissions([]);
    }
    setErrors({});
  }, [editingRole, isOpen]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Role name is required";
    if (name.trim().length < 3) errs.name = "Name must be at least 3 characters";
    if (permissions.length === 0) errs.permissions = "Select at least one permission";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({ name: name.trim(), description: description.trim(), permissions });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col pointer-events-auto">
              {/* Header */}
              <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">
                    {editingRole ? "Edit Role" : "Create New Role"}
                  </h2>
                  <p className="text-xs text-gray-400">
                    Define a PLM role with specific permissions
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="ml-auto p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              {/* Body */}
              <div className="overflow-y-auto flex-1 p-6 space-y-5">
                {/* Role Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Role Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Senior Moderator"
                    className={`w-full text-sm px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                      errors.name ? "border-red-300" : "border-gray-200"
                    }`}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of what this role can do..."
                    rows={2}
                    className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                  />
                </div>

                {/* Permission Matrix */}
                <div>
                  <RolePermissionMatrix
                    selected={permissions}
                    onChange={setPermissions}
                  />
                  {errors.permissions && (
                    <p className="text-xs text-red-500 mt-2">
                      {errors.permissions}
                    </p>
                  )}
                </div>
              </div>

              {/* Footer */}
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
