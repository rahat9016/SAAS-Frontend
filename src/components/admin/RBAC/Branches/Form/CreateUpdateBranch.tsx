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
import { branchSchema, BranchFormValues } from "../Schema/branchSchema";
import { RbacBranch } from "../types";
import BranchForm from "./BranchForm";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialValues?: RbacBranch;
}

export default function CreateUpdateBranch({ isOpen, onClose, initialValues }: Props) {
  const isUpdate = !!initialValues;

  const methods = useForm<BranchFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(branchSchema) as any,
    defaultValues: {
      code: "",
      contact: "",
      country: "",
      city: "",
      area: "",
      address: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (isOpen) {
      methods.reset({
        code: initialValues?.code ?? "",
        contact: initialValues?.contact ?? "",
        country: initialValues?.country ?? "",
        city: initialValues?.city ?? "",
        area: initialValues?.area ?? "",
        address: initialValues?.address ?? "",
        isActive: initialValues ? initialValues.status === "ACTIVE" : true,
      });
    }
  }, [isOpen, initialValues, methods]);

  const { mutate: createMutate, isPending: isCreating, error } = usePost(
    "/api/super-admin/branches",
    () => {
      toast.success("Branch created successfully!");
      onClose();
    },
    [["rbac-branches"]],
  );

  const { mutate: updateMutate, isPending: isUpdating, error: updateError } = usePatch(
    () => {
      toast.success("Branch updated successfully!");
      onClose();
    },
    [["rbac-branches"]],
  );

  const isPending = isCreating || isUpdating;

  const onSubmit = (values: BranchFormValues) => {
    const data = {
      code: values.code,
      contact: values.contact,
      country: values.country,
      city: values.city,
      area: values.area,
      address: values.address,
      status: values.isActive ? "ACTIVE" : "INACTIVE",
    };
    if (isUpdate && initialValues) {
      updateMutate({ url: `/api/super-admin/branches/${initialValues.id}`, data });
    } else {
      createMutate({ data });
    }
  };

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
            isPending={isPending}
            error={error || updateError}
          />
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
