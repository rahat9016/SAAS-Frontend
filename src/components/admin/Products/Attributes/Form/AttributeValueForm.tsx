import ErrorMessage from "@/src/components/shared/Errors/ErrorMessage";
import ControlledInputField from "@/src/components/shared/FromController/ControlledInputField";
import ControlledSelectField from "@/src/components/shared/FromController/ControlledSelectField";
import ControlledTextareaField from "@/src/components/shared/FromController/ControlledTextareaField";
import InputLabel from "@/src/components/shared/InputLabel";
import SubmitButton from "@/src/components/shared/SubmitButton";
import { Button } from "@/src/components/ui/button";
import {
    ErrorType,
    ISelectOption,
    STATUS_OPTIONS,
} from "@/src/types/common/common";
import { useFormContext } from "react-hook-form";
import { AttributeValueFormValues } from "../Schema";

export default function AttributeValueForm({
  isEditMode = false,
  onSubmit,
  onCancel,
  attributeOptions,
  isPending = false,
  error,
}: {
  isEditMode?: boolean;
  onSubmit: (data: AttributeValueFormValues) => void;
  onCancel: () => void;
  attributeOptions: ISelectOption[];
  isPending?: boolean;
  error?: ErrorType;
}) {
  const { handleSubmit } = useFormContext<AttributeValueFormValues>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5 mt-2">
      <div>
        <InputLabel label="Attribute" required />
        <ControlledSelectField
          className="bg-light"
          name="attributeId"
          placeholder="Select attribute"
          options={attributeOptions}
        />
      </div>

      <div>
        <InputLabel label="Value" required />
        <ControlledInputField
          className="bg-light"
          name="value"
          placeholder="e.g. Red, XL, 256GB"
        />
      </div>

      <div>
        <InputLabel label="Description" />
        <ControlledTextareaField
          className="bg-light h-28"
          name="description"
          placeholder="Enter value description"
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
