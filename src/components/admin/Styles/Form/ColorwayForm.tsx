import ControlledInputField from "@/src/components/shared/FromController/ControlledInputField";
import InputLabel from "@/src/components/shared/InputLabel";
import SubmitButton from "@/src/components/shared/SubmitButton";
import { Button } from "@/src/components/ui/button";
import { useFormContext } from "react-hook-form";
import { ColorwayFormValues } from "../Schema/colorwaySchema";

export default function ColorwayForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: ColorwayFormValues) => void;
  onCancel: () => void;
}) {
  const { handleSubmit } = useFormContext<ColorwayFormValues>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4 mt-2">
      <div>
        <InputLabel label="Color Marketing Name" required className="text-sm font-semibold text-secondary-dark" />
        <ControlledInputField name="name" placeholder="e.g. yellow" className="bg-white shadow-none" />
      </div>

      <div>
        <InputLabel label="Colorway" required className="text-sm font-semibold text-secondary-dark" />
        <ControlledInputField name="colorway" placeholder="e.g. 1015" className="bg-white shadow-none" />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4 pt-2">
        <Button
          type="button"
          onClick={onCancel}
          className="text-secondary-foreground bg-transparent hover:bg-transparent border shadow-none cursor-pointer"
        >
          Cancel
        </Button>
        <SubmitButton label="Save" />
      </div>
    </form>
  );
}
