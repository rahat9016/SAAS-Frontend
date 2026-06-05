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
import { mapToScope, scopeToMap } from "@/src/types/rbac/rbac";
import type { SelectedGrants } from "../../shared/ResourcePermissionMatrix";
import { roleSchema, RoleFormValues } from "../Schema/roleSchema";
import { RbacRole, stripRolePrefix } from "../types";
import RoleForm from "./RoleForm";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialValues?: RbacRole;
  /** API base: "/api/super-admin/roles" or "/api/branches/roles". */
  basePath: string;
  /** Branch context for branch-scope create (super admin selecting a branch). */
  branchId?: string;
  /** Scope ceiling (branch roles); omit for global roles. */
  ceiling?: SelectedGrants;
}

export default function CreateUpdateRole({
  isOpen,
  onClose,
  initialValues,
  basePath,
  branchId,
  ceiling,
}: Props) {
  const isUpdate = !!initialValues;

  const methods = useForm<RoleFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(roleSchema) as any,
    defaultValues: { name: "", permissions: {} },
  });

  useEffect(() => {
    if (isOpen) {
      methods.reset({
        name: initialValues ? stripRolePrefix(initialValues.name) : "",
        permissions: initialValues
          ? scopeToMap(initialValues.resourcePermissions)
          : {},
      });
    }
  }, [isOpen, initialValues, methods]);

  const { mutate: createMutate, isPending: isCreating, error } = usePost(
    basePath,
    () => {
      toast.success("Role created successfully!");
      onClose();
    },
    [["rbac-roles"]],
  );

  const { mutate: updateMutate, isPending: isUpdating, error: updateError } = usePatch(
    () => {
      toast.success("Role updated successfully!");
      onClose();
    },
    [["rbac-roles"]],
  );

  const isPending = isCreating || isUpdating;

  const onSubmit = (values: RoleFormValues) => {
    const permissions = mapToScope((values.permissions ?? {}) as SelectedGrants);
    if (isUpdate && initialValues) {
      updateMutate({
        url: `${basePath}/${initialValues.id}`,
        data: { name: values.name, permissions },
      });
    } else {
      createMutate({
        data: { name: values.name, permissions, ...(branchId ? { branchId } : {}) },
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-white sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-secondary text-xl font-semibold">
            {isUpdate ? "Update" : "Create"} Role
          </DialogTitle>
        </DialogHeader>
        <FormProvider {...methods}>
          <RoleForm
            isEditMode={isUpdate}
            ceiling={ceiling}
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
