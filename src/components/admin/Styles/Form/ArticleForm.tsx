import { mockBrandsList } from "@/src/components/admin/Brands/data/mockBrandData";
import {
  mockCategoriesList,
  mockSegmentsList,
  mockSubCategoriesList,
} from "@/src/components/admin/Categories/data/mockCategoryHierarchy";
import { mockColorsList } from "@/src/components/admin/Categories/data/mockColorData";
import { mockSizesList } from "@/src/components/admin/Categories/data/mockSizeData";
import ControlledInputField from "@/src/components/shared/FromController/ControlledInputField";
import ControlledSelectField from "@/src/components/shared/FromController/ControlledSelectField";
import InputLabel from "@/src/components/shared/InputLabel";
import SubmitButton from "@/src/components/shared/SubmitButton";
import { Button } from "@/src/components/ui/button";
import { Checkbox } from "@/src/components/ui/checkbox";
import { useFormContext } from "react-hook-form";
import { mockSeasonsList } from "../data/mockStyleData";
import {
  ArticleFormValues,
  monthOptions,
  promoteStatusOptions,
} from "../Schema/articleSchema";

const seasonOptions = mockSeasonsList
  .filter((s) => s.id !== "all")
  .map((s) => ({ label: s.season, value: s.id }));

const categoryOptions = mockCategoriesList.map((c) => ({
  label: c.name,
  value: c.id,
}));

const brandOptions = mockBrandsList.map((b) => ({ label: b.name, value: b.id }));

