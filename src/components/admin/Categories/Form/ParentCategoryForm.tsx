import ControlledInputField from "@/src/components/shared/FromController/ControlledInputField";
import ControlledTextareaField from "@/src/components/shared/FromController/ControlledTextareaField";
import { FileUploadController } from "@/src/components/shared/FromController/FileUploadController";
import InputLabel from "@/src/components/shared/InputLabel";
import SubmitButton from "@/src/components/shared/SubmitButton";
import { Button } from "@/src/components/ui/button";
import { useFormContext } from "react-hook-form";
import { ParentCategoryFormValues } from "../Schema/parentCategorySchema";

export default function ParentCategoryForm({
  isEditMode = false,
  onSubmit,
  onCancel,
  isPending = false,
}: {
  isEditMode?: boolean;
  onSubmit: (data: ParentCategoryFormValues) => void;
  onCancel: () => void;
  isPending?: boolean;
}) {
  const { handleSubmit } = useFormContext<ParentCategoryFormValues>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5 mt-2">
      {/* Name */}
      <div>
        <InputLabel label="Name" required />
        <ControlledInputField
          className="bg-light"
          name="name"
          placeholder="Enter category name"
        />
      </div>

      {/* Description */}
      <div>
        <InputLabel label="Description" />
        <ControlledTextareaField
          className="bg-light"
          name="description"
          placeholder="Enter category description"
        />
      </div>

      {/* Icon Upload */}
      <div>
        <InputLabel label="Icon (SVG or PNG)" />
        <FileUploadController
          name="icon"
          label="Upload icon"
          accept={["image/svg+xml", "image/png"]}
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
