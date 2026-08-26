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
import { ISeasonItem } from "../data/mockStyleData";
import { seasonSchema, SeasonFormValues } from "../Schema/seasonSchema";
import SeasonForm from "./SeasonForm";

interface CreateUpdateSeasonProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: SeasonFormValues) => void;
  initialValues?: ISeasonItem;
}

export default function CreateUpdateSeason({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
}: CreateUpdateSeasonProps) {
  const isUpdate = !!initialValues;

  const methods = useForm<SeasonFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(seasonSchema) as any,
    defaultValues: {
      season: "",
      status: "On Planning",
    },
  });

  useEffect(() => {
    if (isOpen) {
      methods.reset({
        season: initialValues?.season || "",
        status: initialValues?.status || "On Planning",
      });
    }
  }, [isOpen, initialValues, methods]);

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
            {isUpdate ? "Update" : "Create"} Season
          </DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <SeasonForm
            isEditMode={isUpdate}
            onSubmit={onSubmit}
            onCancel={onClose}
          />
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
