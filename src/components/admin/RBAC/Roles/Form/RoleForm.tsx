import ErrorMessage from "@/src/components/shared/Errors/ErrorMessage";
import ControlledInputField from "@/src/components/shared/FromController/ControlledInputField";
import InputLabel from "@/src/components/shared/InputLabel";
import SubmitButton from "@/src/components/shared/SubmitButton";
import { Button } from "@/src/components/ui/button";
import { ErrorType } from "@/src/types/common/common";
import { useFormContext, useWatch } from "react-hook-form";
import ResourcePermissionMatrix, {
  type SelectedGrants,
} from "../../shared/ResourcePermissionMatrix";
import { RoleFormValues } from "../Schema/roleSchema";

export default function RoleForm({
  isEditMode = false,
  ceiling,
  onSubmit,
  onCancel,
  isPending = false,
  error,
}: {
  isEditMode?: boolean;
  /** Branch scope ceiling; omit for global (SUPER_ADMIN) roles = full. */
  ceiling?: SelectedGrants;
  onSubmit: (data: RoleFormValues) => void;
  onCancel: () => void;
  isPending?: boolean;
  error?: ErrorType;
}) {
  const { handleSubmit, control, setValue } = useFormContext<RoleFormValues>();
  const grants = (useWatch({ control, name: "permissions" }) ?? {}) as SelectedGrants;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5 mt-2">
      <div>
        <InputLabel label="Role Name" required />
        <ControlledInputField className="bg-light" name="name" placeholder="e.g. Orders Manager" />
      </div>

      <div>
        <InputLabel label="Permissions" />
        <ResourcePermissionMatrix
          selected={grants}
          onChange={(next) => setValue("permissions", next)}
          scope={ceiling}
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
