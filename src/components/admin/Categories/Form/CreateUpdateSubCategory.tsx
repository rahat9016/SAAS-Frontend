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
import { mockSegmentsList } from "../data/mockCategoryHierarchy";
import {
  SubCategoryFormValues,
  subCategorySchema,
} from "../Schema/subCategorySchema";
import { ISubCategory } from "../types";
import SubCategoryForm from "./SubCategoryForm";

export interface SubCategorySubmitValues {
  name: string;
  description?: string;
  segmentId: string;
  segmentName?: string;
  categoryId?: string;
  categoryName?: string;
  icon?: string;
  status: "ACTIVE" | "INACTIVE";
}

interface CreateUpdateSubCategoryProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: SubCategorySubmitValues) => void;
  initialValues?: ISubCategory;
}

const segmentOptions = mockSegmentsList.map((s) => ({
  label: `${s.categoryName} › ${s.name}`,
  value: s.id,
}));

export default function CreateUpdateSubCategory({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
}: CreateUpdateSubCategoryProps) {
  const isUpdate = !!initialValues;

  const methods = useForm<SubCategoryFormValues>({
    resolver: yupResolver(subCategorySchema) as Resolver<SubCategoryFormValues>,
    defaultValues: {
      name: "",
      description: "",
      icon: undefined,
      segmentId: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (isOpen) {
      methods.reset({
        name: initialValues?.name || "",
        description: initialValues?.description || "",
        icon: initialValues?.icon || undefined,
        segmentId: initialValues?.segmentId || "",
        isActive: initialValues?.status === "ACTIVE" || !initialValues,
      });
    } else {
      methods.reset({
        name: "",
        description: "",
        icon: undefined,
        segmentId: "",
        isActive: true,
      });
    }
  }, [isOpen, initialValues, methods]);

  const handleFormSubmit = (values: SubCategoryFormValues) => {
    const segment = mockSegmentsList.find((s) => s.id === values.segmentId);
    onSubmit({
      name: values.name,
      description: values.description,
      segmentId: values.segmentId,
      segmentName: segment?.name,
      categoryId: segment?.categoryId,
      categoryName: segment?.categoryName,
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
            {isUpdate ? "Update" : "Create"} Sub Category
          </DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <SubCategoryForm
            isEditMode={isUpdate}
            onSubmit={handleFormSubmit}
            onCancel={onClose}
            segmentOptions={segmentOptions}
          />
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
