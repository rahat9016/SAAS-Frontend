"use client";

import { dummyAddresses, IAddress } from "@/src/data/dummyAddresses";
import {
  Check,
  Edit3,
  MapPin,
  Phone,
  Plus,
  Trash2,
  User,
  X,
} from "lucide-react";
import { useState } from "react";

export default function AddressBookPage() {
  const [addresses, setAddresses] = useState<IAddress[]>(dummyAddresses);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    label: "",
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    district: "",
    division: "",
    postalCode: "",
  });

  const resetForm = () => {
    setForm({
      label: "",
      fullName: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      district: "",
      division: "",
      postalCode: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (addr: IAddress) => {
    setForm({
      label: addr.label,
      fullName: addr.fullName,
      phone: addr.phone,
      addressLine1: addr.addressLine1,
      addressLine2: addr.addressLine2 || "",
      city: addr.city,
      district: addr.district,
      division: addr.division,
      postalCode: addr.postalCode,
    });
    setEditingId(addr.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (editingId) {
      setAddresses((prev) =>
        prev.map((a) =>
          a.id === editingId
            ? { ...a, ...form }
            : a
        )
      );
    } else {
      const newAddr: IAddress = {
        id: `addr-${Date.now()}`,
        ...form,
        isDefault: addresses.length === 0,
      };
      setAddresses((prev) => [...prev, newAddr]);
    }
    resetForm();
  };

  const handleDelete = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const setDefault = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Address Book</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your delivery addresses</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm cursor-pointer"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Add Address</span>
        </button>
      </div>

      {/* Address Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`relative bg-white rounded-xl border p-5 shadow-sm transition-all hover:shadow-md ${
              addr.isDefault ? "border-primary/30 ring-1 ring-primary/10" : "border-gray-100"
            }`}
          >
            {/* Label + Default Badge */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md">
                {addr.label}
              </span>
              {addr.isDefault && (
                <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-md flex items-center gap-1">
                  <Check size={12} />
                  Default
                </span>
              )}
            </div>

            {/* Info */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <User size={14} className="text-gray-400 shrink-0" />
                {addr.fullName}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone size={14} className="text-gray-400 shrink-0" />
                {addr.phone}
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <MapPin size={14} className="text-gray-400 shrink-0 mt-0.5" />
                <span>
                  {addr.addressLine1}
                  {addr.addressLine2 ? `, ${addr.addressLine2}` : ""}
                  <br />
                  {addr.city}, {addr.district} {addr.postalCode}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
              <button
                onClick={() => handleEdit(addr)}
                className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-primary transition-colors cursor-pointer"
              >
                <Edit3 size={13} />
                Edit
              </button>
              {!addr.isDefault && (
                <>
                  <span className="text-gray-200">|</span>
                  <button
                    onClick={() => setDefault(addr.id)}
                    className="text-xs font-medium text-gray-500 hover:text-primary transition-colors cursor-pointer"
                  >
                    Set as Default
                  </button>
                  <span className="text-gray-200">|</span>
                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="flex items-center gap-1.5 text-xs font-medium text-red-400 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    <Trash2 size={13} />
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingId ? "Edit Address" : "Add New Address"}
              </h2>
              <button
                onClick={resetForm}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Address Label</label>
                <input
                  name="label"
                  value={form.label}
                  onChange={handleChange}
                  className="w-full h-11 px-4 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                  placeholder="e.g. Home, Office"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                  <input
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    className="w-full h-11 px-4 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full h-11 px-4 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                    placeholder="Phone number"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Address Line 1</label>
                <input
                  name="addressLine1"
                  value={form.addressLine1}
                  onChange={handleChange}
                  className="w-full h-11 px-4 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                  placeholder="House no, Street name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Address Line 2 <span className="text-gray-400">(Optional)</span></label>
                <input
                  name="addressLine2"
                  value={form.addressLine2}
                  onChange={handleChange}
                  className="w-full h-11 px-4 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                  placeholder="Area, Landmark"
                />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
                  <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className="w-full h-11 px-4 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">District</label>
                  <input
                    name="district"
                    value={form.district}
                    onChange={handleChange}
                    className="w-full h-11 px-4 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                    placeholder="District"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Postal Code</label>
                  <input
                    name="postalCode"
                    value={form.postalCode}
                    onChange={handleChange}
                    className="w-full h-11 px-4 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                    placeholder="Postal code"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
              <button
                onClick={resetForm}
                className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm cursor-pointer"
              >
                {editingId ? "Update Address" : "Save Address"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
