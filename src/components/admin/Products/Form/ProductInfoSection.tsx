"use client";

import ControlledInputField from "@/src/components/shared/FromController/ControlledInputField";
import ControlledSelectField from "@/src/components/shared/FromController/ControlledSelectField";
import ControlledSwitchField from "@/src/components/shared/FromController/ControlledSwitchField";
import ControlledTextareaField from "@/src/components/shared/FromController/ControlledTextareaField";
import { MultipleImageUploadController } from "@/src/components/shared/FromController/MultipleImageFileInput";
import InputLabel from "@/src/components/shared/InputLabel";
import { useFormContext } from "react-hook-form";
import { ProductFormValues } from "../types";
import {
  mockCategories,
  mockSubCategories,
  mockBrands,
} from "../data/productMockData";

const discountTypeOptions = [
  { label: "Fixed", value: "fixed" },
  { label: "Percentage", value: "percentage" },
];

export default function ProductInfoSection() {
  const { watch } = useFormContext<ProductFormValues>();

  const hasVariants = watch("hasVariants");
  const selectedCategoryId = watch("categoryId");

  const subCategoryOptions = selectedCategoryId
    ? mockSubCategories[selectedCategoryId] ?? []
    : [];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* Section Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-secondary">
          Product Information
        </h3>
        <p className="text-sm text-gray-400 mt-0.5">
          Fill in the basic product details
        </p>
      </div>

      <div className="p-6 space-y-5">
        {/* Row 1: Name */}
        <div>
          <InputLabel label="Product Name" required />
          <ControlledInputField
            className="bg-light"
            name="name"
            placeholder="Enter product name"
          />
        </div>

        {/* Row 2: Description */}
        <div>
          <InputLabel label="Description" />
          <ControlledTextareaField
            className="bg-light"
            name="description"
            placeholder="Enter product description"
          />
        </div>

        {/* Row 3: Images */}
        <div>
          <InputLabel label="Product Images" />
          <MultipleImageUploadController
            name="images"
            label="Upload product images"
          />
        </div>

        {/* Row 4: Category, Sub Category, Brand */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <InputLabel label="Category" required />
            <ControlledSelectField
              name="categoryId"
              options={mockCategories}
              placeholder="Select category"
              className="bg-light shadow-none"
            />
          </div>
          <div>
            <InputLabel label="Sub Category" />
            <ControlledSelectField
              name="subCategoryId"
              options={subCategoryOptions}
              placeholder="Select sub category"
              className="bg-light shadow-none"
            />
          </div>
          <div>
            <InputLabel label="Brand" />
            <ControlledSelectField
              name="brandId"
              options={mockBrands}
              placeholder="Select brand"
              className="bg-light shadow-none"
            />
          </div>
        </div>

        {/* Row 5: Has Variants toggle */}
        <div className="pt-2 pb-1">
          <ControlledSwitchField
            name="hasVariants"
            label="Has Variants"
            description="Enable this if the product has different variants (e.g. size, color)"
          />
        </div>

        {/* Row 6 (conditional): Price, Discounted Price, Discount Type, Stock */}
        {!hasVariants && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 border-t border-gray-100">
            <div>
              <InputLabel label="Base Price" required />
              <ControlledInputField
                className="bg-light"
                name="basePrice"
                type="number"
                placeholder="0.00"
              />
            </div>
            <div>
              <InputLabel label="Discounted Price" />
              <ControlledInputField
                className="bg-light"
                name="discountedPrice"
                type="number"
                placeholder="0.00"
              />
            </div>
            <div>
              <InputLabel label="Discount Type" />
              <ControlledSelectField
                name="discountType"
                options={discountTypeOptions}
                placeholder="Select type"
                className="bg-light shadow-none"
              />
            </div>
            <div>
              <InputLabel label="Stock" required />
              <ControlledInputField
                className="bg-light"
                name="stock"
                type="number"
                placeholder="0"
              />
            </div>
          </div>
        )}

        {/* Status */}
        <div className="pt-2">
          <ControlledSwitchField
            name="status"
            label="Active"
            description="Enable or disable this product"
          />
        </div>
      </div>
    </div>
  );
}
