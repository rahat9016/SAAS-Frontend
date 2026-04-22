import ErrorMessage from "@/src/components/shared/Errors/ErrorMessage";
import ControlledInputField from "@/src/components/shared/FromController/ControlledInputField";
import ControlledSwitchField from "@/src/components/shared/FromController/ControlledSwitchField";
import ControlledTextareaField from "@/src/components/shared/FromController/ControlledTextareaField";
import { FileUploadController } from "@/src/components/shared/FromController/FileUploadController";
import InputLabel from "@/src/components/shared/InputLabel";
import SubmitButton from "@/src/components/shared/SubmitButton";
import { Button } from "@/src/components/ui/button";
import { ErrorType } from "@/src/types/common/common";
import { useFormContext } from "react-hook-form";
import { BrandFormValues } from "../Schema/brandSchema";

export default function BrandForm({
  isEditMode = false,
  onSubmit,
  onCancel,
  isPending = false,
  error,
}: {
  isEditMode?: boolean;
  onSubmit: (data: BrandFormValues) => void;
  onCancel: () => void;
  isPending?: boolean;
  error?: ErrorType;
}) {
  const { handleSubmit } = useFormContext<BrandFormValues>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5 mt-2">
      {/* Name */}
      <div>
        <InputLabel label="Name" required />
        <ControlledInputField
          className="bg-light"
          name="name"
          placeholder="Enter brand name"
        />
      </div>

      {/* Description */}
      <div>
        <InputLabel label="Description" />
        <ControlledTextareaField
          className="bg-light"
          name="description"
          placeholder="Enter brand description"
        />
      </div>

      {/* Is Active */}
      <div>
        <ControlledSwitchField
          name="isActive"
          label="Active"
          description="Enable or disable this brand"
        />
      </div>

      {/* Icon Upload */}
      <div>
        <InputLabel label="Icon (PNG only)" />
        <FileUploadController
          name="icon"
          label="Upload icon"
          accept={["image/png"]}
        />
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
