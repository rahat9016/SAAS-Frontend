"use client";

import UserList from "@/src/components/admin/RBAC/Users/UserList/UserList";
import RbacRouteGuard from "@/src/components/admin/RBAC/shared/RbacRouteGuard";

export default function RbacUsersPage() {
  return (
    <RbacRouteGuard resource="users">
      <UserList />
    </RbacRouteGuard>
  );
}
