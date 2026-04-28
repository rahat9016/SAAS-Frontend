import ErrorMessage from "@/src/components/shared/Errors/ErrorMessage";
import ControlledInputField from "@/src/components/shared/FromController/ControlledInputField";
import ControlledSelectField from "@/src/components/shared/FromController/ControlledSelectField";
import ControlledTextareaField from "@/src/components/shared/FromController/ControlledTextareaField";
import InputLabel from "@/src/components/shared/InputLabel";
import SubmitButton from "@/src/components/shared/SubmitButton";
import { Button } from "@/src/components/ui/button";
import { ErrorType, STATUS_OPTIONS } from "@/src/types/common/common";
import { useFormContext } from "react-hook-form";
import { AttributeFormValues } from "../Schema";

export default function AttributeForm({
  isEditMode = false,
  onSubmit,
  onCancel,
  isPending = false,
  error,
}: {
  isEditMode?: boolean;
  onSubmit: (data: AttributeFormValues) => void;
  onCancel: () => void;
  isPending?: boolean;
  error?: ErrorType;
}) {
  const { handleSubmit } = useFormContext<AttributeFormValues>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5 mt-2">
      <div>
        <InputLabel label="Attribute Name" required />
        <ControlledInputField
          className="bg-light"
          name="name"
          placeholder="e.g. Color, Size, Weight"
        />
      </div>

      <div>
        <InputLabel label="Description" />
        <ControlledTextareaField
          className="bg-light h-28"
          name="description"
          placeholder="Enter attribute description"
        />
      </div>

      <div>
        <InputLabel label="Status" required />
        <ControlledSelectField
          className="bg-light"
          name="status"
          placeholder="Select status"
          options={STATUS_OPTIONS}
        />
      </div>

      <ErrorMessage error={error} />

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
