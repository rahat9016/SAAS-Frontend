"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Edit2,
  Layers,
  Leaf,
  Package,
  Palette,
  Plane,
  Ruler,
  Sparkles,
  Tag,
  Truck,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/src/components/ui/button";
import { toast } from "react-toastify";
import { MOCK_PRODUCTS } from "../data/mockProducts";

const actionButtons = ["Promote", "Demote", "Cancel", "Re-activate", "Transfer", "Approve"];

const promoteStatusColors: Record<string, string> = {
  Approved: "bg-green-50 text-green-700 border-green-200",
  Development: "bg-blue-50 text-blue-700 border-blue-200",
  Concept: "bg-amber-50 text-amber-700 border-amber-200",
};

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-400 font-medium">{label}</span>
      <span className="text-sm font-semibold text-secondary text-right">{value || "—"}</span>
    </div>
  );
}

export default function ProductDetails() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const product = MOCK_PRODUCTS.find((p) => p.id === productId);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) {
    return (
      <div className="w-full">
        <Button
          variant="ghost"
          onClick={() => router.push("/admin/products")}
          className="mb-4 text-secondary-foreground cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Button>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm text-center py-20">
          <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-secondary">Product not found</h2>
          <p className="text-sm text-gray-400 mt-1">
            The product you are looking for does not exist.
          </p>
        </div>
      </div>
    );
  }

  const handleAction = (btn: string) => {
    toast.success(`Action executed: ${btn} for ${product.style || product.id}`);
  };

  const images = product.images?.length ? product.images : product.image ? [product.image] : [];
  const colors = product.activeColor
    ? product.activeColor.split(",").map((c) => c.trim()).filter(Boolean)
    : [];
  const statusBadge = promoteStatusColors[product.promoteStatus] || "bg-gray-50 text-gray-700 border-gray-200";

  return (
    <div className="w-full space-y-5">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.push("/admin/products")}
          className="text-secondary-foreground cursor-pointer -ml-3"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Button>
        <Button
          onClick={() => router.push(`/admin/products/${productId}/edit`)}
          className="bg-primary text-white hover:bg-primary/90 cursor-pointer gap-2"
        >
          <Edit2 className="w-4 h-4" />
          Edit Product
        </Button>
      </div>

      {/* Hero: Gallery + Summary */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Gallery */}
          <div className="p-6 lg:border-r border-gray-100">
            <div className="relative w-full aspect-square bg-light rounded-xl overflow-hidden mb-4">
              {images.length > 0 ? (
                <Image
                  src={images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-16 h-16 text-gray-200" />
                </div>
              )}
              <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-lg backdrop-blur-xs font-mono">
                {product.style || product.id}
              </div>
            </div>
            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-16 h-16 rounded-lg border-2 overflow-hidden transition-all cursor-pointer ${
                      selectedImage === idx
                        ? "border-primary shadow-md"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Image src={img} alt={`Thumb ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="p-6 flex flex-col">
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <h1 className="text-2xl font-bold text-secondary leading-tight">{product.name}</h1>
                <p className="text-xs text-gray-400 mt-1 font-mono">Style {product.style || product.id}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                  product.status
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-red-50 text-red-700 border-red-200"
                }`}
              >
                {product.status ? "Active" : "Inactive"}
              </span>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${statusBadge}`}>
                {product.promoteStatus || "—"}
              </span>
              {product.hasVariants && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                  <Layers className="w-3 h-3" /> Has Variants
                </span>
              )}
              {product.isNewArrival && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">
                  <Sparkles className="w-3 h-3" /> New Arrival
                </span>
              )}
            </div>

            {/* Price */}
            <div className="bg-gradient-to-r from-primary/5 to-transparent rounded-xl p-4 mb-4 flex items-center gap-8">
              <div>
                <p className="text-xs text-gray-400 mb-1 uppercase tracking-wider font-medium">Retail Price</p>
                <span className="text-2xl font-bold text-primary">{product.retailPrice || "—"}</span>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1 uppercase tracking-wider font-medium">FOB</p>
                <span className="text-lg font-semibold text-secondary">{product.fob || "—"}</span>
              </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-light rounded-xl p-3.5">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Ruler className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <span className="text-xs text-gray-400 font-medium">Size Range</span>
                </div>
                <p className="text-sm font-bold text-secondary">{product.sizeRange || "—"}</p>
              </div>
              <div className="bg-light rounded-xl p-3.5">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center">
                    <Calendar className="w-3.5 h-3.5 text-green-600" />
                  </div>
                  <span className="text-xs text-gray-400 font-medium">Created</span>
                </div>
                <p className="text-sm font-semibold text-secondary">
                  {new Date(product.createdAt).toLocaleDateString("en-US", {
                    month: "short", day: "numeric", year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Colors */}
            {colors.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <Palette className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Active Colors</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {colors.map((c) => (
                    <span key={c} className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-light text-secondary border border-gray-100">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-auto">
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                <Tag className="w-3 h-3" /> {product.category}
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                {product.fit}
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                {product.month}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white p-3 border border-gray-100 rounded-2xl shadow-sm flex flex-wrap items-center gap-2">
        {actionButtons.map((btn) => (
          <button
            key={btn}
            onClick={() => handleAction(btn)}
            className="px-4 py-2 text-xs font-bold border border-orange-200 text-orange-800 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
          >
            {btn}
          </button>
        ))}
      </div>

      {/* Detail cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Package className="w-4 h-4 text-primary" />
            </div>
            <h3 className="text-sm font-semibold text-secondary">Style & Classification</h3>
          </div>
          <div className="mt-2">
            <InfoRow label="Fit" value={product.fit} />
            <InfoRow label="Promotional Month" value={product.month} />
            <InfoRow label="Promote Status" value={product.promoteStatus} />
            <InfoRow label="Category" value={product.category} />
            <InfoRow label="Size Range" value={product.sizeRange} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <Truck className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="text-sm font-semibold text-secondary">Sourcing & Logistics</h3>
          </div>
          <div className="mt-2">
            <InfoRow label="Supplier" value={product.supplier} />
            <InfoRow label="Assigned Branch" value={product.assignedBranch} />
            <InfoRow label="Packing Code" value={product.packingCode} />
            <InfoRow
              label="Transport Mode"
              value={
                <span className="inline-flex items-center gap-1">
                  <Plane className="w-3.5 h-3.5 text-gray-400" /> {product.transportMode}
                </span>
              }
            />
            <InfoRow label="Ex Delivery" value={product.exDelivery} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 lg:col-span-2">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Leaf className="w-4 h-4 text-emerald-600" />
            </div>
            <h3 className="text-sm font-semibold text-secondary">Fabric & Composition</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 mt-2">
            <InfoRow label="Fabric" value={product.fabric} />
            <InfoRow label="Fabric Description" value={product.fabricDescription} />
            <InfoRow label="Composition" value={product.composition} />
          </div>
          <div className="mt-1 pt-3 border-t border-gray-50">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
              <Leaf className="w-3.5 h-3.5" /> {product.sustainability || "—"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
