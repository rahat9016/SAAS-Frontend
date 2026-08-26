import {
  mockCategoriesList,
  mockSegmentsList,
  mockSubCategoriesList,
} from "@/src/components/admin/Categories/data/mockCategoryHierarchy";
import ControlledInputField from "@/src/components/shared/FromController/ControlledInputField";
import ControlledSelectField from "@/src/components/shared/FromController/ControlledSelectField";
import InputLabel from "@/src/components/shared/InputLabel";
import SubmitButton from "@/src/components/shared/SubmitButton";
import { Button } from "@/src/components/ui/button";
import { ReactNode } from "react";
import { useFormContext } from "react-hook-form";
import { monthOptions } from "../Schema/articleSchema";
import {
  collectionTypeOptions,
  SeasonFormValues,
  sizeChartTemplateOptions,
  styleTypeOptions,
} from "../Schema/seasonSchema";

const styleMainClassOptions = mockCategoriesList.map((c) => ({
  label: c.name,
  value: c.id,
}));

function FormRow({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <InputLabel
        label={label}
        required={required}
        className="text-sm font-semibold text-secondary-dark mb-0"
      />
      {children}
    </div>
  );
}

export default function SeasonForm({
  isEditMode = false,
  onSubmit,
  onCancel,
}: {
  isEditMode?: boolean;
  onSubmit: (data: SeasonFormValues) => void;
  onCancel: () => void;
}) {
  const { handleSubmit, watch } = useFormContext<SeasonFormValues>();

  const styleMainClass = watch("styleMainClass");
  const styleClass = watch("styleClass");

  const styleClassOptions = mockSegmentsList
    .filter((s) => s.categoryId === styleMainClass)
    .map((s) => ({ label: s.name, value: s.id }));

  const styleSubClassOptions = mockSubCategoriesList
    .filter((s) => s.segmentId === styleClass)
    .map((s) => ({ label: s.name, value: s.id }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4 mt-2">
      <FormRow label="Style Type" required>
        <ControlledSelectField
          name="styleType"
          options={styleTypeOptions}
          placeholder="Select style type"
          className="bg-white shadow-none"
        />
      </FormRow>

      <FormRow label="Size Chart Template">
        <ControlledSelectField
          name="sizeChartTemplate"
          options={sizeChartTemplateOptions}
          placeholder="Select template"
          className="bg-white shadow-none"
        />
      </FormRow>

      <FormRow label="Style" required>
        <ControlledInputField
          className="bg-white"
          name="season"
          placeholder="Enter style name"
        />
      </FormRow>

      <FormRow label="Delivery Month" required>
        <ControlledSelectField
          name="deliveryMonth"
          options={monthOptions}
          placeholder="Select month"
          className="bg-white shadow-none"
        />
      </FormRow>

      <FormRow label="Collection Type" required>
        <ControlledSelectField
          name="collectionType"
          options={collectionTypeOptions}
          placeholder="Select collection type"
          className="bg-white shadow-none"
        />
      </FormRow>

      <FormRow label="Style Main Class">
        <ControlledSelectField
          name="styleMainClass"
          options={styleMainClassOptions}
          placeholder="Select main class"
          className="bg-white shadow-none"
        />
      </FormRow>

      <FormRow label="Style Class">
        <ControlledSelectField
          name="styleClass"
          options={styleClassOptions}
          placeholder="Select class"
          className="bg-white shadow-none"
        />
      </FormRow>

      <FormRow label="Style Sub Class">
        <ControlledSelectField
          name="styleSubClass"
          options={styleSubClassOptions}
          placeholder="Select sub class"
          className="bg-white shadow-none"
        />
      </FormRow>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4 pt-2">
        <Button
          type="button"
          onClick={onCancel}
          className="text-secondary-foreground bg-transparent hover:bg-transparent border shadow-none cursor-pointer"
        >
          Cancel
        </Button>
        <SubmitButton label={isEditMode ? "Update" : "Save"} />
      </div>
    </form>
  );
}
