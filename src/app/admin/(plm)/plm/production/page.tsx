"use client";

import ProductionList from "@/src/components/admin/PLM/Production/ProductionList";
import PlmRouteGuard from "@/src/components/admin/PLM/shared/PlmRouteGuard";

export default function ProductionPage() {
  return (
    <PlmRouteGuard requiredPermission="plm.production.view">
      <ProductionList />
    </PlmRouteGuard>
  );
}
