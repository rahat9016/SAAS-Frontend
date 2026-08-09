import ErrorMessage from "@/src/components/shared/Errors/ErrorMessage";
import ControlledInputField from "@/src/components/shared/FromController/ControlledInputField";
import ControlledSelectField from "@/src/components/shared/FromController/ControlledSelectField";
import ControlledTextareaField from "@/src/components/shared/FromController/ControlledTextareaField";
import ControlledToggleField from "@/src/components/shared/FromController/ControlledToggleField";
import InputLabel from "@/src/components/shared/InputLabel";
import SubmitButton from "@/src/components/shared/SubmitButton";
import { Button } from "@/src/components/ui/button";
import { ErrorType } from "@/src/types/common/common";
import { useFormContext } from "react-hook-form";
import { SegmentFormValues } from "../Schema/segmentSchema";

export default function SegmentForm({
  isEditMode = false,
  onSubmit,
  onCancel,
  isPending = false,
  categoryOptions = [],
  error,
}: {
  isEditMode?: boolean;
  onSubmit: (data: SegmentFormValues) => void;
  onCancel: () => void;
  isPending?: boolean;
  categoryOptions?: { label: string; value: string }[];
  error?: ErrorType;
}) {
  const { handleSubmit } = useFormContext<SegmentFormValues>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5 mt-2">
      {/* Name */}
      <div>
        <InputLabel label="Name" required />
        <ControlledInputField
          className="bg-light"
          name="name"
          placeholder="Enter segment name"
        />
      </div>

      {/* Category */}
      <div>
        <InputLabel label="Category" required />
        <ControlledSelectField
          name="categoryId"
          placeholder="Select category"
          options={categoryOptions}
          className="bg-light shadow-none"
        />
      </div>

      {/* Description */}
      <div>
        <InputLabel label="Description" />
        <ControlledTextareaField
          className="bg-light"
          name="description"
          placeholder="Enter segment description"
        />
      </div>

      {/* Status */}
      <div>
        <InputLabel label="Status" />
        <div className="flex items-center gap-3">
          <ControlledToggleField name="isActive" defaultChecked />
          <span className="text-sm text-secondary-gary">Active / Inactive</span>
        </div>
      </div>

      <ErrorMessage error={error} />

      {/* Actions */}
      <div className="flex items-center justify-end gap-4">
        <Button
          type="button"
          onClick={onCancel}
          className="text-secondary-foreground bg-transparent hover:bg-transparent border shadow-none cursor-pointer"
        >
          Cancel
        </Button>
        <SubmitButton
          isLoading={isPending}
          label={isEditMode ? "Update" : "Create"}
        />
      </div>
    </form>
  );
}
