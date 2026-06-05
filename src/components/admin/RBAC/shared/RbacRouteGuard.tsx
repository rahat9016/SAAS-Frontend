"use client";

import { ReactNode } from "react";
import { useAppSelector } from "@/src/lib/redux/hooks";
import { selectRbacRole } from "@/src/lib/redux/features/rbac/rbacSelectors";
import { useRbacPermissions } from "@/src/hooks/useRbacPermissions";
import type { RbacGlobalRole } from "@/src/lib/redux/features/rbac/rbacTypes";
import { ShieldAlert, Loader2 } from "lucide-react";

interface RbacRouteGuardProps {
  /** Global roles allowed to view the page. */
  allowedRoles: RbacGlobalRole[];
  children: ReactNode;
}

/**
 * Loads the RBAC permission map (once), then gates the page by global role.
 * Mirrors PlmRouteGuard but for the branch RBAC system.
 */
export default function RbacRouteGuard({
  allowedRoles,
  children,
}: RbacRouteGuardProps) {
  const { isLoading } = useRbacPermissions();
  const role = useAppSelector(selectRbacRole);

  if (isLoading && !role) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-400">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        <span className="text-sm">Loading permissions…</span>
      </div>
    );
  }

  if (!role || !allowedRoles.includes(role as RbacGlobalRole)) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mb-4">
          <ShieldAlert className="w-6 h-6 text-red-400" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">Access Denied</h2>
        <p className="text-sm text-gray-500 mt-1 max-w-sm">
          This page requires one of: {allowedRoles.join(", ")}.
          {role && (
            <>
              {" "}
              Your role: <span className="font-semibold">{role}</span>.
            </>
          )}
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
