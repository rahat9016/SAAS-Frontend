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
import { mockCategoriesList } from "../data/mockCategoryHierarchy";
import { SegmentFormValues, segmentSchema } from "../Schema/segmentSchema";
import { ISegment } from "../types";
import SegmentForm from "./SegmentForm";

export interface SegmentSubmitValues {
  name: string;
  description?: string;
  categoryId: string;
  categoryName?: string;
  status: "ACTIVE" | "INACTIVE";
}

interface CreateUpdateSegmentProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: SegmentSubmitValues) => void;
  initialValues?: ISegment;
}

const categoryOptions = mockCategoriesList.map((c) => ({
  label: c.name,
  value: c.id,
}));

export default function CreateUpdateSegment({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
}: CreateUpdateSegmentProps) {
  const isUpdate = !!initialValues;

  const methods = useForm<SegmentFormValues>({
    resolver: yupResolver(segmentSchema) as Resolver<SegmentFormValues>,
    defaultValues: {
      name: "",
      categoryId: "",
      description: "",
      icon: undefined,
      isActive: true,
    },
  });

  useEffect(() => {
    if (isOpen) {
      methods.reset({
        name: initialValues?.name || "",
        categoryId:
          initialValues?.categoryId || initialValues?.category?.id || "",
        description: initialValues?.description || "",
        icon: undefined,
        isActive: initialValues?.status === "ACTIVE" || !initialValues,
      });
    } else {
      methods.reset({
        name: "",
        categoryId: "",
        description: "",
        icon: undefined,
        isActive: true,
      });
    }
  }, [isOpen, initialValues, methods]);

  const handleFormSubmit = (values: SegmentFormValues) => {
    const category = mockCategoriesList.find((c) => c.id === values.categoryId);
    onSubmit({
      name: values.name,
      description: values.description,
      categoryId: values.categoryId,
      categoryName: category?.name,
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
            {isUpdate ? "Update" : "Create"} Segment
          </DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <SegmentForm
            isEditMode={isUpdate}
            onSubmit={handleFormSubmit}
            onCancel={onClose}
            categoryOptions={categoryOptions}
          />
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
