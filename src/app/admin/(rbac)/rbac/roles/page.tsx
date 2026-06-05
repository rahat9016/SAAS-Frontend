"use client";

import BranchRolesManager from "@/src/components/admin/RBAC/Roles/BranchRolesManager";
import RbacRouteGuard from "@/src/components/admin/RBAC/shared/RbacRouteGuard";

export default function RbacRolesPage() {
  return (
    <RbacRouteGuard allowedRoles={["SUPER_ADMIN", "BRANCH_ADMIN"]}>
      <BranchRolesManager />
    </RbacRouteGuard>
  );
}
