import ControlledInputField from "@/src/components/shared/FromController/ControlledInputField";
import ControlledTextareaField from "@/src/components/shared/FromController/ControlledTextareaField";
import ControlledSwitchField from "@/src/components/shared/FromController/ControlledSwitchField";
import { FileUploadController } from "@/src/components/shared/FromController/FileUploadController";
import InputLabel from "@/src/components/shared/InputLabel";
import SubmitButton from "@/src/components/shared/SubmitButton";
import { Button } from "@/src/components/ui/button";
import { useFormContext } from "react-hook-form";
import { BrandFormValues } from "../Schema/brandSchema";

export default function BrandForm({
  isEditMode = false,
  onSubmit,
  onCancel,
  isPending = false,
}: {
  isEditMode?: boolean;
  onSubmit: (data: BrandFormValues) => void;
  onCancel: () => void;
  isPending?: boolean;
}) {
  const { handleSubmit } = useFormContext<BrandFormValues>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5 mt-2">
      {/* Title */}
      <div>
        <InputLabel label="Title" required />
        <ControlledInputField
          className="bg-light"
          name="title"
          placeholder="Enter brand title"
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

      {/* Logo Upload */}
      <div>
        <InputLabel label="Logo (PNG only)" />
        <FileUploadController
          name="logo"
          label="Upload logo"
          accept={["image/png"]}
        />
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
        <SubmitButton
          isLoading={isPending}
          label={isEditMode ? "Update" : "Create"}
        />
      </div>
    </form>
  );
}
