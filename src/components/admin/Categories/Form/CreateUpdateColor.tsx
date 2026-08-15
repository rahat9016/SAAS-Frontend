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
import { IColor } from "../data/mockColorData";
import { colorSchema, ColorFormValues } from "../Schema/colorSchema";
import ColorForm from "./ColorForm";

interface CreateUpdateColorProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: ColorFormValues) => void;
  initialValues?: IColor;
}

export default function CreateUpdateColor({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
}: CreateUpdateColorProps) {
  const isUpdate = !!initialValues;

  const methods = useForm<ColorFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(colorSchema) as any,
    defaultValues: {
      name: "",
      code: "",
      description: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (isOpen) {
      methods.reset({
        name: initialValues?.name || "",
        code: initialValues?.code || "",
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
            {isUpdate ? "Update" : "Create"} Color
          </DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <ColorForm
            isEditMode={isUpdate}
            onSubmit={onSubmit}
            onCancel={onClose}
          />
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
