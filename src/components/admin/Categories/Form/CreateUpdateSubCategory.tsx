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
import {
    SubCategoryFormValues,
    subCategorySchema,
} from "../Schema/subCategorySchema";
import { ICategory, ISubCategory } from "../types";
import SubCategoryForm from "./SubCategoryForm";

interface CreateUpdateSubCategoryProps {
  isOpen: boolean;
  onClose: () => void;
  initialValues?: ISubCategory;
}

export default function CreateUpdateSubCategory({
  isOpen,
  onClose,
  initialValues,
}: CreateUpdateSubCategoryProps) {
  const isUpdate = !!initialValues;

  const { data: categoriesData } = useGet<ICategory[]>(
    "/category",
    ["categories"],
    {},
    { enabled: isOpen }
  );
  const categories = categoriesData?.data || [];

  const categoryOptions = categories.map((c) => ({
    label: c.name,
    value: c.id,
  }));

  const methods = useForm<SubCategoryFormValues>({
    resolver: yupResolver(subCategorySchema) as Resolver<SubCategoryFormValues>,
    defaultValues: {
      name: "",
      description: "",
      icon: undefined,
      categoryId: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (isOpen) {
      methods.reset({
        name: initialValues?.name || "",
        description: initialValues?.description || "",
        icon: initialValues?.icon || undefined,
        categoryId:
          initialValues?.categoryId || initialValues?.category?.id || "",
        isActive: initialValues?.status === "ACTIVE" || !initialValues,
      });
    } else {
      methods.reset({
        name: "",
        description: "",
        icon: undefined,
        categoryId: "",
        isActive: true,
      });
    }
  }, [isOpen, initialValues, methods]);

  const { mutate: createMutate, isPending: isCreating } = usePost(
    "/sub-category",
    () => {
      toast.success("Sub category created successfully!");
      onClose();
    },
    [["sub-categories"]]
  );

  const { mutate: updateMutate, isPending: isUpdating } = usePatch(() => {
    toast.success("Sub category updated successfully!");
    onClose();
  }, [["sub-categories"]]);

  const isPending = isCreating || isUpdating;

  const onSubmit = (values: SubCategoryFormValues) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("categoryId", values.categoryId);
    if (values.description) {
      formData.append("description", values.description);
    }
    if (values.icon instanceof File) {
      formData.append("icon", values.icon);
    }
    formData.append("status", values.isActive ? "ACTIVE" : "INACTIVE");

    if (isUpdate && initialValues) {
      updateMutate({
        url: `/sub-category/${initialValues.id}`,
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
            {isUpdate ? "Update" : "Create"} Sub Category
          </DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <SubCategoryForm
            isEditMode={isUpdate}
            onSubmit={onSubmit}
            onCancel={onClose}
            isPending={isPending}
            categoryOptions={categoryOptions}
          />
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
