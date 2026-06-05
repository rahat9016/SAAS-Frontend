"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserPlus, Save } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useGet } from "@/src/hooks/useGet";
import { usePost } from "@/src/hooks/usePost";
import { toast } from "react-toastify";
import { type RbacRole } from "@/src/types/rbac/rbac";

interface BranchUserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
  /** Super Admin must target a branch; Branch Admin omits (own branch). */
  branchId?: string;
  isSuperAdmin: boolean;
}

const stripPrefix = (name: string) => name.replace(/^[^-]+ - /, "");

export default function BranchUserFormModal({
  isOpen,
  onClose,
  onCreated,
  branchId,
  isSuperAdmin,
}: BranchUserFormModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Existing dynamic roles to assign.
  const { data: rolesData } = useGet<RbacRole[]>(
    "/api/branches/roles",
    ["rbac-roles"],
    isSuperAdmin ? { branchId } : undefined,
    { enabled: isOpen && (!isSuperAdmin || !!branchId) },
  );
  const roles = rolesData?.data ?? [];

  useEffect(() => {
    if (isOpen) {
      setName("");
      setEmail("");
      setPassword("");
      setRoleId("");
      setErrors({});
    }
  }, [isOpen]);

  const { mutate, isPending } = usePost(
    "/api/branches/users",
    () => {
      toast.success("User created");
      onCreated();
      onClose();
    },
    [["rbac-users"]],
  );

  const validate = () => {
    const e: Record<string, string> = {};
    if (!email.trim()) e.email = "Email is required";
    if (!password.trim()) e.password = "Password is required";
    else if (password.length < 6) e.password = "Min 6 characters";
    if (!roleId) e.roleId = "Select a role";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    mutate({
      name: name.trim() || email.trim(),
      email: email.trim(),
      password,
      roleId,
      ...(isSuperAdmin && branchId ? { branchId } : {}),
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
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col pointer-events-auto">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <UserPlus className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">
                    Add Branch User
                  </h2>
                  <p className="text-xs text-gray-400">
                    Assign an existing role — permissions come from the role
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="ml-auto p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              <div className="overflow-y-auto flex-1 p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Full Name
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Jane Doe"
                    className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@company.com"
                    className={`w-full text-sm px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                      errors.email ? "border-red-300" : "border-gray-200"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full text-sm px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                      errors.password ? "border-red-300" : "border-gray-200"
                    }`}
                  />
                  {errors.password && (
                    <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={roleId}
                    onChange={(e) => setRoleId(e.target.value)}
                    className={`w-full text-sm px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                      errors.roleId ? "border-red-300" : "border-gray-200"
                    }`}
                  >
                    <option value="">Select role…</option>
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {stripPrefix(r.name)}
                      </option>
                    ))}
                  </select>
                  {errors.roleId && (
                    <p className="text-xs text-red-500 mt-1">{errors.roleId}</p>
                  )}
                  {roles.length === 0 && (
                    <p className="text-xs text-amber-500 mt-1">
                      No roles in this branch yet — create one first.
                    </p>
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
                  disabled={isPending}
                  className="text-sm bg-primary hover:bg-primary/80 text-white cursor-pointer gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  Create User
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
