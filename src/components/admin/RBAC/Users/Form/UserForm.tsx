import ErrorMessage from "@/src/components/shared/Errors/ErrorMessage";
import ControlledInputField from "@/src/components/shared/FromController/ControlledInputField";
import ControlledSelectField from "@/src/components/shared/FromController/ControlledSelectField";
import InputLabel from "@/src/components/shared/InputLabel";
import SubmitButton from "@/src/components/shared/SubmitButton";
import { Button } from "@/src/components/ui/button";
import { ErrorType } from "@/src/types/common/common";
import { useFormContext } from "react-hook-form";
import { UserFormValues } from "../Schema/userSchema";

const GENDER_OPTIONS = [
  { label: "Male", value: "MALE" },
  { label: "Female", value: "FEMALE" },
  { label: "Other", value: "OTHER" },
];

export default function UserForm({
  isEditMode = false,
  isSuperAdmin,
  roleOptions,
  branchOptions,
  onSubmit,
  onCancel,
  isPending = false,
  error,
}: {
  isEditMode?: boolean;
  isSuperAdmin: boolean;
  roleOptions: { label: string; value: string }[];
  branchOptions: { label: string; value: string }[];
  onSubmit: (data: UserFormValues) => void;
  onCancel: () => void;
  isPending?: boolean;
  error?: ErrorType;
}) {
  const { handleSubmit, getValues } = useFormContext<UserFormValues>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5 mt-2">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <InputLabel label="First Name" required />
          <ControlledInputField className="bg-light" name="firstName" placeholder="Jane" />
        </div>
        <div>
          <InputLabel label="Last Name" />
          <ControlledInputField className="bg-light" name="lastName" placeholder="Doe" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <InputLabel label="Email" required />
          {isEditMode ? (
            <div className="bg-light px-3 py-2 rounded-md text-sm text-secondary-foreground">
              {getValues("email")}
            </div>
          ) : (
            <ControlledInputField className="bg-light" name="email" type="email" placeholder="user@company.com" />
          )}
        </div>
        <div>
          <InputLabel label="Phone" />
          <ControlledInputField className="bg-light" name="phone" placeholder="+8801…" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <InputLabel label={isEditMode ? "New Password (optional)" : "Password"} required={!isEditMode} />
          <ControlledInputField className="bg-light" name="password" type="password" placeholder="••••••••" />
        </div>
        <div>
          <InputLabel label="Role" />
          <ControlledSelectField name="roleId" options={roleOptions} placeholder="Select role" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {isSuperAdmin && (
          <div>
            <InputLabel label="Branch" />
            <ControlledSelectField name="branchId" options={branchOptions} placeholder="Select branch" />
          </div>
        )}
        <div>
          <InputLabel label="Gender" />
          <ControlledSelectField name="gender" options={GENDER_OPTIONS} placeholder="Select gender" />
        </div>
      </div>

      <p className="text-xs text-gray-400">
        Permissions (routes &amp; actions) are assigned separately from the user list.
      </p>

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
