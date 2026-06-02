"use client";

import { ReactNode } from "react";
import { useAppSelector } from "@/src/lib/redux/hooks";
import { PlmPermission } from "@/src/types/plm/plmPermissions";
import PlmAccessDenied from "./PlmAccessDenied";

interface PlmRouteGuardProps {
  requiredPermission: PlmPermission;
  children: ReactNode;
}

/**
 * RBAC Route Guard — wraps a page component and checks
 * if the user's dynamic permissions (from the API) include
 * the required permission. Shows AccessDenied if not.
 */
export default function PlmRouteGuard({
  requiredPermission,
  children,
}: PlmRouteGuardProps) {
  const userProfile = useAppSelector((state) => state.plm.userProfile);

  if (!userProfile.permissions.includes(requiredPermission)) {
    return (
      <PlmAccessDenied
        permission={requiredPermission}
        currentRoles={userProfile.roles}
      />
    );
  }

  return <>{children}</>;
}

