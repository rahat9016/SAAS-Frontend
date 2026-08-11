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
import { ActionFormValues, actionSchema } from "../Schema/actionSchema";
import { IActionItem } from "../types";
import ActionForm from "./ActionForm";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: ActionFormValues) => void;
  initialValues?: IActionItem;
}

export default function CreateUpdateAction({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
}: Props) {
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
          />
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
