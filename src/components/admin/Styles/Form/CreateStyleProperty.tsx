"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import {
  stylePropertySchema,
  StylePropertyFormValues,
} from "../Schema/stylePropertySchema";
import StylePropertyForm from "./StylePropertyForm";

interface CreateStylePropertyProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: StylePropertyFormValues) => void;
}

export default function CreateStyleProperty({
  isOpen,
  onClose,
  onSubmit,
}: CreateStylePropertyProps) {
  const methods = useForm<StylePropertyFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(stylePropertySchema) as any,
    defaultValues: {
      styleType: "",
      sizeChartTemplate: "",
      deliveryMonth: "",
      collectionType: "",
      categoryId: "",
      supplierId: "",
      assignedBranchId: "",
      carryOver: false,
      autoProtoSr: false,
      autoSmsSr: false,
      autoFfpSr: false,
    },
  });

  const handleClose = () => {
    methods.reset();
    onClose();
  };

  const handleSubmit = (values: StylePropertyFormValues) => {
    onSubmit(values);
    methods.reset();
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
            New Article
          </DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <StylePropertyForm onSubmit={handleSubmit} onCancel={handleClose} />
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
