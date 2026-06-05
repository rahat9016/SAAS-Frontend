"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, GitBranch, Save } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useGet } from "@/src/hooks/useGet";
import { usePost } from "@/src/hooks/usePost";
import { toast } from "react-toastify";
import ResourcePermissionMatrix, {
  type SelectedGrants,
} from "../shared/ResourcePermissionMatrix";
import { mapToScope, type RbacOrganization } from "@/src/types/rbac/rbac";

interface BranchFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function BranchFormModal({
  isOpen,
  onClose,
  onCreated,
}: BranchFormModalProps) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [location, setLocation] = useState("");
  const [organizationId, setOrganizationId] = useState("");
  const [grants, setGrants] = useState<SelectedGrants>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: orgData } = useGet<RbacOrganization[]>(
    "/api/super-admin/organizations",
    ["rbac-orgs"],
    undefined,
    { enabled: isOpen },
  );
  const orgs = orgData?.data ?? [];

  useEffect(() => {
    if (isOpen) {
      setName("");
      setCode("");
      setLocation("");
      setOrganizationId("");
      setGrants({});
      setErrors({});
    }
  }, [isOpen]);

  const { mutate, isPending } = usePost(
    "/api/super-admin/branches",
    () => {
      toast.success("Branch created");
      onCreated();
      onClose();
    },
    [["rbac-branches"]],
  );

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required";
    if (!code.trim()) e.code = "Code is required";
    if (!organizationId) e.organizationId = "Select an organization";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    mutate({
      name: name.trim(),
      code: code.trim(),
      location: location.trim(),
      organizationId,
      permissions: mapToScope(grants),
    });
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
              {/* Header */}
              <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <GitBranch className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">
                    Create Branch
                  </h2>
                  <p className="text-xs text-gray-400">
                    Define a branch and the permission scope it may grant
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Dhaka Main"
                      className={`w-full text-sm px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                        errors.name ? "border-red-300" : "border-gray-200"
                      }`}
                    />
                    {errors.name && (
                      <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      placeholder="e.g. DHK-01"
                      className={`w-full text-sm px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                        errors.code ? "border-red-300" : "border-gray-200"
                      }`}
                    />
                    {errors.code && (
                      <p className="text-xs text-red-500 mt-1">{errors.code}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Location
                    </label>
                    <input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="City, Country"
                      className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Organization <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={organizationId}
                      onChange={(e) => setOrganizationId(e.target.value)}
                      className={`w-full text-sm px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                        errors.organizationId ? "border-red-300" : "border-gray-200"
                      }`}
                    >
                      <option value="">Select organization…</option>
                      {orgs.map((o) => (
                        <option key={o.id} value={o.id}>
                          {o.name} ({o.code})
                        </option>
                      ))}
                    </select>
                    {errors.organizationId && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.organizationId}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-2">
                    Permission Scope
                    <span className="font-normal text-gray-400">
                      {" "}
                      — the ceiling for every role created in this branch
                    </span>
                  </p>
                  <ResourcePermissionMatrix selected={grants} onChange={setGrants} />
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
                  disabled={isPending}
                  className="text-sm bg-primary hover:bg-primary/80 text-white cursor-pointer gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  Create Branch
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
