"use client";

import ErrorMessage from "@/src/components/shared/Errors/ErrorMessage";
import ControlledInputField from "@/src/components/shared/FromController/ControlledInputField";
import ControlledSelectField from "@/src/components/shared/FromController/ControlledSelectField";
import ControlledTextareaField from "@/src/components/shared/FromController/ControlledTextareaField";
import InputLabel from "@/src/components/shared/InputLabel";
import SubmitButton from "@/src/components/shared/SubmitButton";
import { Button } from "@/src/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/src/components/ui/dialog";
import { usePatch } from "@/src/hooks/usePatch";
import { usePost } from "@/src/hooks/usePost";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { FormProvider, Resolver, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { IAttributeValue } from "../types";

const attributeValueSchema = Yup.object({
  value: Yup.string().required("Attribute value is required"),
  description: Yup.string().optional().default(""),
  status: Yup.string().oneOf(["ACTIVE", "INACTIVE"]).required(),
});

type AttributeValueFormValues = Yup.InferType<typeof attributeValueSchema>;

interface CreateUpdateAttributeValueProps {
  isOpen: boolean;
  onClose: () => void;
  attributeId?: string;
  initialValues?: IAttributeValue;
}

const STATUS_OPTIONS = [
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
];

export default function CreateUpdateAttributeValue({
  isOpen,
  onClose,
  attributeId,
  initialValues,
}: CreateUpdateAttributeValueProps) {
  const isUpdate = !!initialValues;

  const methods = useForm<AttributeValueFormValues>({
    resolver: yupResolver(
      attributeValueSchema
    ) as Resolver<AttributeValueFormValues>,
    defaultValues: { value: "", description: "", status: "ACTIVE" },
  });

  useEffect(() => {
    if (isOpen) {
      methods.reset({
        value: initialValues?.value || "",
        description: initialValues?.description || "",
        status:
          String(initialValues?.status || "ACTIVE").toUpperCase() === "INACTIVE"
            ? "INACTIVE"
            : "ACTIVE",
      });
    } else {
      methods.reset({ value: "", description: "", status: "ACTIVE" });
    }
  }, [isOpen, initialValues, methods]);

  const {
    mutate: createMutate,
    isPending: isCreating,
    error,
    reset: resetCreateError,
  } = usePost(
    attributeId ? `/product-attribute/${attributeId}/values` : undefined,
    () => {
      toast.success("Attribute value created successfully!");
      onClose();
    },
    [["product-attribute-values", attributeId || ""]]
  );

  const {
    mutate: updateMutate,
    isPending: isUpdating,
    error: updateError,
    reset: resetUpdateError,
  } = usePatch(() => {
    toast.success("Attribute value updated successfully!");
    onClose();
  }, [["product-attribute-values", attributeId || ""]]);

  const isPending = isCreating || isUpdating;

  const handleClose = () => {
    resetCreateError();
    resetUpdateError();
    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      resetCreateError();
      resetUpdateError();
    }
  }, [isOpen, resetCreateError, resetUpdateError]);

  const onSubmit = (values: AttributeValueFormValues) => {
    if (!attributeId) {
      toast.error("Please select an attribute first");
      return;
    }

    const payload = {
      value: values.value,
      description: values.description || "",
      status: values.status,
    };

    if (isUpdate && initialValues) {
      updateMutate({
        url: `/product-attribute/${attributeId}/values/${initialValues.id}`,
        data: payload,
      });
      return;
    }

    createMutate({ data: payload });
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
            {isUpdate ? "Update" : "Create"} Attribute Value
          </DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="w-full space-y-5 mt-2"
          >
            <div>
              <InputLabel label="Value" required />
              <ControlledInputField
                className="bg-light"
                name="value"
                placeholder="e.g. Red, XL, 256GB"
              />
            </div>

            <div>
              <InputLabel label="Description" />
              <ControlledTextareaField
                className="bg-light h-28"
                name="description"
                placeholder="Enter value description"
              />
            </div>

            <div>
              <InputLabel label="Status" required />
              <ControlledSelectField
                className="bg-light"
                name="status"
                placeholder="Select status"
                options={STATUS_OPTIONS}
              />
            </div>

            <ErrorMessage error={error || updateError} />

            <div className="flex items-center justify-end gap-4">
              <Button
                type="button"
                onClick={handleClose}
                className="text-secondary-foreground bg-transparent hover:bg-transparent border shadow-none cursor-pointer"
              >
                Cancel
              </Button>
              <SubmitButton
                isLoading={isPending}
                label={isUpdate ? "Update" : "Create"}
              />
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
