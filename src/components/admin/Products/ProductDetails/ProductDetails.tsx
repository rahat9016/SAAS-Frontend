"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Package, Tag } from "lucide-react";
import Image from "next/image";
import { Button } from "@/src/components/ui/button";

import { IProductVariantDetail } from "../types";
import { MOCK_PRODUCT_DETAILS } from "../data/mockProducts";

export default function ProductDetails() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const product = MOCK_PRODUCT_DETAILS[productId];

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
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm text-center py-20">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
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

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button
            variant="ghost"
            onClick={() => router.push("/admin/products")}
            className="mb-2 text-secondary-foreground cursor-pointer -ml-3"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
          <h1 className="text-2xl font-bold text-secondary">{product.name}</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Created on{" "}
            {new Date(product.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            product.status
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {product.status ? "Active" : "Inactive"}
        </span>
      </div>

      {/* Product Info Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-secondary">
            Product Information
          </h3>
        </div>
        <div className="p-6 space-y-6">
          {/* Images */}
          {product.images.length > 0 && (
            <div>
              <p className="text-sm font-medium text-secondary-dark mb-2">
                Images
              </p>
              <div className="flex gap-3 flex-wrap">
                {product.images.map((img: string, idx: number) => (
                  <div
                    key={idx}
                    className="w-24 h-24 border border-gray-200 rounded-lg overflow-hidden bg-light flex items-center justify-center"
                  >
                    <Image
                      src={img}
                      alt={`Product ${idx}`}
                      width={96}
                      height={96}
                      className="object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <DetailItem label="Category" value={product.category} />
            {product.subCategory && (
              <DetailItem label="Sub Category" value={product.subCategory} />
            )}
            {product.brand && (
              <DetailItem label="Brand" value={product.brand} />
            )}
            <DetailItem
              label="Has Variants"
              value={product.hasVariants ? "Yes" : "No"}
            />
            {!product.hasVariants && (
              <>
                <DetailItem
                  label="Base Price"
                  value={`৳${product.basePrice.toFixed(2)}`}
                />
                {product.discountedPrice && (
                  <DetailItem
                    label="Discounted Price"
                    value={`৳${product.discountedPrice.toFixed(2)}`}
                  />
                )}
                <DetailItem label="Stock" value={String(product.stock)} />
              </>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <p className="text-sm font-medium text-secondary-dark mb-1">
                Description
              </p>
              <p className="text-sm text-gray-500 leading-relaxed">
                {product.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Variants Section */}
      {product.hasVariants && product.variants && product.variants.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-secondary flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Product Variants ({product.variants.length})
            </h3>
          </div>
          <div className="p-6 space-y-4">
            {product.variants.map((variant: IProductVariantDetail, idx: number) => (
              <div
                key={variant.id}
                className="border border-gray-200 rounded-xl p-5 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-semibold text-secondary">
                    Variant #{idx + 1}
                  </h4>
                  <div className="flex items-center gap-2 flex-wrap">
                    {variant.attributes.map((attr: { name: string; value: string }, aIdx: number) => (
                      <span
                        key={aIdx}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        <Tag className="w-3 h-3" />
                        {attr.name}: {attr.value}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <DetailItem
                    label="Selling Price"
                    value={`৳${variant.sellingPrice.toFixed(2)}`}
                  />
                  {variant.discountedPrice && (
                    <DetailItem
                      label="Discounted Price"
                      value={`৳${variant.discountedPrice.toFixed(2)}`}
                    />
                  )}
                  {variant.discountType && (
                    <DetailItem
                      label="Discount Type"
                      value={
                        variant.discountType.charAt(0).toUpperCase() +
                        variant.discountType.slice(1)
                      }
                    />
                  )}
                  <DetailItem
                    label="Stock"
                    value={String(variant.stockQty)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className="text-sm font-medium text-secondary">{value}</p>
    </div>
  );
}
