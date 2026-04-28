"use client";

import {
  AttributeFormValues,
  attributeSchema,
} from "@/src/components/admin/Products/Attributes/Schema";
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
import { getAttributeDefaultValues } from "../getDefaultValues";
import { IAttribute } from "../types";
import AttributeForm from "./AttributeForm";

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
    resolver: yupResolver(attributeSchema) as Resolver<AttributeFormValues>,
    defaultValues: getAttributeDefaultValues(),
  });

  const {
    mutate: createMutate,
    isPending: isCreating,
    error,
    reset: resetCreateError,
  } = usePost(
    "/product-attribute",
    () => {
      toast.success("Attribute created successfully!");
      onClose();
    },
    [["product-attributes"]]
  );

  const {
    mutate: updateMutate,
    isPending: isUpdating,
    error: updateError,
    reset: resetUpdateError,
  } = usePatch(() => {
    toast.success("Attribute updated successfully!");
    onClose();
  }, [["product-attributes"]]);

  const isPending = isCreating || isUpdating;

  // Reset form and errors when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      // When opening, set values based on whether it's create or update mode
      methods.reset(
        getAttributeDefaultValues(isUpdate ? initialValues : undefined)
      );
      resetCreateError();
      resetUpdateError();
    } else {
      // When closing, clear all values and reset errors
      methods.reset(getAttributeDefaultValues());
      resetCreateError();
      resetUpdateError();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialValues]);

  const handleClose = () => {
    resetCreateError();
    resetUpdateError();
    onClose();
  };

  const onSubmit = (values: AttributeFormValues) => {
    const payload = {
      name: values.name,
      description: values.description || "",
      status: values.status,
    };

    if (isUpdate && initialValues) {
      updateMutate({
        url: `/product-attribute/${initialValues.id}`,
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
            {isUpdate ? "Update" : "Create"} Attribute
          </DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <AttributeForm
            isEditMode={isUpdate}
            onSubmit={onSubmit}
            onCancel={handleClose}
            isPending={isPending}
            error={error || updateError}
          />
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
