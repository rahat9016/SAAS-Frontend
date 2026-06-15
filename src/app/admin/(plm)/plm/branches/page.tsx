"use client";

import BranchOverview from "@/src/components/admin/PLM/SuperAdmin/BranchOverview";
import PlmRouteGuard from "@/src/components/admin/PLM/shared/PlmRouteGuard";

export default function BranchesPage() {
  return (
    <PlmRouteGuard requiredPermission="plm.branch.view">
      <BranchOverview />
    </PlmRouteGuard>
  );
}
