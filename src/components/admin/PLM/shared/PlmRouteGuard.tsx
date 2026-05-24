"use client";

import { ReactNode } from "react";
import { useAppSelector } from "@/src/lib/redux/hooks";
import { PlmPermission, hasPermission } from "@/src/types/plm/plmPermissions";
import PlmAccessDenied from "./PlmAccessDenied";

interface PlmRouteGuardProps {
  requiredPermission: PlmPermission;
  children: ReactNode;
}

/**
 * RBAC Route Guard — wraps a page component and checks
 * if the user's roles grant the required permission.
 * Shows AccessDenied if not.
 */
export default function PlmRouteGuard({
  requiredPermission,
  children,
}: PlmRouteGuardProps) {
  const userProfile = useAppSelector((state) => state.plm.userProfile);

  if (!hasPermission(userProfile.roles, requiredPermission)) {
    return (
      <PlmAccessDenied
        permission={requiredPermission}
        currentRoles={userProfile.roles}
      />
    );
  }

  return <>{children}</>;
}
