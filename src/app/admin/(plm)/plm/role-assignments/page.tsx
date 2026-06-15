"use client";

import UserRoleAssignments from "@/src/components/admin/PLM/RoleManagement/UserRoleAssignments";
import PlmRouteGuard from "@/src/components/admin/PLM/shared/PlmRouteGuard";

export default function PlmRoleAssignmentsPage() {
  return (
    <PlmRouteGuard requiredPermission="plm.branch.create">
      <UserRoleAssignments />
    </PlmRouteGuard>
  );
}