export default function ArticleForm({
  isEditMode = false,
  onSubmit,
  onCancel,
}: {
  isEditMode?: boolean;
  onSubmit: (data: ArticleFormValues) => void;
  onCancel: () => void;
}) {
  const { handleSubmit, watch, setValue } = useFormContext<ArticleFormValues>();

  const categoryId = watch("categoryId");
  const segmentId = watch("segmentId");
  const colorIds = watch("colorIds") || [];
  const sizeIds = watch("sizeIds") || [];

  const segmentOptions = mockSegmentsList
    .filter((s) => s.categoryId === categoryId)
    .map((s) => ({ label: s.name, value: s.id }));

  const subCategoryOptions = mockSubCategoriesList
    .filter((s) => s.segmentId === segmentId)
    .map((s) => ({ label: s.name, value: s.id }));

  const allColorIds = mockColorsList.map((c) => c.id);
  const allSizeIds = mockSizesList.map((s) => s.id);
  const allColorsSelected = colorIds.length === allColorIds.length;
  const allSizesSelected = sizeIds.length === allSizeIds.length;

  const toggleColor = (id: string, checked: boolean) => {
    setValue(
      "colorIds",
      checked ? [...colorIds, id] : colorIds.filter((c) => c !== id),
      { shouldValidate: true }
    );
  };

  const toggleSize = (id: string, checked: boolean) => {
    setValue(
      "sizeIds",
      checked ? [...sizeIds, id] : sizeIds.filter((s) => s !== id),
      { shouldValidate: true }
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full space-y-5 mt-2 max-h-[70vh] overflow-y-auto pr-1"
    >
      {/* Classification */}
      <div className="p-4 rounded-lg bg-gray-50 border border-gray-100 space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Classification
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <InputLabel label="Season" required />
            <ControlledSelectField
              name="seasonId"
              options={seasonOptions}
              placeholder="Select season"
              className="bg-white shadow-none"
            />
          </div>
          <div>
            <InputLabel label="Brand" required />
            <ControlledSelectField
              name="brandId"
              options={brandOptions}
              placeholder="Select brand"
              className="bg-white shadow-none"
            />
          </div>
          <div>
            <InputLabel label="Category" required />
            <ControlledSelectField
              name="categoryId"
              options={categoryOptions}
              placeholder="Select category"
              className="bg-white shadow-none"
            />
          </div>
          <div>
            <InputLabel label="Segment" required />
            <ControlledSelectField
              name="segmentId"
              options={segmentOptions}
              placeholder="Select segment"
              className="bg-white shadow-none"
            />
          </div>
          <div>
            <InputLabel label="Sub Category" required />
            <ControlledSelectField
              name="subCategoryId"
              options={subCategoryOptions}
              placeholder="Select sub category"
              className="bg-white shadow-none"
            />
          </div>
        </div>
      </div>

      {/* Core fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <InputLabel label="Style Code" required />
          <ControlledInputField className="bg-light" name="style" placeholder="e.g. 212635" />
        </div>
        <div>
          <InputLabel label="Fit" required />
          <ControlledInputField className="bg-light" name="fit" placeholder="e.g. Slim" />
        </div>
        <div>
          <InputLabel label="Image URL" />
          <ControlledInputField className="bg-light" name="image" placeholder="https://..." />
        </div>
        <div>
          <InputLabel label="Month" required />
          <ControlledSelectField
            name="month"
            options={monthOptions}
            placeholder="Select month"
            className="bg-light shadow-none"
          />
        </div>
        <div>
          <InputLabel label="Retail Price" required />
          <ControlledInputField className="bg-light" name="retailPrice" placeholder="e.g. 14.99€" />
        </div>
        <div>
          <InputLabel label="FOB" required />
          <ControlledInputField className="bg-light" name="fob" placeholder="e.g. 150BDT" />
        </div>
      </div>

      {/* Color select */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <InputLabel label="Color" required />
          <label className="flex items-center gap-2 text-xs text-secondary-gary cursor-pointer">
            <Checkbox
              checked={allColorsSelected}
              onCheckedChange={(checked) =>
                setValue("colorIds", checked ? allColorIds : [], { shouldValidate: true })
              }
            />
            Select All
          </label>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 rounded-lg border border-gray-100 bg-gray-50">
          {mockColorsList.map((color) => (
            <label key={color.id} className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox
                checked={colorIds.includes(color.id)}
                onCheckedChange={(checked) => toggleColor(color.id, !!checked)}
              />
              {color.name} <span className="text-xs text-secondary-gary">({color.code})</span>
            </label>
          ))}
        </div>
      </div>

      {/* Size select */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <InputLabel label="Size" required />
          <label className="flex items-center gap-2 text-xs text-secondary-gary cursor-pointer">
            <Checkbox
              checked={allSizesSelected}
              onCheckedChange={(checked) =>
                setValue("sizeIds", checked ? allSizeIds : [], { shouldValidate: true })
              }
            />
            Select All
          </label>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 rounded-lg border border-gray-100 bg-gray-50">
          {mockSizesList.map((size) => (
            <label key={size.id} className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox
                checked={sizeIds.includes(size.id)}
                onCheckedChange={(checked) => toggleSize(size.id, !!checked)}
              />
              {size.name} <span className="text-xs text-secondary-gary">({size.code})</span>
            </label>
          ))}
        </div>
      </div>

      {/* Fabric & composition */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <InputLabel label="Fabric" />
          <ControlledInputField className="bg-light" name="fabric" placeholder="e.g. FA-CK-01" />
        </div>
        <div>
          <InputLabel label="Fabric Description" />
          <ControlledInputField className="bg-light" name="fabricDescription" placeholder="e.g. Single Jersey, 100% BCI" />
        </div>
        <div>
          <InputLabel label="Composition" />
          <ControlledInputField className="bg-light" name="composition" placeholder="e.g. 80% Cotton, 20% Polyester" />
        </div>
        <div>
          <InputLabel label="Promote Status" required />
          <ControlledSelectField
            name="promoteStatus"
            options={promoteStatusOptions}
            placeholder="Select status"
            className="bg-light shadow-none"
          />
        </div>
      </div>

      {/* Logistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <InputLabel label="Assigned Branch" />
          <ControlledInputField className="bg-light" name="assignedBranch" placeholder="e.g. Dhaka" />
        </div>
        <div>
          <InputLabel label="Packing Code" />
          <ControlledInputField className="bg-light" name="packingCode" placeholder="e.g. EI" />
        </div>
        <div>
          <InputLabel label="Transport Mode" />
          <ControlledInputField className="bg-light" name="transportMode" placeholder="e.g. Air / Sea / Land" />
        </div>
        <div>
          <InputLabel label="Supplier" />
          <ControlledInputField className="bg-light" name="supplier" placeholder="e.g. Square" />
        </div>
        <div>
          <InputLabel label="Ex Delivery" />
          <ControlledInputField className="bg-light" name="exDelivery" type="date" placeholder="dd.mm.yy" />
        </div>
        <div>
          <InputLabel label="Sustainability" />
          <ControlledInputField className="bg-light" name="sustainability" placeholder="e.g. Re-cycled" />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4 pt-2 sticky bottom-0 bg-white">
        <Button
          type="button"
          onClick={onCancel}
          className="text-secondary-foreground bg-transparent hover:bg-transparent border shadow-none cursor-pointer"
        >
          Cancel
        </Button>
        <SubmitButton label={isEditMode ? "Update" : "Create"} />
      </div>
    </form>
  );
}
