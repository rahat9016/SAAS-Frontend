"use client";

import BranchUsersManager from "@/src/components/admin/RBAC/Users/BranchUsersManager";
import RbacRouteGuard from "@/src/components/admin/RBAC/shared/RbacRouteGuard";

export default function RbacUsersPage() {
  return (
    <RbacRouteGuard allowedRoles={["SUPER_ADMIN", "BRANCH_ADMIN"]}>
      <BranchUsersManager />
    </RbacRouteGuard>
  );
}
