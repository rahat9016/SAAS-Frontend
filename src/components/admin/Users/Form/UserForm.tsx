import ControlledInputField from "@/src/components/shared/FromController/ControlledInputField";
import { FileUploadController } from "@/src/components/shared/FromController/FileUploadController";
import InputLabel from "@/src/components/shared/InputLabel";
import SubmitButton from "@/src/components/shared/SubmitButton";
import { Button } from "@/src/components/ui/button";
import { useFormContext } from "react-hook-form";
import { UserFormValues } from "../Schema/userSchema";

export default function UserForm({
  onSubmit,
  onCancel,
  isPending = false,
}: {
  onSubmit: (data: UserFormValues) => void;
  onCancel: () => void;
  isPending?: boolean;
}) {
  const { handleSubmit } = useFormContext<UserFormValues>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5 mt-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <InputLabel label="First Name" required />
          <ControlledInputField
            className="bg-light"
            name="firstName"
            placeholder="Enter first name"
          />
        </div>

        <div>
          <InputLabel label="Last Name" required />
          <ControlledInputField
            className="bg-light"
            name="lastName"
            placeholder="Enter last name"
          />
        </div>
      </div>

      <div>
        <InputLabel label="Phone" />
        <ControlledInputField
          className="bg-light"
          name="phone"
          placeholder="Enter phone number"
        />
      </div>

      <div>
        <InputLabel label="Profile Picture (JPEG/PNG, max 2MB)" />
        <FileUploadController
          name="profilePicture"
          label="Upload profile image"
          accept={["image/jpeg", "image/png"]}
        />
      </div>

      <div className="flex items-center justify-end gap-4">
        <Button
          type="button"
          onClick={onCancel}
          className="text-secondary-foreground bg-transparent hover:bg-transparent border shadow-none cursor-pointer"
        >
          Cancel
        </Button>
        <SubmitButton isLoading={isPending} label="Update" />
      </div>
    </form>
  );
}
