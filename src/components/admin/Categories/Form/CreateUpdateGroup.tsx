"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { IGroup } from "../data/mockGroupData";
import { groupSchema, GroupFormValues } from "../Schema/groupSchema";
import GroupForm from "./GroupForm";

interface CreateUpdateGroupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: GroupFormValues) => void;
  initialValues?: IGroup;
}

export default function CreateUpdateGroup({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
}: CreateUpdateGroupProps) {
  const isUpdate = !!initialValues;

  const methods = useForm<GroupFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(groupSchema) as any,
    defaultValues: {
      name: "",
      description: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (isOpen) {
      methods.reset({
        name: initialValues?.name || "",
        description: initialValues?.description || "",
        isActive: initialValues?.status === "ACTIVE" || !initialValues,
      });
    }
  }, [isOpen, initialValues, methods]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="bg-white sm:max-w-125">
        <DialogHeader>
          <DialogTitle className="text-secondary text-xl font-semibold">
            {isUpdate ? "Update" : "Create"} Group
          </DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <GroupForm
            isEditMode={isUpdate}
            onSubmit={onSubmit}
            onCancel={onClose}
          />
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
