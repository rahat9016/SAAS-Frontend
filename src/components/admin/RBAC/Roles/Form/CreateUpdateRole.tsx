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
import { RoleFormValues, roleSchema } from "../Schema/roleSchema";
import { RbacRoleItem } from "../types";
import RoleForm from "./RoleForm";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: RoleFormValues) => void;
  initialValues?: RbacRoleItem;
}

export default function CreateUpdateRole({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
}: Props) {
  const isUpdate = !!initialValues;

  const methods = useForm<RoleFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(roleSchema) as any,
    defaultValues: { name: "" },
  });

  useEffect(() => {
    methods.reset({ name: initialValues?.name ?? "" });
  }, [isOpen, initialValues, methods]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-white sm:max-w-125">
        <DialogHeader>
          <DialogTitle className="text-secondary text-xl font-semibold">
            {isUpdate ? "Update" : "Create"} Role
          </DialogTitle>
        </DialogHeader>
        <FormProvider {...methods}>
          <RoleForm
            isEditMode={isUpdate}
            onSubmit={onSubmit}
            onCancel={onClose}
          />
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
