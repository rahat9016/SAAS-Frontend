"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { usePost } from "@/src/hooks/usePost";
import { usePatch } from "@/src/hooks/usePatch";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { brandSchema, BrandFormValues } from "../Schema/brandSchema";
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
      title: "",
      description: "",
      isActive: true,
      logo: undefined,
    },
  });

  useEffect(() => {
    if (isOpen) {
      methods.reset({
        title: initialValues?.title || "",
        description: initialValues?.description || "",
        isActive: initialValues?.isActive ?? true,
        logo: initialValues?.logo || undefined,
      });
    } else {
      methods.reset({
        title: "",
        description: "",
        isActive: true,
        logo: undefined,
      });
    }
  }, [isOpen, initialValues, methods]);

  const { mutate: createMutate, isPending: isCreating } = usePost(
    "/api/brands",
    () => {
      toast.success("Brand created successfully!");
      onClose();
    },
    [["brands"]]
  );

  const { mutate: updateMutate, isPending: isUpdating } = usePatch(
    () => {
      toast.success("Brand updated successfully!");
      onClose();
    },
    [["brands"]]
  );

  const isPending = isCreating || isUpdating;

  const onSubmit = (values: BrandFormValues) => {
    const formData = new FormData();
    formData.append("title", values.title);
    if (values.description) {
      formData.append("description", values.description);
    }
    formData.append("isActive", String(values.isActive));
    if (values.logo instanceof File) {
      formData.append("logo", values.logo);
    }

    if (isUpdate && initialValues) {
      updateMutate({
        url: `/api/brands/${initialValues.id}`,
        data: formData,
      });
    } else {
      createMutate({ data: formData });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white sm:max-w-[500px]">
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
            isPending={isPending}
          />
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
