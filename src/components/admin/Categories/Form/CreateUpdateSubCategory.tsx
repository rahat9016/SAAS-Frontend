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
import {
  subCategorySchema,
  SubCategoryFormValues,
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
    "/api/categories/categories",
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
    resolver: yupResolver(subCategorySchema),
    defaultValues: {
      name: "",
      description: "",
      categoryId: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      methods.reset({
        name: initialValues?.name || "",
        description: initialValues?.description || "",
        categoryId: initialValues?.categoryId || "",
      });
    } else {
      methods.reset({ name: "", description: "", categoryId: "" });
    }
  }, [isOpen, initialValues, methods]);

  const { mutate: createMutate, isPending: isCreating } = usePost(
    "/api/categories/sub-categories",
    () => {
      toast.success("Sub category created successfully!");
      onClose();
    },
    [["sub-categories"]]
  );

  const { mutate: updateMutate, isPending: isUpdating } = usePatch(
    () => {
      toast.success("Sub category updated successfully!");
      onClose();
    },
    [["sub-categories"]]
  );

  const isPending = isCreating || isUpdating;

  const onSubmit = (values: SubCategoryFormValues) => {
    if (isUpdate && initialValues) {
      updateMutate({
        url: `/api/categories/sub-categories/${initialValues.id}`,
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
