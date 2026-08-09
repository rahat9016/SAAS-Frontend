"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { FormProvider, Resolver, useForm } from "react-hook-form";
import { mockParentCategoriesList } from "../data/mockCategoryHierarchy";
import { CategoryFormValues, categorySchema } from "../Schema/categorySchema";
import { ICategory } from "../types";
import CategoryForm from "./CategoryForm";

export interface CategorySubmitValues {
  name: string;
  description?: string;
  parentCategoryId: string;
  parentCategoryName?: string;
  icon?: string;
  status: "ACTIVE" | "INACTIVE";
}

interface CreateUpdateCategoryProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: CategorySubmitValues) => void;
  initialValues?: ICategory;
}

const parentCategoryOptions = mockParentCategoriesList.map((pc) => ({
  label: pc.name,
  value: pc.id,
}));

export default function CreateUpdateCategory({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
}: CreateUpdateCategoryProps) {
  const isUpdate = !!initialValues;

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

  const handleFormSubmit = (values: CategoryFormValues) => {
    const parent = mockParentCategoriesList.find(
      (pc) => pc.id === values.parentCategoryId
    );
    onSubmit({
      name: values.name,
      description: values.description,
      parentCategoryId: values.parentCategoryId,
      parentCategoryName: parent?.name,
      icon: typeof values.icon === "string" ? values.icon : undefined,
      status: values.isActive ? "ACTIVE" : "INACTIVE",
    });
  };

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
            {isUpdate ? "Update" : "Create"} Category
          </DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <CategoryForm
            isEditMode={isUpdate}
            onSubmit={handleFormSubmit}
            onCancel={onClose}
            parentCategoryOptions={parentCategoryOptions}
          />
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
