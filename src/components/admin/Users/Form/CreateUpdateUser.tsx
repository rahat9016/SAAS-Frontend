"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/src/components/ui/dialog";
import { usePatch } from "@/src/hooks/usePatch";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { UserFormValues, userSchema } from "../Schema/userSchema";
import { IUser } from "../types";
import UserForm from "./UserForm";

interface CreateUpdateUserProps {
  isOpen: boolean;
  onClose: () => void;
  initialValues?: IUser;
}

export default function CreateUpdateUser({
  isOpen,
  onClose,
  initialValues,
}: CreateUpdateUserProps) {
  const methods = useForm<UserFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(userSchema) as any,
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      profilePicture: null,
    },
  });

  useEffect(() => {
    if (isOpen && initialValues) {
      methods.reset({
        firstName: initialValues.firstName || "",
        lastName: initialValues.lastName || "",
        phone: initialValues.phone || "",
        profilePicture: initialValues.profilePicture || "",
      });
    } else if (!isOpen) {
      methods.reset({
        firstName: "",
        lastName: "",
        phone: "",
        profilePicture: null,
      });
    }
  }, [isOpen, initialValues, methods]);

  const { mutate: updateMutate, isPending } = usePatch(() => {
    toast.success("User updated successfully!");
    onClose();
  }, [["users"]]);

  const onSubmit = (values: UserFormValues) => {
    if (!initialValues?.id) return;

    const formData = new FormData();
    formData.append("firstName", values.firstName);
    formData.append("lastName", values.lastName);
    formData.append("phone", values.phone || "");

    if (values.profilePicture) {
      formData.append("profilePicture", values.profilePicture);
    }

    updateMutate({
      url: `/user/profile/${initialValues.id}`,
      data: formData,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white sm:max-w-140">
        <DialogHeader>
          <DialogTitle className="text-secondary text-xl font-semibold">
            Update User
          </DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <UserForm
            onSubmit={onSubmit}
            onCancel={onClose}
            isPending={isPending}
          />
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
