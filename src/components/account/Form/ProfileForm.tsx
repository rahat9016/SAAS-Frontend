import ErrorMessage from "@/src/components/shared/Errors/ErrorMessage";
import ControlledInputField from "@/src/components/shared/FromController/ControlledInputField";
import InputLabel from "@/src/components/shared/InputLabel";
import SubmitButton from "@/src/components/shared/SubmitButton";
import { Button } from "@/src/components/ui/button";
import { Mail } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { ProfileFormValues } from "../Schema/profileSchema";
import { IProfileForm } from "../types";
import ProfilePictureSection from "./ProfilePictureSection";

export default function ProfileForm({
  onSubmit,
  onCancel,
  isPending = false,
  error,
  userEmail,
  userProfilePicture,
  firstName = "",
  lastName = "",
}: IProfileForm) {
  const { handleSubmit } = useFormContext<ProfileFormValues>();

  return (
    <>
      {/* Profile Picture Section */}
      <ProfilePictureSection
        firstName={firstName}
        lastName={lastName}
        email={userEmail}
        initialProfilePicture={userProfilePicture}
      />

      {/* Personal Information Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        {/* First Name & Last Name */}
        <div className="bg-white rounded-xl border border-light-silver p-6 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900 mb-5">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <InputLabel label="First Name" required />
              <ControlledInputField
                name="firstName"
                placeholder="Enter first name"
              />
            </div>
            <div>
              <InputLabel label="Last Name" required />
              <ControlledInputField
                name="lastName"
                placeholder="Enter last name"
              />
            </div>
          </div>

          {/* Email (Read-only) */}
          <div className="mt-5">
            <InputLabel label="Email Address" />
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="email"
                value={userEmail || ""}
                disabled
                className="w-full h-11 pl-10 pr-4 rounded-lg border border-gray-200 bg-gray-100 text-sm text-gray-600 focus:outline-none disabled:cursor-not-allowed"
                placeholder="Email address"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1 pl-2">
              Email cannot be changed
            </p>
          </div>

          {/* Phone Number */}
          <div className="mt-5">
            <InputLabel label="Phone Number" required />
            <ControlledInputField
              name="phone"
              type="tel"
              placeholder="Enter phone number"
            />
          </div>
        </div>

        <ErrorMessage error={error} />

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <Button
            type="button"
            onClick={onCancel}
            className="text-secondary-foreground bg-transparent hover:bg-transparent border shadow-none cursor-pointer"
          >
            Cancel
          </Button>
          <SubmitButton isLoading={isPending} label="Save Changes" />
        </div>
      </form>
    </>
  );
}
