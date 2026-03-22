"use client";

import { useFormContext } from "react-hook-form";
import { ProductFormValues } from "../types";
import SubmitButton from "@/src/components/shared/SubmitButton";
import ProductInfoSection from "./ProductInfoSection";
import ProductVariantsSection from "./ProductVariantsSection";

interface ProductFormProps {
  onSubmit: (data: ProductFormValues) => void;
  isPending?: boolean;
}

export default function ProductForm({
  onSubmit,
  isPending = false,
}: ProductFormProps) {
  const { handleSubmit, watch } = useFormContext<ProductFormValues>();
  const hasVariants = watch("hasVariants");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Section 1 — Product Information */}
      <ProductInfoSection />

      {/* Section 2 — Product Variants (only when hasVariants is ON) */}
      {hasVariants && <ProductVariantsSection />}

      {/* Submit */}
      <div className="flex items-center justify-end">
        <SubmitButton isLoading={isPending} label="Create Product" />
      </div>
    </form>
  );
}
