import ErrorMessage from "@/src/components/shared/Errors/ErrorMessage";
import ControlledInputField from "@/src/components/shared/FromController/ControlledInputField";
import ControlledSelectField from "@/src/components/shared/FromController/ControlledSelectField";
import InputLabel from "@/src/components/shared/InputLabel";
import SubmitButton from "@/src/components/shared/SubmitButton";
import { Button } from "@/src/components/ui/button";
import { ErrorType } from "@/src/types/common/common";
import { useFormContext } from "react-hook-form";
import { UserFormValues } from "../Schema/userSchema";

export default function UserForm({
  isEditMode = false,
  roleOptions,
  onSubmit,
  onCancel,
  isPending = false,
  error,
}: {
  isEditMode?: boolean;
  roleOptions: { label: string; value: string }[];
  onSubmit: (data: UserFormValues) => void;
  onCancel: () => void;
  isPending?: boolean;
  error?: ErrorType;
}) {
  const { handleSubmit, getValues } = useFormContext<UserFormValues>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5 mt-2">
      <div>
        <InputLabel label="Full Name" />
        <ControlledInputField className="bg-light" name="name" placeholder="Jane Doe" />
      </div>

      <div>
        <InputLabel label="Email" required />
        {isEditMode ? (
          <div className="bg-light px-3 py-2 rounded-md text-sm text-secondary-foreground">
            {getValues("email")}
          </div>
        ) : (
          <ControlledInputField
            className="bg-light"
            name="email"
            type="email"
            placeholder="user@company.com"
          />
        )}
      </div>

      <div>
        <InputLabel label={isEditMode ? "New Password (optional)" : "Password"} required={!isEditMode} />
        <ControlledInputField
          className="bg-light"
          name="password"
          type="password"
          placeholder="••••••••"
        />
      </div>

      <div>
        <InputLabel label="Role" required />
        <ControlledSelectField name="roleId" options={roleOptions} placeholder="Select role" />
        {roleOptions.length === 0 && (
          <p className="text-xs text-amber-500 mt-1">
            No roles in this branch yet — create one first.
          </p>
        )}
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
