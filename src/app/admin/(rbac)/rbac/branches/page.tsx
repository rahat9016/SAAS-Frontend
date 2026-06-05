"use client";

import BranchList from "@/src/components/admin/RBAC/Branches/BranchList/BranchList";
import RbacRouteGuard from "@/src/components/admin/RBAC/shared/RbacRouteGuard";

export default function RbacBranchesPage() {
  return (
    <RbacRouteGuard superAdminOnly>
      <BranchList />
    </RbacRouteGuard>
  );
}
