"use client";

import ActionList from "@/src/components/admin/RBAC/Actions/ActionList/ActionList";
import RbacRouteGuard from "@/src/components/admin/RBAC/shared/RbacRouteGuard";

export default function RbacActionsPage() {
  return (
    <RbacRouteGuard superAdminOnly>
      <ActionList />
    </RbacRouteGuard>
  );
}
