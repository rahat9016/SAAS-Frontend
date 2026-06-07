"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { usePatch } from "@/src/hooks/usePatch";
import { usePost } from "@/src/hooks/usePost";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { roleSchema, RoleFormValues } from "../Schema/roleSchema";
import { RbacRoleItem } from "../types";
import RoleForm from "./RoleForm";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialValues?: RbacRoleItem;
}

export default function CreateUpdateRole({ isOpen, onClose, initialValues }: Props) {
  const isUpdate = !!initialValues;

  const methods = useForm<RoleFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(roleSchema) as any,
    defaultValues: { name: "" },
  });

  useEffect(() => {
    methods.reset({ name: initialValues?.name ?? "" });
  }, [isOpen, initialValues, methods]);

  const { mutate: createMutate, isPending: isCreating, error } = usePost(
    "/api/super-admin/roles",
    () => {
      toast.success("Role created successfully!");
      onClose();
    },
    [["rbac-roles"]],
  );

  const { mutate: updateMutate, isPending: isUpdating, error: updateError } = usePatch(
    () => {
      toast.success("Role updated successfully!");
      onClose();
    },
    [["rbac-roles"]],
  );

  const isPending = isCreating || isUpdating;

  const onSubmit = (values: RoleFormValues) => {
    const data = { name: values.name.toUpperCase() };
    if (isUpdate && initialValues) {
      updateMutate({ url: `/api/super-admin/roles/${initialValues.id}`, data });
    } else {
      createMutate({ data });
    }
  };

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
            isPending={isPending}
            error={error || updateError}
          />
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
