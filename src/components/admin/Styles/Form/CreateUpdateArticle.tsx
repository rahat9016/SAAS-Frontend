"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { IArticleItem } from "../data/mockStyleData";
import { articleSchema, ArticleFormValues } from "../Schema/articleSchema";
import ArticleForm from "./ArticleForm";

interface CreateUpdateArticleProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: ArticleFormValues) => void;
  initialValues?: IArticleItem;
  defaultSeasonId?: string;
}

const emptyDefaults: ArticleFormValues = {
  seasonId: "",
  categoryId: "",
  segmentId: "",
  subCategoryId: "",
  brandId: "",
  style: "",
  fit: "",
  image: "",
  month: "",
  retailPrice: "",
  fob: "",
  colorIds: [],
  sizeIds: [],
  fabric: "",
  fabricDescription: "",
  composition: "",
  promoteStatus: "",
  assignedBranch: "",
  packingCode: "",
  transportMode: "",
  supplier: "",
  exDelivery: "",
  sustainability: "",
};

export default function CreateUpdateArticle({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
  defaultSeasonId,
}: CreateUpdateArticleProps) {
  const isUpdate = !!initialValues;

  const methods = useForm<ArticleFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(articleSchema) as any,
    defaultValues: emptyDefaults,
  });

  useEffect(() => {
    if (isOpen) {
      methods.reset(
        initialValues
          ? {
              seasonId: initialValues.seasonId || defaultSeasonId || "",
              categoryId: initialValues.categoryId || "",
              segmentId: initialValues.segmentId || "",
              subCategoryId: initialValues.subCategoryId || "",
              brandId: initialValues.brandId || "",
              style: initialValues.style,
              fit: initialValues.fit,
              image: initialValues.image,
              month: initialValues.month,
              retailPrice: initialValues.retailPrice,
              fob: initialValues.fob,
              colorIds: initialValues.colorIds || [],
              sizeIds: initialValues.sizeIds || [],
              fabric: initialValues.fabric,
              fabricDescription: initialValues.fabricDescription,
              composition: initialValues.composition,
              promoteStatus: initialValues.promoteStatus,
              assignedBranch: initialValues.assignedBranch,
              packingCode: initialValues.packingCode,
              transportMode: initialValues.transportMode,
              supplier: initialValues.supplier,
              exDelivery: initialValues.exDelivery,
              sustainability: initialValues.sustainability,
            }
          : { ...emptyDefaults, seasonId: defaultSeasonId || "" }
      );
    }
  }, [isOpen, initialValues, defaultSeasonId, methods]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="bg-white sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-secondary text-xl font-semibold">
            {isUpdate ? "Update" : "New"} Article
          </DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <ArticleForm
            isEditMode={isUpdate}
            onSubmit={onSubmit}
            onCancel={onClose}
          />
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
