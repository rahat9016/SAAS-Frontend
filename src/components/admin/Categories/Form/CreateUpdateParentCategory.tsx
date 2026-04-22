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
import {
    ParentCategoryFormValues,
    parentCategorySchema,
} from "../Schema/parentCategorySchema";
import { IParentCategory } from "../types";
import ParentCategoryForm from "./ParentCategoryForm";

interface CreateUpdateParentCategoryProps {
  isOpen: boolean;
  onClose: () => void;
  initialValues?: IParentCategory;
}

export default function CreateUpdateParentCategory({
  isOpen,
  onClose,
  initialValues,
}: CreateUpdateParentCategoryProps) {
  const isUpdate = !!initialValues;

  const methods = useForm<ParentCategoryFormValues>({
    resolver: yupResolver(parentCategorySchema),
    defaultValues: {
      name: "",
      description: "",
      icon: undefined,
      isActive: true,
    },
  });

  useEffect(() => {
    if (isOpen) {
      methods.reset({
        name: initialValues?.name || "",
        description: initialValues?.description || "",
        icon: initialValues?.icon || undefined,
        isActive: initialValues?.status === "ACTIVE",
      });
      if (!initialValues) {
        methods.setValue("isActive", true, {
          shouldDirty: false,
          shouldTouch: false,
        });
      }
    } else {
      methods.reset({
        name: "",
        description: "",
        icon: undefined,
        isActive: true,
      });
    }
  }, [isOpen, initialValues, methods]);

  const {
    mutate: createMutate,
    isPending: isCreating,
    error,
    reset: resetCreateError,
  } = usePost(
    "parent-category",
    () => {
      toast.success("Parent category created successfully!");
      onClose();
    },
    [["parent-categories"]]
  );

  const {
    mutate: updateMutate,
    isPending: isUpdating,
    error: updateError,
    reset: resetUpdateError,
  } = usePatch(() => {
    toast.success("Parent category updated successfully!");
    onClose();
  }, [["parent-categories"]]);

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

  const onSubmit = (values: ParentCategoryFormValues) => {
    const formData = new FormData();
    formData.append("name", values.name);
    if (values.description) {
      formData.append("description", values.description);
    }
    if (values.icon instanceof File) {
      formData.append("icon", values.icon);
    }
    formData.append("status", values.isActive ? "ACTIVE" : "INACTIVE");

    if (isUpdate && initialValues) {
      updateMutate({
        url: `/parent-category/${initialValues.id}`,
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
      <DialogContent className="bg-white sm:max-w-[50%]">
        <DialogHeader>
          <DialogTitle className="text-secondary text-xl font-semibold">
            {isUpdate ? "Update" : "Create"} Parent Category
          </DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <ParentCategoryForm
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
