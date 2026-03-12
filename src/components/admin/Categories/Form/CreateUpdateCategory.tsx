"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { useGet } from "@/src/hooks/useGet";
import { usePost } from "@/src/hooks/usePost";
import { usePatch } from "@/src/hooks/usePatch";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { categorySchema, CategoryFormValues } from "../Schema/categorySchema";
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
    "/parent-categories",
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
    resolver: yupResolver(categorySchema),
    defaultValues: {
      name: "",
      parentCategoryId: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      methods.reset({
        name: initialValues?.name || "",
        parentCategoryId: initialValues?.parentCategoryId || "",
      });
    } else {
      methods.reset({ name: "", parentCategoryId: "" });
    }
  }, [isOpen, initialValues, methods]);

  const { mutate: createMutate, isPending: isCreating } = usePost(
    "/categories",
    () => {
      toast.success("Category created successfully!");
      onClose();
    },
    [["categories"]]
  );

  const { mutate: updateMutate, isPending: isUpdating } = usePatch(
    () => {
      toast.success("Category updated successfully!");
      onClose();
    },
    [["categories"]]
  );

  const isPending = isCreating || isUpdating;

  const onSubmit = (values: CategoryFormValues) => {
    if (isUpdate && initialValues) {
      updateMutate({
        url: `/categories/${initialValues.id}`,
        data: values as unknown as Record<string, unknown>,
      });
    } else {
      createMutate({
        data: values as unknown as Record<string, unknown>,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-secondary text-xl font-semibold">
            {isUpdate ? "Update" : "Create"} Category
          </DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <CategoryForm
            isEditMode={isUpdate}
            onSubmit={onSubmit}
            onCancel={onClose}
            isPending={isPending}
            parentCategoryOptions={parentCategoryOptions}
          />
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
