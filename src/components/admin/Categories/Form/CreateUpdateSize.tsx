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
import { ISize } from "../data/mockSizeData";
import { sizeSchema, SizeFormValues } from "../Schema/sizeSchema";
import SizeForm from "./SizeForm";

interface CreateUpdateSizeProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: SizeFormValues) => void;
  initialValues?: ISize;
}

export default function CreateUpdateSize({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
}: CreateUpdateSizeProps) {
  const isUpdate = !!initialValues;

  const methods = useForm<SizeFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(sizeSchema) as any,
    defaultValues: {
      name: "",
      code: "",
      description: "",
      sortOrder: 0,
      unit: "in",
      chest: undefined,
      waist: undefined,
      hip: undefined,
      length: undefined,
      isActive: true,
    },
  });

  useEffect(() => {
    if (isOpen) {
      methods.reset({
        name: initialValues?.name || "",
        code: initialValues?.code || "",
        description: initialValues?.description || "",
        sortOrder: initialValues?.sortOrder ?? 0,
        unit: (initialValues?.unit === "cm" ? "cm" : "in") as "in" | "cm",
        chest: initialValues?.chest,
        waist: initialValues?.waist,
        hip: initialValues?.hip,
        length: initialValues?.length,
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
            {isUpdate ? "Update" : "Create"} Size
          </DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <SizeForm
            isEditMode={isUpdate}
            onSubmit={onSubmit}
            onCancel={onClose}
          />
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
