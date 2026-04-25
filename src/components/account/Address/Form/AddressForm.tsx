import ErrorMessage from "@/src/components/shared/Errors/ErrorMessage";
import ControlledInputField from "@/src/components/shared/FromController/ControlledInputField";
import ControlledSelectField from "@/src/components/shared/FromController/ControlledSelectField";
import ControlledSwitchField from "@/src/components/shared/FromController/ControlledSwitchField";
import InputLabel from "@/src/components/shared/InputLabel";
import SubmitButton from "@/src/components/shared/SubmitButton";
import { Button } from "@/src/components/ui/button";
import { useFormContext } from "react-hook-form";
import { AddressFormValues } from "../Schema/addressSchema";
import { IAddressFormProps } from "../types";

const ADDRESS_TYPE_OPTIONS = [
  { label: "Home", value: "HOME" },
  { label: "Office", value: "OFFICE" },
  { label: "Other", value: "OTHER" },
];

export default function AddressForm({
  isEditMode = false,
  onSubmit,
  onCancel,
  isPending = false,
  error,
}: IAddressFormProps) {
  const { handleSubmit } = useFormContext<AddressFormValues>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4 mt-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <InputLabel label="Full Name" required />
          <ControlledInputField
            className="bg-light"
            name="fullName"
            placeholder="Enter full name"
          />
        </div>
        <div>
          <InputLabel label="Phone" required />
          <ControlledInputField
            className="bg-light"
            name="phone"
            placeholder="Enter phone"
          />
        </div>
      </div>

      <div>
        <InputLabel label="Address Type" required />
        <ControlledSelectField
          className="bg-light"
          name="addressType"
          placeholder="Select address type"
          options={ADDRESS_TYPE_OPTIONS}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <InputLabel label="Country" required />
          <ControlledInputField
            className="bg-light"
            name="country"
            placeholder="Enter country"
          />
        </div>
        <div>
          <InputLabel label="City" required />
          <ControlledInputField
            className="bg-light"
            name="city"
            placeholder="Enter city"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <InputLabel label="Region" />
          <ControlledInputField
            className="bg-light"
            name="region"
            placeholder="Enter region"
          />
        </div>
        <div>
          <InputLabel label="Area" />
          <ControlledInputField
            className="bg-light"
            name="area"
            placeholder="Enter area"
          />
        </div>
      </div>

      <div>
        <InputLabel label="Address Line 1" required />
        <ControlledInputField
          className="bg-light"
          name="addressLine1"
          placeholder="House no, street"
        />
      </div>

      <div>
        <InputLabel label="Address Line 2" />
        <ControlledInputField
          className="bg-light"
          name="addressLine2"
          placeholder="Apartment, landmark"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <InputLabel label="Zip Code" />
          <ControlledInputField
            className="bg-light"
            name="zipCode"
            placeholder="Enter zip code"
          />
        </div>
        <div>
          <InputLabel label="Company" />
          <ControlledInputField
            className="bg-light"
            name="company"
            placeholder="Enter company"
          />
        </div>
      </div>

      <div>
        <ControlledSwitchField
          name="isDefault"
          label="Default Address"
          description="Use this as your default delivery address"
        />
      </div>

      <ErrorMessage error={error} />

      <div className="flex items-center justify-end gap-4 pt-2">
        <Button
          type="button"
          onClick={onCancel}
          className="text-secondary-foreground bg-transparent hover:bg-transparent border shadow-none cursor-pointer"
        >
          Cancel
        </Button>
        <SubmitButton
          isLoading={isPending}
          label={isEditMode ? "Update Address" : "Create Address"}
        />
      </div>
    </form>
  );
}
