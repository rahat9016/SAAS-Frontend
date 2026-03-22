"use client";

import ControlledInputField from "@/src/components/shared/FromController/ControlledInputField";
import ControlledSelectField from "@/src/components/shared/FromController/ControlledSelectField";
import { MultipleImageUploadController } from "@/src/components/shared/FromController/MultipleImageFileInput";
import InputLabel from "@/src/components/shared/InputLabel";
import { Button } from "@/src/components/ui/button";
import { Plus, Trash2, Package } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { ProductFormValues } from "../types";
import VariantAttributeRow from "./VariantAttributeRow";

const discountTypeOptions = [
  { label: "Fixed", value: "fixed" },
  { label: "Percentage", value: "percentage" },
];

interface VariantCardProps {
  variantIndex: number;
  onRemove: () => void;
}

export default function VariantCard({
  variantIndex,
  onRemove,
}: VariantCardProps) {
  const { control } = useFormContext<ProductFormValues>();

  const {
    fields: attrFields,
    append: appendAttr,
    remove: removeAttr,
  } = useFieldArray({
    control,
    name: `variants.${variantIndex}.attributes` as const,
  });

  return (
    <div className="relative bg-white border border-gray-200 rounded-xl p-5 space-y-5 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Package className="w-4 h-4 text-primary" />
          </div>
          <h4 className="text-sm font-semibold text-secondary">
            Variant #{variantIndex + 1}
          </h4>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Remove
        </Button>
      </div>

      {/* Variant Image */}
      <div>
        <InputLabel label="Variant Images" />
        <MultipleImageUploadController
          name={`variants.${variantIndex}.images`}
          label="Upload variant images"
          className="h-28! w-full! lg:w-36!"
          imgClassName="object-cover"
        />
      </div>

      {/* Price & Stock Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <InputLabel label="Selling Price" required />
          <ControlledInputField
            className="bg-light"
            name={`variants.${variantIndex}.sellingPrice`}
            type="number"
            placeholder="0.00"
          />
        </div>
        <div>
          <InputLabel label="Discounted Price" />
          <ControlledInputField
            className="bg-light"
            name={`variants.${variantIndex}.discountedPrice`}
            type="number"
            placeholder="0.00"
          />
        </div>
        <div>
          <InputLabel label="Discount Type" />
          <ControlledSelectField
            name={`variants.${variantIndex}.discountType`}
            options={discountTypeOptions}
            placeholder="Select type"
            className="bg-light shadow-none"
          />
        </div>
        <div>
          <InputLabel label="Stock Quantity" required />
          <ControlledInputField
            className="bg-light"
            name={`variants.${variantIndex}.stockQty`}
            type="number"
            placeholder="0"
          />
        </div>
      </div>

      {/* Attributes Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h5 className="text-sm font-medium text-secondary-dark">
            Attributes
          </h5>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              appendAttr({ attributeId: "", attributeValueId: "" })
            }
            className="text-primary border-primary/30 hover:bg-primary/5 cursor-pointer text-xs"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add Attribute
          </Button>
        </div>

        <div className="space-y-3 bg-light/60 rounded-lg p-3">
          {attrFields.length === 0 && (
            <p className="text-xs text-gray-400 text-center py-3">
              No attributes added yet. Click &quot;Add Attribute&quot; to start.
            </p>
          )}
          {attrFields.map((field, attrIdx) => (
            <VariantAttributeRow
              key={field.id}
              variantIndex={variantIndex}
              attrIndex={attrIdx}
              onRemove={() => removeAttr(attrIdx)}
              canRemove={attrFields.length > 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
