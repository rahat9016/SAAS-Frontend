"use client";

import { useParams, useRouter } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { productSchema } from "../Schema/productSchema";
import { ProductFormValues } from "../types";
import { MOCK_PRODUCT_DETAILS } from "../data/mockProducts";
import ProductForm from "./ProductForm";

export default function EditProduct() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const product = MOCK_PRODUCT_DETAILS[productId];

  const methods = useForm<ProductFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(productSchema) as any,
    defaultValues: product
      ? {
          name: product.name,
          description: product.description,
          images: [],
          categoryId: "",
          subCategoryId: "",
          brandId: "",
          hasVariants: product.hasVariants,
          basePrice: product.basePrice,
          discountedPrice: product.discountedPrice ?? ("" as unknown as number),
          discountType: product.discountType ?? "fixed",
          stock: product.stock,
          status: product.status,
          variants: product.variants
            ? product.variants.map((v) => ({
                images: [],
                sellingPrice: v.sellingPrice,
                discountedPrice: v.discountedPrice ?? ("" as unknown as number),
                discountType: v.discountType ?? "fixed",
                stockQty: v.stockQty,
                attributes: v.attributes.map((a) => ({
                  attributeId: "",
                  attributeValueId: "",
                })),
              }))
            : [],
        }
      : {
          name: "",
          description: "",
          images: [],
          categoryId: "",
          subCategoryId: "",
          brandId: "",
          hasVariants: false,
          basePrice: "" as unknown as number,
          discountedPrice: "" as unknown as number,
          discountType: "fixed",
          stock: "" as unknown as number,
          status: true,
          variants: [],
        },
  });

  const onSubmit = (values: ProductFormValues) => {
    console.log("Product Edit Submitted:", values);
    toast.success("Product updated successfully!");
    router.push(`/admin/products/${productId}`);
  };

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
          <h2 className="text-lg font-semibold text-secondary">
            Product not found
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Cannot edit a product that does not exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push(`/admin/products/${productId}`)}
          className="mb-2 text-secondary-foreground cursor-pointer -ml-3"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Product Details
        </Button>
        <h1 className="text-2xl font-bold text-secondary">Edit Product</h1>
        <p className="text-sm text-gray-400 mt-1">
          Update &quot;{product.name}&quot;
        </p>
      </div>

      <FormProvider {...methods}>
        <ProductForm onSubmit={onSubmit} mode="edit" />
      </FormProvider>
    </div>
  );
}
