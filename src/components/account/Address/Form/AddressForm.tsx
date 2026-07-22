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

const DIVISIONS = [
  "Berlin",
  "Munich",
  "Hamburg",
  "Frankfurt",
  "Cologne",
  "Stuttgart",
  "Düsseldorf",
  "Leipzig",
].map((d) => ({ label: d, value: d }));

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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Receiver's info */}
        <div className="sm:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            Receiver&apos;s info
          </p>
        </div>
        <div>
          <InputLabel label="Last Name" required />
          <ControlledInputField name="lastName" placeholder="Enter your last name" className="bg-light" />
        </div>
        <div>
          <InputLabel label="First Name" required />
          <ControlledInputField name="firstName" placeholder="Enter your first name" className="bg-light" />
        </div>
        <div>
          <InputLabel label="Phone" required />
          <ControlledInputField name="phone" placeholder="+880 1XX XXXX XXX" className="bg-light" />
        </div>
        <div>
          <InputLabel label="Email" />
          <ControlledInputField name="email" type="email" placeholder="your@email.com (optional)" className="bg-light" />
        </div>

        <div className="sm:col-span-2 mt-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            Address Details
          </p>
        </div>
        <div className="sm:col-span-2">
          <InputLabel label="Country" required />
          <ControlledInputField name="country" placeholder="e.g. Germany" className="bg-light" />
        </div>
        <div className="sm:col-span-2">
          <InputLabel label="Street, Area" required />
          <ControlledInputField name="addressLine1" placeholder="Street, area" className="bg-light" />
        </div>
        <div>
          <InputLabel label="Apartment/Suite" />
          <ControlledInputField name="addressLine2" placeholder="Apartment, suite, etc. (optional)" className="bg-light" />
        </div>
        <div>
          <InputLabel label="House Number / Area" required />
          <ControlledInputField name="area" placeholder="e.g. House 12" className="bg-light" />
        </div>
        <div>
          <InputLabel label="City" required />
          <ControlledSelectField name="city" options={DIVISIONS} placeholder="Select city" className="bg-light" />
        </div>
        <div>
          <InputLabel label="Postal Code" />
          <ControlledInputField name="zipCode" placeholder="e.g. 1205" className="bg-light" />
        </div>
      </div>

      <div className="mt-4">
        <ControlledSwitchField
          name="isDefault"
          label="Default Address"
          description="Use this as your default delivery address"
        />
      </div>

      <div className="mt-4">
        <InputLabel label="Address Type" required />
        <ControlledSelectField
          className="bg-light"
          name="addressType"
          placeholder="Select address type"
          options={ADDRESS_TYPE_OPTIONS}
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
