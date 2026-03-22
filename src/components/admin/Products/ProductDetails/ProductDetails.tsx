"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Edit2,
  Layers,
  Package,
  ShoppingBag,
  Tag,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/src/components/ui/button";
import { IProductVariantDetail } from "../types";
import { MOCK_PRODUCT_DETAILS } from "../data/mockProducts";

export default function ProductDetails() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const product = MOCK_PRODUCT_DETAILS[productId];
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
          <h2 className="text-lg font-semibold text-secondary">
            Product not found
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            The product you are looking for does not exist.
          </p>
        </div>
      </div>
    );
  }

  const totalStock = product.hasVariants
    ? product.variants?.reduce(
        (sum: number, v: IProductVariantDetail) => sum + v.stockQty,
        0
      ) ?? 0
    : product.stock;

  return (
    <div className="w-full space-y-6">
      {/* ─── Top Bar ────────────────────────────────────────────── */}
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

      {/* ─── Hero Section: Images + Quick Info ───────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Image Gallery */}
          <div className="p-6 lg:border-r border-gray-100">
            {/* Main image */}
            <div className="relative w-full aspect-square bg-light rounded-xl flex items-center justify-center overflow-hidden mb-4">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                width={400}
                height={400}
                className="object-contain max-h-[320px]"
              />
            </div>
            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-16 h-16 rounded-lg border-2 overflow-hidden flex items-center justify-center bg-light transition-all cursor-pointer ${
                      selectedImage === idx
                        ? "border-primary shadow-md"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumb ${idx + 1}`}
                      width={56}
                      height={56}
                      className="object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Info */}
          <div className="p-6 flex flex-col">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-secondary leading-tight">
                  {product.name}
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      product.status
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    {product.status ? "Active" : "Inactive"}
                  </span>
                  {product.hasVariants && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                      <Layers className="w-3 h-3 mr-1" />
                      Has Variants
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="bg-gradient-to-r from-primary/5 to-transparent rounded-xl p-4 mb-4">
              <p className="text-xs text-gray-400 mb-1 uppercase tracking-wider font-medium">
                Price
              </p>
              <div className="flex items-baseline gap-3">
                {product.discountedPrice ? (
                  <>
                    <span className="text-2xl font-bold text-primary">
                      ৳{product.discountedPrice.toLocaleString()}
                    </span>
                    <span className="text-base text-gray-400 line-through">
                      ৳{product.basePrice.toLocaleString()}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-orange-100 text-orange-700">
                      {product.discountType === "percentage"
                        ? `${Math.round(((product.basePrice - product.discountedPrice) / product.basePrice) * 100)}% OFF`
                        : `৳${(product.basePrice - product.discountedPrice).toLocaleString()} OFF`}
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-primary">
                    ৳{product.basePrice.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-light rounded-xl p-3.5">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
                    <ShoppingBag className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <span className="text-xs text-gray-400 font-medium">
                    Stock
                  </span>
                </div>
                <p className="text-lg font-bold text-secondary">
                  {totalStock}
                  <span className="text-xs text-gray-400 font-normal ml-1">
                    units
                  </span>
                </p>
              </div>
              <div className="bg-light rounded-xl p-3.5">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center">
                    <Calendar className="w-3.5 h-3.5 text-green-600" />
                  </div>
                  <span className="text-xs text-gray-400 font-medium">
                    Created
                  </span>
                </div>
                <p className="text-sm font-semibold text-secondary">
                  {new Date(product.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Category / Brand Tags */}
            <div className="flex flex-wrap gap-2 mt-auto">
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                <Tag className="w-3 h-3" />
                {product.category}
              </span>
              {product.subCategory && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {product.subCategory}
                </span>
              )}
              {product.brand && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                  {product.brand}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Description ───────────────────────────────────────── */}
      {product.description && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-base font-semibold text-secondary mb-3">
            Description
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            {product.description}
          </p>
        </div>
      )}

      {/* ─── Variants Section ────────────────────────────────────── */}
      {product.hasVariants &&
        product.variants &&
        product.variants.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Package className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-secondary">
                  Product Variants
                </h3>
                <p className="text-xs text-gray-400">
                  {product.variants.length} variant
                  {product.variants.length > 1 ? "s" : ""} available
                </p>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {product.variants.map(
                  (variant: IProductVariantDetail, idx: number) => (
                    <div
                      key={variant.id}
                      className="border border-gray-100 rounded-xl p-4 hover:shadow-md hover:border-gray-200 transition-all"
                    >
                      {/* Variant Header */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                          Variant #{idx + 1}
                        </span>
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            variant.stockQty > 0
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {variant.stockQty > 0
                            ? `${variant.stockQty} in stock`
                            : "Out of stock"}
                        </span>
                      </div>

                      {/* Attributes */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {variant.attributes.map(
                          (
                            attr: { name: string; value: string },
                            aIdx: number
                          ) => (
                            <span
                              key={aIdx}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700"
                            >
                              <span className="text-blue-400">
                                {attr.name}:
                              </span>{" "}
                              {attr.value}
                            </span>
                          )
                        )}
                      </div>

                      {/* Variant Images */}
                      {variant.images.length > 0 && (
                        <div className="flex gap-2 mb-3">
                          {variant.images.map(
                            (img: string, imgIdx: number) => (
                              <div
                                key={imgIdx}
                                className="w-12 h-12 border border-gray-200 rounded-lg overflow-hidden bg-light flex items-center justify-center"
                              >
                                <Image
                                  src={img}
                                  alt={`Variant ${idx + 1} image ${imgIdx + 1}`}
                                  width={44}
                                  height={44}
                                  className="object-contain"
                                />
                              </div>
                            )
                          )}
                        </div>
                      )}

                      {/* Price */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-secondary">
                          ৳{variant.sellingPrice.toLocaleString()}
                        </span>
                        {variant.discountedPrice && (
                          <span className="text-xs text-gray-400 line-through">
                            ৳{variant.discountedPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
