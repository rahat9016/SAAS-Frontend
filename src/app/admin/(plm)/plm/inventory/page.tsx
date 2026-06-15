"use client";

import InventoryDashboard from "@/src/components/admin/PLM/Inventory/InventoryDashboard";
import PlmRouteGuard from "@/src/components/admin/PLM/shared/PlmRouteGuard";

export default function InventoryPage() {
  return (
    <PlmRouteGuard requiredPermission="plm.inventory.view">
      <InventoryDashboard />
    </PlmRouteGuard>
  );
}
