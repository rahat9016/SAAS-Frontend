"use client";

import PlmRolesManager from "@/src/components/admin/PLM/RoleManagement/PlmRolesManager";
import PlmRouteGuard from "@/src/components/admin/PLM/shared/PlmRouteGuard";

export default function PlmRolesPage() {
  return (
    <PlmRouteGuard requiredPermission="plm.branch.create">
      <PlmRolesManager />
    </PlmRouteGuard>
  );
}
