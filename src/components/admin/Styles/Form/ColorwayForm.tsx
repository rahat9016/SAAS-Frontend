import { ControlledCheckField } from "@/src/components/shared/FromController/ControlledCheckField";
import ControlledDatePicker from "@/src/components/shared/FromController/ControlledDatePicker";
import ControlledInputField from "@/src/components/shared/FromController/ControlledInputField";
import ControlledSelectField from "@/src/components/shared/FromController/ControlledSelectField";
import InputLabel from "@/src/components/shared/InputLabel";
import SubmitButton from "@/src/components/shared/SubmitButton";
import { Button } from "@/src/components/ui/button";
import { useFormContext } from "react-hook-form";
import {
  colorwayStandardOptions,
  ColorwayFormValues,
} from "../Schema/colorwaySchema";

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

      <div className="grid grid-cols-2 gap-3">
        <div>
          <InputLabel label="Colorway" required className="text-sm font-semibold text-secondary-dark" />
          <ControlledInputField name="colorway" placeholder="e.g. 1015" className="bg-white shadow-none" />
        </div>
        <div>
          <InputLabel label="Color Specification" className="text-sm font-semibold text-secondary-dark" />
          <ControlledInputField name="spec" placeholder="e.g. 1015" className="bg-white shadow-none" />
        </div>
      </div>

      <div>
        <InputLabel label="Description" className="text-sm font-semibold text-secondary-dark" />
        <ControlledInputField name="description" placeholder="Description" className="bg-white shadow-none" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <InputLabel label="Color Standard" required className="text-sm font-semibold text-secondary-dark" />
          <ControlledSelectField
            name="standard"
            options={colorwayStandardOptions}
            placeholder="Select standard"
            className="bg-white shadow-none"
          />
        </div>
        <div>
          <InputLabel label="Pantone" className="text-sm font-semibold text-secondary-dark" />
          <ControlledInputField name="pantone" placeholder="e.g. PANTONE® 11-0616 TCX" className="bg-white shadow-none" />
        </div>
      </div>

      <div>
        <InputLabel label="Color" required className="text-sm font-semibold text-secondary-dark" />
        <ControlledInputField name="colorHex" type="color" className="bg-white shadow-none h-10 w-20 p-1" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <InputLabel label="Color Start Date" className="text-sm font-semibold text-secondary-dark" />
          <ControlledDatePicker name="startDate" />
        </div>
        <div>
          <InputLabel label="Color End Date" className="text-sm font-semibold text-secondary-dark" />
          <ControlledDatePicker name="endDate" />
        </div>
        <div>
          <InputLabel label="Stock Clearance Date" className="text-sm font-semibold text-secondary-dark" />
          <ControlledDatePicker name="clearanceDate" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-1">
        <ControlledCheckField name="active" label="Active" />
        <ControlledCheckField name="inTheme" label="In Theme" />
        <ControlledCheckField name="sustLabelOff" label="Sust Label Off" />
        <ControlledCheckField name="planSms" label="Plan SMS" />
        <ControlledCheckField name="plan3dSms" label="Plan 3D SMS" />
        <ControlledCheckField name="actualSms" label="Actual SMS" />
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
