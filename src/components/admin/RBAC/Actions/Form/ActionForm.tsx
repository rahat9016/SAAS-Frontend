import ErrorMessage from "@/src/components/shared/Errors/ErrorMessage";
import ControlledInputField from "@/src/components/shared/FromController/ControlledInputField";
import InputLabel from "@/src/components/shared/InputLabel";
import SubmitButton from "@/src/components/shared/SubmitButton";
import { Button } from "@/src/components/ui/button";
import { ErrorType } from "@/src/types/common/common";
import { useFormContext } from "react-hook-form";
import { ActionFormValues } from "../Schema/actionSchema";

export default function ActionForm({
  isEditMode = false,
  onSubmit,
  onCancel,
  isPending = false,
  error,
}: {
  isEditMode?: boolean;
  onSubmit: (data: ActionFormValues) => void;
  onCancel: () => void;
  isPending?: boolean;
  error?: ErrorType;
}) {
  const { handleSubmit, getValues } = useFormContext<ActionFormValues>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5 mt-2">
      <div>
        <InputLabel label="Key" required />
        {isEditMode ? (
          <>
            <code className="block bg-light px-3 py-2 rounded-md text-sm text-secondary-foreground">
              {getValues("key")}
            </code>
            <p className="text-xs text-gray-400 mt-1">Key cannot be changed.</p>
          </>
        ) : (
          <ControlledInputField
            className="bg-light"
            name="key"
            placeholder="e.g. approve"
          />
        )}
      </div>

      <div>
        <InputLabel label="Label" required />
        <ControlledInputField
          className="bg-light"
          name="label"
          placeholder="e.g. Approve"
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
        <SubmitButton isLoading={isPending} label={isEditMode ? "Update" : "Create"} />
      </div>
    </form>
  );
}
