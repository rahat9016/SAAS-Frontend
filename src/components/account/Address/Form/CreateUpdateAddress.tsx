"use client";

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
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { AddressFormValues, addressSchema } from "../Schema/addressSchema";
import { AddressType, IAddress, ICreateUpdateAddressProps } from "../types";
import AddressForm from "./AddressForm";

const getAddressId = (address?: IAddress) => address?.id || address?._id;

export default function CreateUpdateAddress({
  isOpen,
  onClose,
  initialValues,
  userId,
}: ICreateUpdateAddressProps) {
  const isUpdate = !!initialValues;

  const methods = useForm<AddressFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(addressSchema) as any,
    defaultValues: {
      fullName: "",
      phone: "",
      addressType: AddressType.HOME,
      country: "",
      city: "",
      region: "",
      area: "",
      addressLine1: "",
      addressLine2: "",
      zipCode: "",
      company: "",
      isDefault: false,
    },
  });

  useEffect(() => {
    if (isOpen) {
      methods.reset({
        fullName: initialValues?.fullName || "",
        phone: initialValues?.phone || "",
        addressType: initialValues?.addressType || AddressType.HOME,
        country: initialValues?.country || "",
        city: initialValues?.city || "",
        region: initialValues?.region || "",
        area: initialValues?.area || "",
        addressLine1: initialValues?.addressLine1 || "",
        addressLine2: initialValues?.addressLine2 || "",
        zipCode: initialValues?.zipCode || "",
        company: initialValues?.company || "",
        isDefault: initialValues?.isDefault || false,
      });
    } else {
      methods.reset({
        fullName: "",
        phone: "",
        addressType: AddressType.HOME,
        country: "",
        city: "",
        region: "",
        area: "",
        addressLine1: "",
        addressLine2: "",
        zipCode: "",
        company: "",
        isDefault: false,
      });
    }
  }, [isOpen, initialValues, methods]);

  const {
    mutate: createMutate,
    isPending: isCreating,
    error,
    reset: resetCreateError,
  } = usePost(
    "/address",
    () => {
      toast.success("Address created successfully!");
      onClose();
    },
    [["addresses", userId || ""]]
  );

  const {
    mutate: updateMutate,
    isPending: isUpdating,
    error: updateError,
    reset: resetUpdateError,
  } = usePatch(() => {
    toast.success("Address updated successfully!");
    onClose();
  }, [["addresses", userId || ""]]);

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

  const onSubmit = (values: AddressFormValues) => {
    const payload = {
      ...values,
    };

    if (isUpdate && initialValues) {
      const id = getAddressId(initialValues);
      if (!id) {
        toast.error("Address id not found");
        return;
      }
      updateMutate({
        url: `/address/${id}`,
        data: payload,
      });
    } else {
      createMutate({ data: payload });
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent className="bg-white min-w-[50vw] overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-secondary text-xl font-semibold">
            {isUpdate ? "Update" : "Create"} Address
          </DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <AddressForm
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
