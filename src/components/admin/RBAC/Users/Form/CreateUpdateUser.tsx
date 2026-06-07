"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { useGet } from "@/src/hooks/useGet";
import { usePatch } from "@/src/hooks/usePatch";
import { usePost } from "@/src/hooks/usePost";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { mapToScope, scopeToMap } from "@/src/types/rbac/rbac";
import type { SelectedGrants } from "../../shared/ResourcePermissionMatrix";
import { makeUserSchema, UserFormValues } from "../Schema/userSchema";
import { RbacBranch, RbacUser } from "../types";
import UserForm from "./UserForm";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialValues?: RbacUser;
  isSuperAdmin: boolean;
}

export default function CreateUpdateUser({ isOpen, onClose, initialValues, isSuperAdmin }: Props) {
  const isUpdate = !!initialValues;
  const schema = useMemo(() => makeUserSchema(isUpdate), [isUpdate]);

  const methods = useForm<UserFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(schema) as any,
    defaultValues: {
      firstName: "", lastName: "", email: "", password: "", phone: "",
      role: "USER", branchId: "", gender: "", dateOfBirth: "", permissions: {},
    },
  });

  const { data: branchData } = useGet<RbacBranch[]>(
    "/api/super-admin/branches",
    ["rbac-branches"],
    { limit: "-1" },
    { enabled: isOpen && isSuperAdmin },
  );
  const branchOptions = (branchData?.data ?? []).map((b) => ({
    label: `${b.code ?? b.id.slice(0, 6)}${b.city ? ` · ${b.city}` : ""}`,
    value: b.id,
  }));

  useEffect(() => {
    if (isOpen) {
      methods.reset({
        firstName: initialValues?.firstName ?? "",
        lastName: initialValues?.lastName ?? "",
        email: initialValues?.email ?? "",
        password: "",
        phone: initialValues?.phone ?? "",
        role: initialValues?.role === "BRANCH_ADMIN" ? "BRANCH_ADMIN" : "USER",
        branchId: initialValues?.branchId ?? "",
        gender: initialValues?.gender ?? "",
        dateOfBirth: initialValues?.dateOfBirth?.slice(0, 10) ?? "",
        permissions: initialValues ? scopeToMap(initialValues.permissions) : {},
      });
    }
  }, [isOpen, initialValues, methods]);

  const { mutate: createMutate, isPending: isCreating, error } = usePost(
    "/api/branches/users",
    () => {
      toast.success("User created successfully!");
      onClose();
    },
    [["rbac-users"]],
  );

  const { mutate: updateMutate, isPending: isUpdating, error: updateError } = usePatch(
    () => {
      toast.success("User updated successfully!");
      onClose();
    },
    [["rbac-users"]],
  );

  const isPending = isCreating || isUpdating;

  const onSubmit = (values: UserFormValues) => {
    const permissions = mapToScope((values.permissions ?? {}) as SelectedGrants);
    const base = {
      firstName: values.firstName,
      lastName: values.lastName,
      phone: values.phone,
      role: values.role,
      gender: values.gender || undefined,
      dateOfBirth: values.dateOfBirth || undefined,
      permissions,
      ...(isSuperAdmin ? { branchId: values.branchId || undefined } : {}),
    };
    if (isUpdate && initialValues) {
      updateMutate({
        url: `/api/branches/users/${initialValues.id}`,
        data: { ...base, ...(values.password ? { password: values.password } : {}) },
      });
    } else {
      createMutate({ data: { ...base, email: values.email, password: values.password } });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-white sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-secondary text-xl font-semibold">
            {isUpdate ? "Update" : "Create"} User
          </DialogTitle>
        </DialogHeader>
        <FormProvider {...methods}>
          <UserForm
            isEditMode={isUpdate}
            isSuperAdmin={isSuperAdmin}
            branchOptions={branchOptions}
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
