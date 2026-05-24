"use client";

import ApprovalPanel from "@/src/components/admin/PLM/SuperAdmin/ApprovalPanel";
import PlmRouteGuard from "@/src/components/admin/PLM/shared/PlmRouteGuard";

export default function ApprovalsPage() {
  return (
    <PlmRouteGuard requiredPermission="plm.approval.decide">
      <ApprovalPanel />
    </PlmRouteGuard>
  );
}
