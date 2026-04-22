"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/src/components/ui/dialog";
import { useGet } from "@/src/hooks/useGet";
import { usePatch } from "@/src/hooks/usePatch";
import { usePost } from "@/src/hooks/usePost";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { FormProvider, Resolver, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { CategoryFormValues, categorySchema } from "../Schema/categorySchema";
import { ICategory, IParentCategory } from "../types";
import CategoryForm from "./CategoryForm";

interface CreateUpdateCategoryProps {
  isOpen: boolean;
  onClose: () => void;
  initialValues?: ICategory;
}

export default function CreateUpdateCategory({
  isOpen,
  onClose,
  initialValues,
}: CreateUpdateCategoryProps) {
  const isUpdate = !!initialValues;

  const { data: parentCategoriesData } = useGet<IParentCategory[]>(
    "/parent-category",
    ["parent-categories"],
    {},
    { enabled: isOpen }
  );
  const parentCategories = parentCategoriesData?.data || [];

  const parentCategoryOptions = parentCategories.map((pc) => ({
    label: pc.name,
    value: pc.id,
  }));

  const methods = useForm<CategoryFormValues>({
    resolver: yupResolver(categorySchema) as Resolver<CategoryFormValues>,
    defaultValues: {
      name: "",
      parentCategoryId: "",
      description: "",
      icon: undefined,
      isActive: true,
    },
  });

  useEffect(() => {
    if (isOpen) {
      methods.reset({
        name: initialValues?.name || "",
        parentCategoryId:
          initialValues?.parentCategoryId ||
          initialValues?.parentCategory?.id ||
          "",
        description: initialValues?.description || "",
        icon: initialValues?.icon || undefined,
        isActive: initialValues?.status === "ACTIVE" || !initialValues,
      });
    } else {
      methods.reset({
        name: "",
        parentCategoryId: "",
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
    "/category",
    () => {
      toast.success("Category created successfully!");
      onClose();
    },
    [["categories"]]
  );

  const {
    mutate: updateMutate,
    isPending: isUpdating,
    error: updateError,
    reset: resetUpdateError,
  } = usePatch(() => {
    toast.success("Category updated successfully!");
    onClose();
  }, [["categories"]]);

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

  const onSubmit = (values: CategoryFormValues) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("parentCategoryId", values.parentCategoryId);
    if (values.description) {
      formData.append("description", values.description);
    }
    if (values.icon instanceof File) {
      formData.append("icon", values.icon);
    }
    formData.append("status", values.isActive ? "ACTIVE" : "INACTIVE");

    if (isUpdate && initialValues) {
      updateMutate({
        url: `/category/${initialValues.id}`,
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
            {isUpdate ? "Update" : "Create"} Category
          </DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <CategoryForm
            isEditMode={isUpdate}
            onSubmit={onSubmit}
            onCancel={handleClose}
            isPending={isPending}
            parentCategoryOptions={parentCategoryOptions}
            error={error || updateError}
          />
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
