"use client";

import PlmGroupsManager from "@/src/components/admin/PLM/AccessControl/PlmGroupsManager";
import PlmRouteGuard from "@/src/components/admin/PLM/shared/PlmRouteGuard";

export default function PlmGroupsPage() {
  return (
    <PlmRouteGuard requiredPermission="plm.branch.create">
      <PlmGroupsManager />
    </PlmRouteGuard>
  );
}
