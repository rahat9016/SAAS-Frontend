"use client";

import RbacRouteGuard from "@/src/components/admin/RBAC/shared/RbacRouteGuard";
import SettingsPanel from "@/src/components/admin/Settings/SettingsPanel";

export default function AdminSettingsPage() {
  return (
    <RbacRouteGuard superAdminOnly>
      <SettingsPanel />
    </RbacRouteGuard>
  );
}
