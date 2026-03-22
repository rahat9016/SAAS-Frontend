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
import { toast } from "react-toastify";
import * as Yup from "yup";

import ControlledInputField from "@/src/components/shared/FromController/ControlledInputField";
import InputLabel from "@/src/components/shared/InputLabel";
import SubmitButton from "@/src/components/shared/SubmitButton";
import { Button } from "@/src/components/ui/button";
import { IAttribute } from "../types";

// ─── Schema ─────────────────────────────────────────────────────────
const attributeSchema = Yup.object({
  name: Yup.string().required("Attribute name is required"),
});

type AttributeFormValues = Yup.InferType<typeof attributeSchema>;

// ─── Props ──────────────────────────────────────────────────────────
interface CreateUpdateAttributeProps {
  isOpen: boolean;
  onClose: () => void;
  initialValues?: IAttribute;
}

export default function CreateUpdateAttribute({
  isOpen,
  onClose,
  initialValues,
}: CreateUpdateAttributeProps) {
  const isUpdate = !!initialValues;

  const methods = useForm<AttributeFormValues>({
    resolver: yupResolver(attributeSchema),
    defaultValues: { name: "" },
  });

  useEffect(() => {
    if (isOpen) {
      methods.reset({ name: initialValues?.name || "" });
    } else {
      methods.reset({ name: "" });
    }
  }, [isOpen, initialValues, methods]);

  const onSubmit = (values: AttributeFormValues) => {
    console.log("Attribute submitted:", values);
    toast.success(
      `Attribute ${isUpdate ? "updated" : "created"} successfully!`
    );
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-secondary text-xl font-semibold">
            {isUpdate ? "Update" : "Create"} Attribute
          </DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="w-full space-y-5 mt-2"
          >
            <div>
              <InputLabel label="Attribute Name" required />
              <ControlledInputField
                className="bg-light"
                name="name"
                placeholder="e.g. Color, Size, Weight"
              />
            </div>

            <div className="flex items-center justify-end gap-4">
              <Button
                type="button"
                onClick={onClose}
                className="text-secondary-foreground bg-transparent hover:bg-transparent border shadow-none cursor-pointer"
              >
                Cancel
              </Button>
              <SubmitButton
                isLoading={false}
                label={isUpdate ? "Update" : "Create"}
              />
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
