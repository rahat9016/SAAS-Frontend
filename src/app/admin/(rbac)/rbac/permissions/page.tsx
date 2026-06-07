"use client";

import PermissionList from "@/src/components/admin/RBAC/Permissions/PermissionList/PermissionList";
import RbacRouteGuard from "@/src/components/admin/RBAC/shared/RbacRouteGuard";

export default function RbacPermissionsPage() {
  return (
    <RbacRouteGuard resource="users">
      <PermissionList />
    </RbacRouteGuard>
  );
}
