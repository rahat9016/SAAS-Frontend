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
import { ActionFormValues, actionSchema } from "../Schema/actionSchema";
import { IActionItem } from "../types";
import ActionForm from "./ActionForm";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialValues?: IActionItem;
}

export default function CreateUpdateAction({ isOpen, onClose, initialValues }: Props) {
  const isUpdate = !!initialValues;

  const methods = useForm<ActionFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(actionSchema) as any,
    defaultValues: { key: "", label: "" },
  });

  useEffect(() => {
    methods.reset({
      key: initialValues?.key || "",
      label: initialValues?.label || "",
    });
  }, [isOpen, initialValues, methods]);

  const { mutate: createMutate, isPending: isCreating, error } = usePost(
    "/api/super-admin/actions",
    () => {
      toast.success("Action created successfully!");
      onClose();
    },
    [["actions"], ["actions-catalog"]],
  );

  const { mutate: updateMutate, isPending: isUpdating, error: updateError } = usePatch(
    () => {
      toast.success("Action updated successfully!");
      onClose();
    },
    [["actions"], ["actions-catalog"]],
  );

  const isPending = isCreating || isUpdating;

  const onSubmit = (values: ActionFormValues) => {
    if (isUpdate && initialValues) {
      updateMutate({
        url: `/api/super-admin/actions/${initialValues.id}`,
        data: { label: values.label },
      });
    } else {
      createMutate({ data: { key: values.key, label: values.label } });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-white sm:max-w-125">
        <DialogHeader>
          <DialogTitle className="text-secondary text-xl font-semibold">
            {isUpdate ? "Update" : "Create"} Action
          </DialogTitle>
        </DialogHeader>
        <FormProvider {...methods}>
          <ActionForm
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
