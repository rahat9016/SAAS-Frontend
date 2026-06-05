"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { useGet } from "@/src/hooks/useGet";
import { usePost } from "@/src/hooks/usePost";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { mapToScope } from "@/src/types/rbac/rbac";
import type { SelectedGrants } from "../../shared/ResourcePermissionMatrix";
import { branchSchema, BranchFormValues } from "../Schema/branchSchema";
import { RbacOrganization } from "../types";
import BranchForm from "./BranchForm";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateBranch({ isOpen, onClose }: Props) {
  const methods = useForm<BranchFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(branchSchema) as any,
    defaultValues: { name: "", code: "", location: "", organizationId: "", permissions: {} },
  });

  const { data: orgData } = useGet<RbacOrganization[]>(
    "/api/super-admin/organizations",
    ["rbac-orgs"],
    undefined,
    { enabled: isOpen },
  );
  const orgOptions = (orgData?.data ?? []).map((o) => ({
    label: `${o.name} (${o.code})`,
    value: o.id,
  }));

  useEffect(() => {
    if (isOpen) {
      methods.reset({ name: "", code: "", location: "", organizationId: "", permissions: {} });
    }
  }, [isOpen, methods]);

  const { mutate, isPending, error } = usePost(
    "/api/super-admin/branches",
    () => {
      toast.success("Branch created successfully!");
      onClose();
    },
    [["rbac-branches"]],
  );

  const onSubmit = (values: BranchFormValues) => {
    mutate({
      data: {
        name: values.name,
        code: values.code,
        location: values.location ?? "",
        organizationId: values.organizationId,
        permissions: mapToScope((values.permissions ?? {}) as SelectedGrants),
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-white sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-secondary text-xl font-semibold">
            Create Branch
          </DialogTitle>
        </DialogHeader>
        <FormProvider {...methods}>
          <BranchForm
            orgOptions={orgOptions}
            onSubmit={onSubmit}
            onCancel={onClose}
            isPending={isPending}
            error={error}
          />
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
