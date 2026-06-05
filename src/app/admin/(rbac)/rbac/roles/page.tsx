"use client";

import RoleList from "@/src/components/admin/RBAC/Roles/RoleList/RoleList";
import RbacRouteGuard from "@/src/components/admin/RBAC/shared/RbacRouteGuard";

export default function RbacRolesPage() {
  return (
    <RbacRouteGuard resource="roles">
      <RoleList />
    </RbacRouteGuard>
  );
}
