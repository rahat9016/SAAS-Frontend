"use client";

import ProfileForm from "@/src/components/account/Form/ProfileForm";
import {
    ProfileFormValues,
    profileSchema,
} from "@/src/components/account/Schema/profileSchema";
import { usePatch } from "@/src/hooks/usePatch";
import { useAppSelector } from "@/src/lib/redux/hooks";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function MyProfile() {
  const { userInformation } = useAppSelector((state) => state.auth);

  const methods = useForm<ProfileFormValues>({
    resolver: yupResolver(profileSchema) as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      profilePicture: undefined,
    },
  });

  // Set initial values when userInformation is available
  useEffect(() => {
    if (userInformation) {
      methods.reset({
        firstName: userInformation.firstName || "",
        lastName: userInformation.lastName || "",
        email: userInformation.email || "",
        phone: userInformation.phone || "",
        profilePicture: userInformation.profilePicture || undefined,
      });
    }
  }, [userInformation, methods]);

  const {
    mutate: updateProfile,
    isPending,
    error,
    reset: resetError,
  } = usePatch(() => {
    toast.success("Profile updated successfully!");
  }, [["user"]]);

  const handleCancel = () => {
    resetError();
    methods.reset();
  };

  const onSubmit = (values: ProfileFormValues) => {
    if (!userInformation?.id) {
      toast.error("User ID not found");
      return;
    }

    const formData = new FormData();
    const profilePictureValue = (
      values as ProfileFormValues & { profilePicture?: File | string | null }
    ).profilePicture;

    formData.append("firstName", values.firstName);
    formData.append("lastName", values.lastName);
    formData.append("phone", values.phone || "");

    if (profilePictureValue instanceof File) {
      formData.append("profilePicture", profilePictureValue);
    } else if (
      typeof profilePictureValue === "string" &&
      profilePictureValue.trim()
    ) {
      formData.append("profilePicture", profilePictureValue);
    }

    updateProfile({
      url: `/user/profile/${userInformation.id}`,
      data: formData,
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
          My Profile
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your personal information
        </p>
      </div>

      {/* Profile Form with Picture Section */}
      <FormProvider {...methods}>
        <ProfileForm
          onSubmit={onSubmit}
          onCancel={handleCancel}
          isPending={isPending}
          error={error}
          userEmail={userInformation?.email}
          userProfilePicture={userInformation?.profilePicture || undefined}
          firstName={userInformation?.firstName || ""}
          lastName={userInformation?.lastName || ""}
        />
      </FormProvider>
    </div>
  );
}
