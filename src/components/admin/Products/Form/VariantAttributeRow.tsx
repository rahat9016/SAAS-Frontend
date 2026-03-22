"use client";

import ControlledSelectField from "@/src/components/shared/FromController/ControlledSelectField";
import { Button } from "@/src/components/ui/button";
import { Trash2 } from "lucide-react";
import { useFormContext } from "react-hook-form";
import {
  mockProductAttributes,
  mockAttributeValues,
} from "../data/productMockData";

interface VariantAttributeRowProps {
  variantIndex: number;
  attrIndex: number;
  onRemove: () => void;
  canRemove: boolean;
}

export default function VariantAttributeRow({
  variantIndex,
  attrIndex,
  onRemove,
  canRemove,
}: VariantAttributeRowProps) {
  const { watch } = useFormContext();

  const selectedAttrId = watch(
    `variants.${variantIndex}.attributes.${attrIndex}.attributeId`
  );

  const valueOptions = selectedAttrId
    ? mockAttributeValues[selectedAttrId] ?? []
    : [];

  return (
    <div className="flex items-end gap-3">
      <div className="flex-1">
        <label className="text-secondary-dark text-sm mb-1 block font-normal">
          Attribute
        </label>
        <ControlledSelectField
          name={`variants.${variantIndex}.attributes.${attrIndex}.attributeId`}
          options={mockProductAttributes}
          placeholder="Select attribute"
          className="bg-white shadow-none"
        />
      </div>

      <div className="flex-1">
        <label className="text-secondary-dark text-sm mb-1 block font-normal">
          Value
        </label>
        <ControlledSelectField
          name={`variants.${variantIndex}.attributes.${attrIndex}.attributeValueId`}
          options={valueOptions}
          placeholder="Select value"
          className="bg-white shadow-none"
        />
      </div>

      {canRemove && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 mb-0.5 shrink-0 cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
