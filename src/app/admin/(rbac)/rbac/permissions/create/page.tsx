"use client";

import PermissionForm from "@/src/components/admin/RBAC/Permissions/Form/PermissionForm";
import RbacRouteGuard from "@/src/components/admin/RBAC/shared/RbacRouteGuard";

export default function CreatePermissionPage() {
  return (
    <RbacRouteGuard resource="permissions">
      <PermissionForm />
    </RbacRouteGuard>
  );
}
