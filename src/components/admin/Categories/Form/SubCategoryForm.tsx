import ControlledInputField from "@/src/components/shared/FromController/ControlledInputField";
import ControlledSelectField from "@/src/components/shared/FromController/ControlledSelectField";
import ControlledTextareaField from "@/src/components/shared/FromController/ControlledTextareaField";
import InputLabel from "@/src/components/shared/InputLabel";
import SubmitButton from "@/src/components/shared/SubmitButton";
import { Button } from "@/src/components/ui/button";
import { useFormContext } from "react-hook-form";
import { SubCategoryFormValues } from "../Schema/subCategorySchema";

export default function SubCategoryForm({
  isEditMode = false,
  onSubmit,
  onCancel,
  isPending = false,
  categoryOptions = [],
}: {
  isEditMode?: boolean;
  onSubmit: (data: SubCategoryFormValues) => void;
  onCancel: () => void;
  isPending?: boolean;
  categoryOptions?: { label: string; value: string }[];
}) {
  const { handleSubmit } = useFormContext<SubCategoryFormValues>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5 mt-2">
      {/* Name */}
      <div>
        <InputLabel label="Name" required />
        <ControlledInputField
          className="bg-light"
          name="name"
          placeholder="Enter sub category name"
        />
      </div>

      {/* Description */}
      <div>
        <InputLabel label="Description" />
        <ControlledTextareaField
          className="bg-light"
          name="description"
          placeholder="Enter sub category description"
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
