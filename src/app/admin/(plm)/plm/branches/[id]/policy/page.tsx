"use client";

import { use } from "react";
import BranchPolicyEditor from "@/src/components/admin/PLM/AccessControl/BranchPolicyEditor";
import PlmRouteGuard from "@/src/components/admin/PLM/shared/PlmRouteGuard";

export default function BranchPolicyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return (
    <PlmRouteGuard requiredPermission="plm.branch.create">
      <BranchPolicyEditor branchId={id} />
    </PlmRouteGuard>
  );
}
