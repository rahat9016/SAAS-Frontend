import ControlledInputField from "@/src/components/shared/FromController/ControlledInputField";
import ControlledSelectField from "@/src/components/shared/FromController/ControlledSelectField";
import InputLabel from "@/src/components/shared/InputLabel";
import SubmitButton from "@/src/components/shared/SubmitButton";
import { Button } from "@/src/components/ui/button";
import { useFormContext } from "react-hook-form";
import { CategoryFormValues } from "../Schema/categorySchema";

export default function CategoryForm({
  isEditMode = false,
  onSubmit,
  onCancel,
  isPending = false,
  parentCategoryOptions = [],
}: {
  isEditMode?: boolean;
  onSubmit: (data: CategoryFormValues) => void;
  onCancel: () => void;
  isPending?: boolean;
  parentCategoryOptions?: { label: string; value: string }[];
}) {
  const { handleSubmit } = useFormContext<CategoryFormValues>();

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

      {/* Parent Category */}
      <div>
        <InputLabel label="Parent Category" required />
        <ControlledSelectField
          name="parentCategoryId"
          placeholder="Select parent category"
          options={parentCategoryOptions}
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
