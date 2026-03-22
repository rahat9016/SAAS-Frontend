"use client";

import { Button } from "@/src/components/ui/button";
import { Plus, Layers } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { ProductFormValues } from "../types";
import VariantCard from "./VariantCard";

export default function ProductVariantsSection() {
  const { control } = useFormContext<ProductFormValues>();

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({
    control,
    name: "variants",
  });

  const handleAddVariant = () => {
    appendVariant({
      images: [],
      sellingPrice: "",
      discountedPrice: "",
      discountType: "fixed",
      stockQty: "",
      attributes: [{ attributeId: "", attributeValueId: "" }],
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* Section Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-secondary flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" />
            Product Variants
          </h3>
          <p className="text-sm text-gray-400 mt-0.5">
            Add and manage product variants with different attributes
          </p>
        </div>
        <Button
          type="button"
          onClick={handleAddVariant}
          className="bg-primary hover:bg-primary/90 text-white cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Add Variant
        </Button>
      </div>

      <div className="p-6 space-y-4">
        {variantFields.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
            <Layers className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-400">
              No variants added yet. Click &quot;Add Variant&quot; to create your first
              variant.
            </p>
          </div>
        )}

        {variantFields.map((field, index) => (
          <VariantCard
            key={field.id}
            variantIndex={index}
            onRemove={() => removeVariant(index)}
          />
        ))}
      </div>
    </div>
  );
}
