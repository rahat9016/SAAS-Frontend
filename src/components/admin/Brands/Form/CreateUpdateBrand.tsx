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
import { BrandFormValues, brandSchema } from "../Schema/brandSchema";
import { IBrand } from "../types";
import BrandForm from "./BrandForm";

interface CreateUpdateBrandProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: BrandFormValues) => void;
  initialValues?: IBrand;
}

export default function CreateUpdateBrand({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
}: CreateUpdateBrandProps) {
  const isUpdate = !!initialValues;

  const methods = useForm<BrandFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(brandSchema) as any,
    defaultValues: {
      name: "",
      description: "",
      isActive: true,
      icon: undefined,
    },
  });

  useEffect(() => {
    if (isOpen) {
      methods.reset({
        name: initialValues?.name || "",
        description: initialValues?.description || "",
        isActive: initialValues?.status === "ACTIVE" || !initialValues,
        icon: initialValues?.icon || undefined,
      });
    } else {
      methods.reset({
        name: "",
        description: "",
        isActive: true,
        icon: undefined,
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
            {isUpdate ? "Update" : "Create"} Brand
          </DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <BrandForm
            isEditMode={isUpdate}
            onSubmit={onSubmit}
            onCancel={onClose}
          />
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
