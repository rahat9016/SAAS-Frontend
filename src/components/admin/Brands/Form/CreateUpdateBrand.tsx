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
import { BrandFormValues, brandSchema } from "../Schema/brandSchema";
import { IBrand } from "../types";
import BrandForm from "./BrandForm";

interface CreateUpdateBrandProps {
  isOpen: boolean;
  onClose: () => void;
  initialValues?: IBrand;
}

export default function CreateUpdateBrand({
  isOpen,
  onClose,
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

  const {
    mutate: createMutate,
    isPending: isCreating,
    error,
    reset: resetCreateError,
  } = usePost(
    "/brand",
    () => {
      toast.success("Brand created successfully!");
      onClose();
    },
    [["brands"]]
  );

  const {
    mutate: updateMutate,
    isPending: isUpdating,
    error: updateError,
    reset: resetUpdateError,
  } = usePatch(() => {
    toast.success("Brand updated successfully!");
    onClose();
  }, [["brands"]]);

  const handleClose = () => {
    resetCreateError();
    resetUpdateError();
    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      resetCreateError();
      resetUpdateError();
    }
  }, [isOpen, resetCreateError, resetUpdateError]);

  const isPending = isCreating || isUpdating;

  const onSubmit = (values: BrandFormValues) => {
    const formData = new FormData();
    const iconValue = (
      values as BrandFormValues & { icon?: File | string | null }
    ).icon;

    formData.append("name", values.name);
    if (values.description) {
      formData.append("description", values.description);
    }
    formData.append("status", values.isActive ? "ACTIVE" : "INACTIVE");
    if (iconValue instanceof File) {
      formData.append("icon", iconValue);
    } else if (typeof iconValue === "string" && iconValue.trim()) {
      formData.append("icon", iconValue);
    }

    if (isUpdate && initialValues) {
      updateMutate({
        url: `/brand/${initialValues.id}`,
        data: formData,
      });
    } else {
      createMutate({ data: formData });
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
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
            onCancel={handleClose}
            isPending={isPending}
            error={error || updateError}
          />
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
