"use client";

import DesignList from "@/src/components/admin/PLM/DesignTeam/DesignList";
import PlmRouteGuard from "@/src/components/admin/PLM/shared/PlmRouteGuard";

export default function DesignsPage() {
  return (
    <PlmRouteGuard requiredPermission="plm.design.view">
      <DesignList />
    </PlmRouteGuard>
  );
}
