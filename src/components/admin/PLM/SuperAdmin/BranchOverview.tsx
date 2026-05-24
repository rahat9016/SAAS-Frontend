"use client";

import { useMemo, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/src/lib/redux/hooks";
import { addBranch, deleteBranch } from "@/src/lib/redux/features/plm/plmSlice";
import { ProductStatus, IBranch } from "@/src/types/plm/productLifecycleTypes";
import { PRODUCT_STATUS_LABELS } from "@/src/constants/plm/plmConstants";
import RoleSwitcher from "../shared/RoleSwitcher";
import DeleteConfirmDialog from "@/src/components/shared/DeleteConfirmDialog";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";

export default function BranchOverview() {
  const dispatch = useAppDispatch();
  const branches = useAppSelector((state) => state.plm.branches);
  const designs = useAppSelector((state) => state.plm.designs);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", code: "", location: "" });

  const branchData = useMemo(() => {
    return branches.map((branch) => {
      const branchDesigns = designs.filter((d) => d.branchId === branch.id);
      const statusCounts = Object.values(ProductStatus).reduce((acc, s) => {
        const count = branchDesigns.filter((d) => d.status === s).length;
        if (count > 0) acc.push({ status: s, count });
        return acc;
      }, [] as { status: ProductStatus; count: number }[]);
      return { ...branch, totalDesigns: branchDesigns.length, statusCounts };
    });
  }, [branches, designs]);

  const handleCreate = () => {
    if (!form.name.trim() || !form.code.trim()) {
      toast.error("Branch name and code are required");
      return;
    }
    const newBranch: IBranch = {
      id: `branch-${Date.now()}`,
      name: form.name.trim(),
      code: form.code.trim().toUpperCase(),
      location: form.location.trim(),
      isActive: true,
    };
    dispatch(addBranch(newBranch));
    toast.success(`Branch "${newBranch.name}" created!`);
    setForm({ name: "", code: "", location: "" });
    setShowForm(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      const branch = branches.find((b) => b.id === deleteId);
      dispatch(deleteBranch(deleteId));
      toast.success(`Branch "${branch?.name}" deleted`);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="w-full sm:w-64">
          <RoleSwitcher />
        </div>
        <h1 className="text-xl font-bold text-secondary flex-1">
          Branch Management
        </h1>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary hover:bg-primary/80 text-white text-xs gap-1 cursor-pointer"
          size="sm"
        >
          {showForm ? (
            <X className="w-3.5 h-3.5" />
          ) : (
            <Plus className="w-3.5 h-3.5" />
          )}
          {showForm ? "Cancel" : "Create Branch"}
        </Button>
      </div>

      {/* Create Branch Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">
                New Branch
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs text-gray-600 mb-1 block">
                    Branch Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    placeholder="e.g. Rajshahi Branch"
                    className="h-10"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600 mb-1 block">
                    Branch Code <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={form.code}
                    onChange={(e) =>
                      setForm({ ...form, code: e.target.value })
                    }
                    placeholder="e.g. RAJ-01"
                    className="h-10"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600 mb-1 block">
                    Location
                  </Label>
                  <Input
                    value={form.location}
                    onChange={(e) =>
                      setForm({ ...form, location: e.target.value })
                    }
                    placeholder="e.g. Shaheb Bazar, Rajshahi"
                    className="h-10"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button
                  onClick={handleCreate}
                  className="bg-primary hover:bg-primary/80 text-white text-xs cursor-pointer"
                  size="sm"
                >
                  Save Branch
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Branch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {branchData.map((branch, i) => (
          <motion.div
            key={branch.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow relative group"
          >
            {/* Delete Button */}
            <Button
              onClick={() => setDeleteId(branch.id)}
              className="absolute top-3 right-3 w-7! h-7 bg-red-50 hover:bg-red-100 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              size="sm"
            >
              <Trash2 className="w-3 h-3 text-red-500" />
            </Button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-secondary">{branch.name}</h3>
                <p className="text-xs text-gray-500">
                  {branch.location} • {branch.code}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold text-gray-900">
                {branch.totalDesigns}
              </span>
              <span className="text-sm text-gray-500">total designs</span>
            </div>
            {branch.statusCounts.length > 0 ? (
              <div className="space-y-1.5">
                {branch.statusCounts.map(({ status, count }) => (
                  <div
                    key={status}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="text-gray-500">
                      {PRODUCT_STATUS_LABELS[status]}
                    </span>
                    <span className="font-semibold text-gray-700">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400">No designs yet</p>
            )}
          </motion.div>
        ))}
      </div>

      <DeleteConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Branch"
        description="Are you sure? All designs associated with this branch will remain but won't have a valid branch reference."
      />
    </div>
  );
}
