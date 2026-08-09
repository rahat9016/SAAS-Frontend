import ControlledInputField from "@/src/components/shared/FromController/ControlledInputField";
import ControlledTextareaField from "@/src/components/shared/FromController/ControlledTextareaField";
import ControlledToggleField from "@/src/components/shared/FromController/ControlledToggleField";
import InputLabel from "@/src/components/shared/InputLabel";
import SubmitButton from "@/src/components/shared/SubmitButton";
import { Button } from "@/src/components/ui/button";
import { useFormContext } from "react-hook-form";
import { GroupFormValues } from "../Schema/groupSchema";

export default function GroupForm({
  isEditMode = false,
  onSubmit,
  onCancel,
}: {
  isEditMode?: boolean;
  onSubmit: (data: GroupFormValues) => void;
  onCancel: () => void;
}) {
  const { handleSubmit } = useFormContext<GroupFormValues>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5 mt-2">
      {/* Name */}
      <div>
        <InputLabel label="Name" required />
        <ControlledInputField
          className="bg-light"
          name="name"
          placeholder="e.g. Women, Men, Kids"
        />
      </div>

      {/* Description */}
      <div>
        <InputLabel label="Description" />
        <ControlledTextareaField
          className="bg-light"
          name="description"
          placeholder="Enter group description"
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
