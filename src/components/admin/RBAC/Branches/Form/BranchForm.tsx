import ErrorMessage from "@/src/components/shared/Errors/ErrorMessage";
import ControlledInputField from "@/src/components/shared/FromController/ControlledInputField";
import ControlledSwitchField from "@/src/components/shared/FromController/ControlledSwitchField";
import InputLabel from "@/src/components/shared/InputLabel";
import SubmitButton from "@/src/components/shared/SubmitButton";
import { Button } from "@/src/components/ui/button";
import { ErrorType } from "@/src/types/common/common";
import { useFormContext } from "react-hook-form";
import { BranchFormValues } from "../Schema/branchSchema";

export default function BranchForm({
  isEditMode = false,
  onSubmit,
  onCancel,
  isPending = false,
  error,
}: {
  isEditMode?: boolean;
  onSubmit: (data: BranchFormValues) => void;
  onCancel: () => void;
  isPending?: boolean;
  error?: ErrorType;
}) {
  const { handleSubmit } = useFormContext<BranchFormValues>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5 mt-2">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <InputLabel label="Name" required />
          <ControlledInputField
            className="bg-light"
            name="name"
            placeholder="Gulshan Flagship"
          />
        </div>
        <div>
          <InputLabel label="Code" required />
          <ControlledInputField className="bg-light" name="code" placeholder="DHK-01" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <InputLabel label="Contact" />
          <ControlledInputField className="bg-light" name="contact" placeholder="+8801…" />
        </div>
        <div>
          <InputLabel label="Country" />
          <ControlledInputField className="bg-light" name="country" placeholder="Germany" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <InputLabel label="City" />
          <ControlledInputField className="bg-light" name="city" placeholder="Dhaka" />
        </div>
        <div>
          <InputLabel label="Area" />
          <ControlledInputField className="bg-light" name="area" placeholder="Gulshan" />
        </div>
      </div>

      <div>
        <InputLabel label="Address" />
        <ControlledInputField className="bg-light" name="address" placeholder="Street, building…" />
      </div>

      <ControlledSwitchField
        name="isActive"
        label="Active"
        description="Active branches can be assigned users"
      />

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
