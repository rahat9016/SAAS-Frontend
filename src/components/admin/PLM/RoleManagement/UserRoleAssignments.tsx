"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/src/lib/redux/hooks";
import {
  assignRoleToUser,
  updateUserAssignment,
  revokeUserAssignment,
  IUserRoleAssignment,
} from "@/src/lib/redux/features/plm/plmRoleSlice";
import { PlmRole } from "@/src/types/plm/productLifecycleTypes";
import { PLM_ROLE_LABELS, PLM_ROLE_COLORS } from "@/src/constants/plm/plmConstants";
import { motion } from "framer-motion";
import {
  UserPlus,
  Trash2,
  Pencil,
  MapPin,
  Shield,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { format } from "date-fns";
import DeleteConfirmDialog from "@/src/components/shared/DeleteConfirmDialog";

const ALL_PLM_ROLES: PlmRole[] = [
  "SUPER_ADMIN",
  "BRANCH_MODERATOR",
  "DESIGN_TEAM",
  "PRODUCTION_TEAM",
  "INVENTORY_TEAM",
];

interface AssignmentFormData {
  userId: string;
  userName: string;
  userEmail: string;
  plmRoles: PlmRole[];
  branchId: string | null;
  branchName: string | null;
}

const EMPTY_FORM: AssignmentFormData = {
  userId: "",
  userName: "",
  userEmail: "",
  plmRoles: [],
  branchId: null,
  branchName: null,
};

export default function UserRoleAssignments() {
  const dispatch = useAppDispatch();
  const assignments = useAppSelector((state) => state.plmRoles.userAssignments);
  const branches = useAppSelector((state) => state.plm.branches);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AssignmentFormData>(EMPTY_FORM);
  const [revokeId, setRevokeId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setErrors({});
    setShowForm(true);
  };

  const openEdit = (a: IUserRoleAssignment) => {
    setForm({
      userId: a.userId,
      userName: a.userName,
      userEmail: a.userEmail,
      plmRoles: [...a.plmRoles],
      branchId: a.branchId,
      branchName: a.branchName,
    });
    setEditingId(a.id);
    setErrors({});
    setShowForm(true);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.userName.trim()) errs.userName = "Name is required";
    if (!form.userEmail.trim() || !form.userEmail.includes("@"))
      errs.userEmail = "Valid email is required";
    if (form.plmRoles.length === 0) errs.plmRoles = "Select at least one role";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    if (editingId) {
      dispatch(
        updateUserAssignment({
          assignmentId: editingId,
          plmRoles: form.plmRoles,
          branchId: form.branchId,
          branchName: form.branchName,
        })
      );
    } else {
      dispatch(
        assignRoleToUser({
          userId: form.userId || `user-${Date.now()}`,
          userName: form.userName,
          userEmail: form.userEmail,
          plmRoles: form.plmRoles,
          branchId: form.branchId,
          branchName: form.branchName,
          assignedBy: "Super Admin",
        })
      );
    }

    setShowForm(false);
    setEditingId(null);
  };

  const toggleRole = (role: PlmRole) => {
    if (form.plmRoles.includes(role)) {
      setForm((f) => ({ ...f, plmRoles: f.plmRoles.filter((r) => r !== role) }));
    } else {
      setForm((f) => ({ ...f, plmRoles: [...f.plmRoles, role] }));
    }
  };

  const handleBranchChange = (branchId: string) => {
    const branch = branches.find((b) => b.id === branchId);
    setForm((f) => ({
      ...f,
      branchId: branchId || null,
      branchName: branch?.name ?? null,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-secondary">User Assignments</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Assign PLM roles to users and define their branch scope
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="bg-primary hover:bg-primary/80 text-white text-sm gap-1.5 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          Assign Role
        </Button>
      </div>

      {/* Inline Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-primary/20 rounded-xl p-5 shadow-sm"
        >
          <h3 className="text-sm font-bold text-gray-800 mb-4">
            {editingId ? "Edit Assignment" : "Assign PLM Role to User"}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                value={form.userName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, userName: e.target.value }))
                }
                disabled={!!editingId}
                placeholder="e.g. Kamal Hossain"
                className={`w-full text-sm px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:bg-gray-50 ${
                  errors.userName ? "border-red-300" : "border-gray-200"
                }`}
              />
              {errors.userName && (
                <p className="text-xs text-red-500 mt-1">{errors.userName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                value={form.userEmail}
                onChange={(e) =>
                  setForm((f) => ({ ...f, userEmail: e.target.value }))
                }
                disabled={!!editingId}
                placeholder="user@example.com"
                type="email"
                className={`w-full text-sm px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:bg-gray-50 ${
                  errors.userEmail ? "border-red-300" : "border-gray-200"
                }`}
              />
              {errors.userEmail && (
                <p className="text-xs text-red-500 mt-1">{errors.userEmail}</p>
              )}
            </div>

            {/* Branch */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Branch (ABAC Scope)
              </label>
              <select
                value={form.branchId || ""}
                onChange={(e) => handleBranchChange(e.target.value)}
                className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
              >
                <option value="">No branch (Super Admin)</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-gray-400 mt-1">
                Branch-scoped users only see data from their assigned branch
              </p>
            </div>
          </div>

          {/* Role selection */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-600 mb-2">
              PLM Roles <span className="text-red-500">*</span>{" "}
              <span className="font-normal text-gray-400">(select one or more)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {ALL_PLM_ROLES.map((role) => {
                const isSelected = form.plmRoles.includes(role);
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => toggleRole(role)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      isSelected
                        ? `${PLM_ROLE_COLORS[role]} text-white border-transparent`
                        : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    <Shield className="w-3 h-3" />
                    {PLM_ROLE_LABELS[role]}
                  </button>
                );
              })}
            </div>
            {errors.plmRoles && (
              <p className="text-xs text-red-500 mt-1">{errors.plmRoles}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowForm(false)}
              className="text-sm cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-primary hover:bg-primary/80 text-white text-sm gap-1.5 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              {editingId ? "Update Assignment" : "Assign Role"}
            </Button>
          </div>
        </motion.div>
      )}

      {/* Assignment Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-700">
            {assignments.length} User{assignments.length !== 1 ? "s" : ""} Assigned
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">
                  User
                </th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-3">
                  Roles
                </th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-3">
                  Branch (ABAC)
                </th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-3">
                  Assigned
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {assignments.map((a, index) => (
                <motion.tr
                  key={a.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-5 py-3">
                    <p className="font-semibold text-gray-800">{a.userName}</p>
                    <p className="text-xs text-gray-400">{a.userEmail}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {a.plmRoles.map((role) => (
                        <span
                          key={role}
                          className={`text-[10px] font-bold text-white px-2 py-0.5 rounded-full ${PLM_ROLE_COLORS[role]}`}
                        >
                          {PLM_ROLE_LABELS[role]}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {a.branchName ? (
                      <span className="flex items-center gap-1 text-xs text-gray-600">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        {a.branchName}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">All branches</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs text-gray-400">
                      {format(new Date(a.assignedAt), "MMM d, yyyy")}
                    </p>
                    <p className="text-[10px] text-gray-300">by {a.assignedBy}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button
                        onClick={() => openEdit(a)}
                        className="p-1.5 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5 text-blue-400" />
                      </button>
                      <button
                        onClick={() => setRevokeId(a.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <DeleteConfirmDialog
        isOpen={!!revokeId}
        onClose={() => setRevokeId(null)}
        onConfirm={() => {
          if (revokeId) dispatch(revokeUserAssignment(revokeId));
          setRevokeId(null);
        }}
        title="Revoke Assignment"
        description="This will remove the user's PLM roles. They will immediately lose access on next login."
      />
    </div>
  );
}
