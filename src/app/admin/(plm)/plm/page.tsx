"use client";

import PLMDashboard from "@/src/components/admin/PLM/SuperAdmin/PLMDashboard";
import PlmRouteGuard from "@/src/components/admin/PLM/shared/PlmRouteGuard";

export default function PLMDashboardPage() {
  return (
    <PlmRouteGuard requiredPermission="plm.dashboard.view">
      <PLMDashboard />
    </PlmRouteGuard>
  );
}
