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
import { makeUserSchema, UserFormValues } from "../Schema/userSchema";
import { RbacBranchUser, RbacRole } from "../types";
import UserForm from "./UserForm";

const stripPrefix = (name: string) => name.replace(/^[^-]+ - /, "");

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialValues?: RbacBranchUser;
  /** Branch context: super admin passes selected branch; branch admin omits. */
  branchId?: string;
  isSuperAdmin: boolean;
}

export default function CreateUpdateUser({
  isOpen,
  onClose,
  initialValues,
  branchId,
  isSuperAdmin,
}: Props) {
  const isUpdate = !!initialValues;
  const schema = useMemo(() => makeUserSchema(isUpdate), [isUpdate]);

  const methods = useForm<UserFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(schema) as any,
    defaultValues: { name: "", email: "", password: "", roleId: "" },
  });

  // Branch roles to assign.
  const { data: rolesData } = useGet<RbacRole[]>(
    "/api/branches/roles",
    ["rbac-roles-select", branchId ?? "own"],
    { limit: "-1", ...(isSuperAdmin && branchId ? { branchId } : {}) },
    { enabled: isOpen && (!isSuperAdmin || !!branchId) },
  );
  const roleOptions = (rolesData?.data ?? []).map((r) => ({
    label: stripPrefix(r.name),
    value: r.id,
  }));

  useEffect(() => {
    if (isOpen) {
      methods.reset({
        name: initialValues?.name ?? "",
        email: initialValues?.email ?? "",
        password: "",
        roleId: initialValues?.role?.id ?? "",
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
    if (isUpdate && initialValues) {
      updateMutate({
        url: `/api/branches/users/${initialValues.id}`,
        data: {
          name: values.name,
          roleId: values.roleId,
          ...(values.password ? { password: values.password } : {}),
        },
      });
    } else {
      createMutate({
        data: {
          name: values.name || values.email,
          email: values.email,
          password: values.password,
          roleId: values.roleId,
          ...(isSuperAdmin && branchId ? { branchId } : {}),
        },
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-white sm:max-w-125">
        <DialogHeader>
          <DialogTitle className="text-secondary text-xl font-semibold">
            {isUpdate ? "Update" : "Add"} User
          </DialogTitle>
        </DialogHeader>
        <FormProvider {...methods}>
          <UserForm
            isEditMode={isUpdate}
            roleOptions={roleOptions}
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
