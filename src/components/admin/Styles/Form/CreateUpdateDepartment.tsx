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
import { IDepartmentItem } from "../data/mockStyleData";
import {
  departmentSchema,
  DepartmentFormValues,
} from "../Schema/departmentSchema";
import DepartmentForm from "./DepartmentForm";

interface CreateUpdateDepartmentProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: DepartmentFormValues) => void;
  initialValues?: IDepartmentItem;
}

export default function CreateUpdateDepartment({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
}: CreateUpdateDepartmentProps) {
  const isUpdate = !!initialValues;

  const methods = useForm<DepartmentFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(departmentSchema) as any,
    defaultValues: {
      department: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      methods.reset({
        department: initialValues?.department || "",
      });
    }
  }, [isOpen, initialValues, methods]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="bg-white sm:max-w-125">
        <DialogHeader>
          <DialogTitle className="text-secondary text-xl font-semibold">
            {isUpdate ? "Update" : "Create"} Department
          </DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <DepartmentForm
            isEditMode={isUpdate}
            onSubmit={onSubmit}
            onCancel={onClose}
          />
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
