"use client";

import CreateDesign from "@/src/components/admin/PLM/DesignTeam/Form/CreateDesign";
import PlmRouteGuard from "@/src/components/admin/PLM/shared/PlmRouteGuard";

export default function CreateDesignPage() {
  return (
    <PlmRouteGuard requiredPermission="plm.design.create">
      <CreateDesign />
    </PlmRouteGuard>
  );
}
