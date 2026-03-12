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
import {
  parentCategorySchema,
  ParentCategoryFormValues,
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(parentCategorySchema) as any,
    defaultValues: {
      name: "",
      description: "",
      icon: undefined,
    },
  });

  useEffect(() => {
    if (isOpen) {
      methods.reset({
        name: initialValues?.name || "",
        description: initialValues?.description || "",
        icon: initialValues?.icon || undefined,
      });
    } else {
      methods.reset({ name: "", description: "", icon: undefined });
    }
  }, [isOpen, initialValues, methods]);

  const { mutate: createMutate, isPending: isCreating } = usePost(
    "/parent-categories",
    () => {
      toast.success("Parent category created successfully!");
      onClose();
    },
    [["parent-categories"]]
  );

  const { mutate: updateMutate, isPending: isUpdating } = usePatch(
    () => {
      toast.success("Parent category updated successfully!");
      onClose();
    },
    [["parent-categories"]]
  );

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

    if (isUpdate && initialValues) {
      updateMutate({
        url: `/parent-categories/${initialValues.id}`,
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
            {isUpdate ? "Update" : "Create"} Parent Category
          </DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <ParentCategoryForm
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
