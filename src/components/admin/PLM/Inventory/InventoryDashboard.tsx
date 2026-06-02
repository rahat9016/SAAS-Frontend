"use client";

import { useMemo, useState } from "react";
import { useGet } from "@/src/hooks/useGet";
import { usePost } from "@/src/hooks/usePost";
import { useDelete } from "@/src/hooks/useDelete";
import RoleSwitcher from "../shared/RoleSwitcher";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Warehouse, AlertTriangle, Plus, Trash2, Package } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import DeleteConfirmDialog from "@/src/components/shared/DeleteConfirmDialog";
import { MATERIAL_CATEGORIES, MATERIAL_UNITS } from "@/src/constants/plm/plmConstants";

export default function InventoryDashboard() {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", sku: "", category: "fabric", unit: "m", totalStock: 0, reorderLevel: 0, unitCost: 0 });

  // Fetch raw materials from Next.js API
  const { data: materialsData, isLoading: isMaterialsLoading } = useGet<any>(
    "/api/plm/inventory/material",
    ["materials"]
  );
  const rawMaterials = materialsData?.data || [];

  // Fetch allocations from Next.js API
  const { data: allocationsData } = useGet<any>(
    "/api/plm/inventory/allocate",
    ["allocations"]
  );
  const allocations = allocationsData?.data || [];

  const lowStock = useMemo(() => rawMaterials.filter((m: any) => m.availableStock <= m.reorderLevel), [rawMaterials]);
  const totalValue = useMemo(() => rawMaterials.reduce((sum: number, m: any) => sum + m.totalStock * m.unitCost, 0), [rawMaterials]);

  // React Query post mutation for adding material
  const { mutate: createMutate } = usePost(
    "/api/plm/inventory/material",
    () => {
      toast.success("Material added!");
      setShowAddForm(false);
      setFormData({ name: "", sku: "", category: "fabric", unit: "m", totalStock: 0, reorderLevel: 0, unitCost: 0 });
    },
    [["materials"]]
  );

  const handleAdd = () => {
    if (!formData.name || !formData.sku) { toast.error("Name and SKU required"); return; }
    createMutate(formData);
  };

  // React Query delete mutation for deleting material
  const { mutate: deleteMutate } = useDelete(() => {
    toast.success("Material deleted");
    setDeleteId(null);
  }, [["materials"]]);

  const handleDelete = () => {
    if (deleteId) {
      deleteMutate({ url: `/api/plm/inventory/material/${deleteId}` });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="w-full sm:w-64"><RoleSwitcher /></div>
        <h1 className="text-xl font-bold text-secondary">Inventory Management</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-2 mb-2"><Package className="w-4 h-4 text-blue-500" /><span className="text-xs text-gray-500">Total Materials</span></div>
          <p className="text-2xl font-bold text-gray-900">{rawMaterials.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-2 mb-2"><Warehouse className="w-4 h-4 text-emerald-500" /><span className="text-xs text-gray-500">Total Value</span></div>
          <p className="text-2xl font-bold text-gray-900">৳{totalValue.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-2 mb-2"><AlertTriangle className="w-4 h-4 text-amber-500" /><span className="text-xs text-gray-500">Low Stock</span></div>
          <p className="text-2xl font-bold text-amber-600">{lowStock.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-2 mb-2"><Package className="w-4 h-4 text-purple-500" /><span className="text-xs text-gray-500">Allocations</span></div>
          <p className="text-2xl font-bold text-gray-900">{allocations.length}</p>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStock.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-amber-800 mb-2 flex items-center gap-1.5"><AlertTriangle className="w-4 h-4" /> Low Stock Alert</h3>
          <div className="flex flex-wrap gap-2">
            {lowStock.map((m: any) => (
              <span key={m.id} className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-md font-medium">{m.name}: {m.availableStock} {m.unit} left</span>
            ))}
          </div>
        </div>
      )}

      {/* Add Material */}
      <div className="flex justify-end">
        <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-primary hover:bg-primary/80 text-white text-xs gap-1 cursor-pointer" size="sm">
          <Plus className="w-3.5 h-3.5" /> Add Material
        </Button>
      </div>

      {showAddForm && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">New Raw Material</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label className="text-xs text-gray-600 mb-1 block">Name *</label><input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full h-10 border border-gray-200 rounded-lg px-3 text-sm" placeholder="Material name" /></div>
            <div><label className="text-xs text-gray-600 mb-1 block">SKU *</label><input value={formData.sku} onChange={(e) => setFormData({...formData, sku: e.target.value})} className="w-full h-10 border border-gray-200 rounded-lg px-3 text-sm" placeholder="SKU code" /></div>
            <div><label className="text-xs text-gray-600 mb-1 block">Category</label><select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full h-10 border border-gray-200 rounded-lg px-3 text-sm">{MATERIAL_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}</select></div>
            <div><label className="text-xs text-gray-600 mb-1 block">Unit</label><select value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})} className="w-full h-10 border border-gray-200 rounded-lg px-3 text-sm">{MATERIAL_UNITS.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}</select></div>
            <div><label className="text-xs text-gray-600 mb-1 block">Stock</label><input type="number" value={formData.totalStock} onChange={(e) => setFormData({...formData, totalStock: +e.target.value})} className="w-full h-10 border border-gray-200 rounded-lg px-3 text-sm" /></div>
            <div><label className="text-xs text-gray-600 mb-1 block">Reorder Level</label><input type="number" value={formData.reorderLevel} onChange={(e) => setFormData({...formData, reorderLevel: +e.target.value})} className="w-full h-10 border border-gray-200 rounded-lg px-3 text-sm" /></div>
            <div><label className="text-xs text-gray-600 mb-1 block">Unit Cost (৳)</label><input type="number" value={formData.unitCost} onChange={(e) => setFormData({...formData, unitCost: +e.target.value})} className="w-full h-10 border border-gray-200 rounded-lg px-3 text-sm" /></div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => setShowAddForm(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs cursor-pointer" size="sm">Cancel</Button>
            <Button onClick={handleAdd} className="bg-primary hover:bg-primary/80 text-white text-xs cursor-pointer" size="sm">Save Material</Button>
          </div>
        </motion.div>
      )}

      {/* Materials Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          {isMaterialsLoading ? (
            <div className="p-8 text-center text-gray-400 text-sm">Loading materials...</div>
          ) : (
            <table className="w-full">
              <thead><tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3">Material</th>
                <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3">SKU</th>
                <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3">Category</th>
                <th className="text-right text-xs font-semibold text-gray-600 px-4 py-3">Total</th>
                <th className="text-right text-xs font-semibold text-gray-600 px-4 py-3">Allocated</th>
                <th className="text-right text-xs font-semibold text-gray-600 px-4 py-3">Available</th>
                <th className="text-right text-xs font-semibold text-gray-600 px-4 py-3">Unit Cost</th>
                <th className="text-center text-xs font-semibold text-gray-600 px-4 py-3">Action</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-50">
                {rawMaterials.map((mat: any) => (
                  <tr key={mat.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-secondary">{mat.name}</span>
                        {mat.availableStock <= mat.reorderLevel && <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 font-mono">{mat.sku}</td>
                    <td className="px-4 py-3"><span className="capitalize text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{mat.category}</span></td>
                    <td className="px-4 py-3 text-right text-sm text-gray-700">{mat.totalStock} {mat.unit}</td>
                    <td className="px-4 py-3 text-right text-sm text-blue-600 font-medium">{mat.allocatedStock} {mat.unit}</td>
                    <td className={`px-4 py-3 text-right text-sm font-medium ${mat.availableStock <= mat.reorderLevel ? "text-amber-600" : "text-emerald-600"}`}>{mat.availableStock} {mat.unit}</td>
                    <td className="px-4 py-3 text-right text-sm text-gray-700">৳{mat.unitCost}</td>
                    <td className="px-4 py-3 text-center">
                      <Button onClick={() => setDeleteId(mat.id)} className="w-8! h-8 bg-red-50 hover:bg-red-100 cursor-pointer" size="sm"><Trash2 className="w-3.5 h-3.5 text-red-500" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <DeleteConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Material" description="This will remove the material record." />
    </div>
  );
}
