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
  colorwaySchema,
  ColorwayFormValues,
} from "../Schema/colorwaySchema";
import ColorwayForm from "./ColorwayForm";

interface CreateColorwayProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: ColorwayFormValues) => void;
}

export default function CreateColorway({
  isOpen,
  onClose,
  onSubmit,
}: CreateColorwayProps) {
  const methods = useForm<ColorwayFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(colorwaySchema) as any,
    defaultValues: {
      name: "",
      colorway: "",
      spec: "",
      description: "",
      standard: "Pantone",
      pantone: "",
      colorHex: "#ffffff",
      active: true,
      inTheme: true,
      sustLabelOff: false,
      planSms: false,
      plan3dSms: false,
      actualSms: false,
      startDate: "",
      endDate: "",
      clearanceDate: "",
    },
  });

  const handleClose = () => {
    methods.reset();
    onClose();
  };

  const handleSubmit = (values: ColorwayFormValues) => {
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
            New Colorway
          </DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <ColorwayForm onSubmit={handleSubmit} onCancel={handleClose} />
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
