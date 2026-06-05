"use client";

import BranchRbacManager from "@/src/components/admin/RBAC/Branches/BranchRbacManager";
import RbacRouteGuard from "@/src/components/admin/RBAC/shared/RbacRouteGuard";

export default function RbacBranchesPage() {
  return (
    <RbacRouteGuard allowedRoles={["SUPER_ADMIN"]}>
      <BranchRbacManager />
    </RbacRouteGuard>
  );
}
