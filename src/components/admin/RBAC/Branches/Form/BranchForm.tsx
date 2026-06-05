import ErrorMessage from "@/src/components/shared/Errors/ErrorMessage";
import ControlledInputField from "@/src/components/shared/FromController/ControlledInputField";
import ControlledSelectField from "@/src/components/shared/FromController/ControlledSelectField";
import InputLabel from "@/src/components/shared/InputLabel";
import SubmitButton from "@/src/components/shared/SubmitButton";
import { Button } from "@/src/components/ui/button";
import { ErrorType } from "@/src/types/common/common";
import { useFormContext, useWatch } from "react-hook-form";
import ResourcePermissionMatrix, {
  type SelectedGrants,
} from "../../shared/ResourcePermissionMatrix";
import { BranchFormValues } from "../Schema/branchSchema";

export default function BranchForm({
  orgOptions,
  onSubmit,
  onCancel,
  isPending = false,
  error,
}: {
  orgOptions: { label: string; value: string }[];
  onSubmit: (data: BranchFormValues) => void;
  onCancel: () => void;
  isPending?: boolean;
  error?: ErrorType;
}) {
  const { handleSubmit, control, setValue } = useFormContext<BranchFormValues>();
  const grants = (useWatch({ control, name: "permissions" }) ?? {}) as SelectedGrants;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5 mt-2">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <InputLabel label="Name" required />
          <ControlledInputField className="bg-light" name="name" placeholder="Dhaka Main" />
        </div>
        <div>
          <InputLabel label="Code" required />
          <ControlledInputField className="bg-light" name="code" placeholder="DHK-01" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <InputLabel label="Location" />
          <ControlledInputField className="bg-light" name="location" placeholder="City, Country" />
        </div>
        <div>
          <InputLabel label="Organization" required />
          <ControlledSelectField
            name="organizationId"
            options={orgOptions}
            placeholder="Select organization"
          />
        </div>
      </div>

      <div>
        <InputLabel label="Permission Scope" />
        <p className="text-xs text-gray-400 mb-2 -mt-1">
          The ceiling for every role created inside this branch.
        </p>
        <ResourcePermissionMatrix
          selected={grants}
          onChange={(next) => setValue("permissions", next)}
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
        <SubmitButton isLoading={isPending} label="Create" />
      </div>
    </form>
  );
}
