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
import { BranchFormValues, branchSchema } from "../Schema/branchSchema";
import { RbacBranch } from "../types";
import BranchForm from "./BranchForm";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: BranchFormValues) => void;
  initialValues?: RbacBranch;
}

const emptyValues: BranchFormValues = {
  name: "",
  code: "",
  contact: "",
  country: "",
  city: "",
  area: "",
  address: "",
  isActive: true,
};

export default function CreateUpdateBranch({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
}: Props) {
  const isUpdate = !!initialValues;

  const methods = useForm<BranchFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(branchSchema) as any,
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (isOpen) {
      methods.reset({
        name: initialValues?.name ?? "",
        code: initialValues?.code ?? "",
        contact: initialValues?.contact ?? "",
        country: initialValues?.country ?? "",
        city: initialValues?.city ?? "",
        area: initialValues?.area ?? "",
        address: initialValues?.address ?? "",
        isActive: initialValues ? initialValues.status === "ACTIVE" : true,
      });
    } else {
      methods.reset(emptyValues);
    }
  }, [isOpen, initialValues, methods]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-white sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-secondary text-xl font-semibold">
            {isUpdate ? "Update" : "Create"} Branch
          </DialogTitle>
        </DialogHeader>
        <FormProvider {...methods}>
          <BranchForm
            isEditMode={isUpdate}
            onSubmit={onSubmit}
            onCancel={onClose}
          />
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
