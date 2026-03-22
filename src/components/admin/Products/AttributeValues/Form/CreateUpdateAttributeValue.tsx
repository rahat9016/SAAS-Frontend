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
import ControlledSelectField from "@/src/components/shared/FromController/ControlledSelectField";
import InputLabel from "@/src/components/shared/InputLabel";
import SubmitButton from "@/src/components/shared/SubmitButton";
import { Button } from "@/src/components/ui/button";
import { IAttributeValue } from "../types";

// ─── Schema ─────────────────────────────────────────────────────────
const attributeValueSchema = Yup.object({
  name: Yup.string().required("Value name is required"),
  attributeId: Yup.string().required("Attribute is required"),
});

type AttributeValueFormValues = Yup.InferType<typeof attributeValueSchema>;

// ─── Mock attribute options ─────────────────────────────────────────
const ATTRIBUTE_OPTIONS = [
  { label: "Color", value: "attr-1" },
  { label: "Size", value: "attr-2" },
  { label: "Storage", value: "attr-3" },
  { label: "Material", value: "attr-4" },
];

// ─── Props ──────────────────────────────────────────────────────────
interface CreateUpdateAttributeValueProps {
  isOpen: boolean;
  onClose: () => void;
  initialValues?: IAttributeValue;
}

export default function CreateUpdateAttributeValue({
  isOpen,
  onClose,
  initialValues,
}: CreateUpdateAttributeValueProps) {
  const isUpdate = !!initialValues;

  const methods = useForm<AttributeValueFormValues>({
    resolver: yupResolver(attributeValueSchema),
    defaultValues: { name: "", attributeId: "" },
  });

  useEffect(() => {
    if (isOpen) {
      methods.reset({
        name: initialValues?.name || "",
        attributeId: initialValues?.attributeId || "",
      });
    } else {
      methods.reset({ name: "", attributeId: "" });
    }
  }, [isOpen, initialValues, methods]);

  const onSubmit = (values: AttributeValueFormValues) => {
    console.log("Attribute Value submitted:", values);
    toast.success(
      `Attribute value ${isUpdate ? "updated" : "created"} successfully!`
    );
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-secondary text-xl font-semibold">
            {isUpdate ? "Update" : "Create"} Attribute Value
          </DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="w-full space-y-5 mt-2"
          >
            <div>
              <InputLabel label="Attribute" required />
              <ControlledSelectField
                name="attributeId"
                options={ATTRIBUTE_OPTIONS}
                placeholder="Select attribute"
                className="bg-light shadow-none"
              />
            </div>

            <div>
              <InputLabel label="Value Name" required />
              <ControlledInputField
                className="bg-light"
                name="name"
                placeholder="e.g. Red, XL, 256 GB"
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
