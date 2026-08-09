import ControlledInputField from "@/src/components/shared/FromController/ControlledInputField";
import ControlledSelectField from "@/src/components/shared/FromController/ControlledSelectField";
import InputLabel from "@/src/components/shared/InputLabel";
import SubmitButton from "@/src/components/shared/SubmitButton";
import { Button } from "@/src/components/ui/button";
import { useFormContext } from "react-hook-form";
import { seasonStatusOptions, SeasonFormValues } from "../Schema/seasonSchema";

export default function SeasonForm({
  isEditMode = false,
  onSubmit,
  onCancel,
}: {
  isEditMode?: boolean;
  onSubmit: (data: SeasonFormValues) => void;
  onCancel: () => void;
}) {
  const { handleSubmit } = useFormContext<SeasonFormValues>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5 mt-2">
      {/* Season Name */}
      <div>
        <InputLabel label="Season Name" required />
        <ControlledInputField
          className="bg-light"
          name="season"
          placeholder="Enter season name"
        />
      </div>

      {/* Status */}
      <div>
        <InputLabel label="Status" required />
        <ControlledSelectField
          name="status"
          options={seasonStatusOptions}
          placeholder="Select status"
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
        <SubmitButton label={isEditMode ? "Update" : "Create"} />
      </div>
    </form>
  );
}
