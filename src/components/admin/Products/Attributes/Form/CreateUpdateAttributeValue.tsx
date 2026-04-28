"use client";

import {
  AttributeValueFormValues,
  attributeValueSchema,
} from "@/src/components/admin/Products/Attributes/Schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { useGet } from "@/src/hooks/useGet";
import { usePatch } from "@/src/hooks/usePatch";
import { usePost } from "@/src/hooks/usePost";
import { mapToSelectOptions } from "@/src/utils/mapToSelectOptions";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { FormProvider, Resolver, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { getAttributeValueDefaultValues } from "../getDefaultValues";
import { IAttribute, IAttributeValue } from "../types";
import AttributeValueForm from "./AttributeValueForm";

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

  const { data: attributesData } = useGet<IAttribute[]>(
    "/product-attribute/list",
    ["product-attributes"]
  );

  const methods = useForm<AttributeValueFormValues>({
    resolver: yupResolver(
      attributeValueSchema
    ) as Resolver<AttributeValueFormValues>,
    defaultValues: getAttributeValueDefaultValues(),
  });

  const {
    mutate: createMutate,
    isPending: isCreating,
    error,
    reset: resetCreateError,
  } = usePost(undefined, () => {
    toast.success("Attribute value created successfully!");
    onClose();
  }, [["product-values"]]);

  const {
    mutate: updateMutate,
    isPending: isUpdating,
    error: updateError,
    reset: resetUpdateError,
  } = usePatch(() => {
    toast.success("Attribute value updated successfully!");
    onClose();
  }, [["product-values"]]);

  const isPending = isCreating || isUpdating;

  useEffect(() => {
    if (isOpen) {
      methods.reset(
        getAttributeValueDefaultValues(isUpdate ? initialValues : undefined)
      );
      resetCreateError();
      resetUpdateError();
    } else {
      methods.reset(getAttributeValueDefaultValues());
      resetCreateError();
      resetUpdateError();
    }
  }, [
    isOpen,
    initialValues,
    methods,
    isUpdate,
    resetCreateError,
    resetUpdateError,
  ]);

  const handleClose = () => {
    resetCreateError();
    resetUpdateError();
    onClose();
  };

  const onSubmit = (values: AttributeValueFormValues) => {
    const selectedAttributeId = String(values.attributeId || "");
    if (!selectedAttributeId) {
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
        url: `/product-attribute/${selectedAttributeId}/values/${initialValues.id}`,
        data: payload,
      });
      return;
    }

    createMutate({
      endpoint: `/product-attribute/${selectedAttributeId}/values`,
      data: payload,
    });
  };
  const attributeOptions = mapToSelectOptions(
    attributesData?.data || [],
    "name",
    "id"
  );
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
          <AttributeValueForm
            isEditMode={isUpdate}
            onSubmit={onSubmit}
            onCancel={handleClose}
            attributeOptions={attributeOptions}
            isPending={isPending}
            error={error || updateError}
          />
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
