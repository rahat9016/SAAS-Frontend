"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { productSchema } from "../Schema/productSchema";
import { ProductFormValues } from "../types";
import ProductForm from "./ProductForm";

export default function CreateProduct() {
  const methods = useForm<ProductFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(productSchema) as any,
    defaultValues: {
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
    // For now, just log the values — wire up API later
    console.log("Product Form Submitted:", values);
    toast.success("Product created successfully!");
  };

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-secondary">Create Product</h1>
        <p className="text-sm text-gray-400 mt-1">
          Add a new product to your store
        </p>
      </div>

      <FormProvider {...methods}>
        <ProductForm onSubmit={onSubmit} />
      </FormProvider>
    </div>
  );
}
