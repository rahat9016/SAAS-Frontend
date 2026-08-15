import ControlledInputField from "@/src/components/shared/FromController/ControlledInputField";
import ControlledSelectField from "@/src/components/shared/FromController/ControlledSelectField";
import ControlledTextareaField from "@/src/components/shared/FromController/ControlledTextareaField";
import ControlledToggleField from "@/src/components/shared/FromController/ControlledToggleField";
import InputLabel from "@/src/components/shared/InputLabel";
import SubmitButton from "@/src/components/shared/SubmitButton";
import { Button } from "@/src/components/ui/button";
import { useFormContext } from "react-hook-form";
import { SizeFormValues } from "../Schema/sizeSchema";

export default function SizeForm({
  isEditMode = false,
  onSubmit,
  onCancel,
}: {
  isEditMode?: boolean;
  onSubmit: (data: SizeFormValues) => void;
  onCancel: () => void;
}) {
  const { handleSubmit } = useFormContext<SizeFormValues>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5 mt-2">
      {/* Name */}
      <div>
        <InputLabel label="Size Name" required />
        <ControlledInputField
          className="bg-light"
          name="name"
          placeholder="e.g. Medium"
        />
      </div>

      {/* Code */}
      <div>
        <InputLabel label="Size Code" required />
        <ControlledInputField
          className="bg-light"
          name="code"
          placeholder="e.g. X212"
        />
      </div>

      {/* Description */}
      <div>
        <InputLabel label="Description" />
        <ControlledTextareaField
          className="bg-light"
          name="description"
          placeholder="Enter size description"
        />
      </div>

      {/* Sort Order */}
      <div>
        <InputLabel label="Sort Order" />
        <ControlledInputField
          className="bg-light"
          name="sortOrder"
          type="number"
          placeholder="e.g. 1"
        />
      </div>

      {/* Measurements */}
      <div>
        <InputLabel label="Measurements" />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className="text-xs text-secondary-gary">Chest</span>
            <ControlledInputField
              className="bg-light"
              name="chest"
              type="number"
              placeholder="e.g. 39"
            />
          </div>
          <div>
            <span className="text-xs text-secondary-gary">Waist</span>
            <ControlledInputField
              className="bg-light"
              name="waist"
              type="number"
              placeholder="e.g. 33"
            />
          </div>
          <div>
            <span className="text-xs text-secondary-gary">Hip</span>
            <ControlledInputField
              className="bg-light"
              name="hip"
              type="number"
              placeholder="e.g. 41"
            />
          </div>
          <div>
            <span className="text-xs text-secondary-gary">Length</span>
            <ControlledInputField
              className="bg-light"
              name="length"
              type="number"
              placeholder="e.g. 27"
            />
          </div>
        </div>
        <div className="mt-3">
          <span className="text-xs text-secondary-gary">Unit</span>
          <ControlledSelectField
            className="bg-light"
            name="unit"
            placeholder="Select unit"
            options={[
              { label: "Inches (in)", value: "in" },
              { label: "Centimeters (cm)", value: "cm" },
            ]}
          />
        </div>
      </div>

      {/* Status */}
      <div>
        <InputLabel label="Status" />
        <div className="flex items-center gap-3">
          <ControlledToggleField name="isActive" defaultChecked />
          <span className="text-sm text-secondary-gary">Active / Inactive</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4">
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
