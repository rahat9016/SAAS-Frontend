"use client";

import { useRbacPermissions } from "@/src/hooks/useRbacPermissions";
import { selectRbac } from "@/src/lib/redux/features/rbac/rbacSelectors";
import { useAppSelector } from "@/src/lib/redux/hooks";
import { cn } from "@/src/lib/utils";
import { filterMenuByAccess, getMenuItems } from "@/src/utils/getMenuItems";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import SidebarMenuGroup from "./SidebarMenuGroup";
import SidebarMenuItem from "./SidebarMenuItem";

interface SidebarMenuProps {
  isCollapsed?: boolean;
  onNavigate: () => void;
}

export default function SidebarMenu({
  isCollapsed = false,
  onNavigate,
}: SidebarMenuProps) {
  const pathname = usePathname();

  // Load + read the user's RBAC permission map, then gate menu entries.
  useRbacPermissions();
  const rbac = useAppSelector(selectRbac);

  const menuItems = useMemo(() => {
    const hasPermissions = rbac.loaded && Object.keys(rbac.permissions ?? {}).length > 0;
    const can = (resource: string) => {
      // If RBAC is not loaded yet or permissions map is empty, show all menu items by default
      if (!hasPermissions) return true;
      if (rbac.user.isSuperAdmin) return true;
      const resourcePerms = rbac.permissions[resource];
      if (!resourcePerms) return true;
      return Object.values(resourcePerms).some(Boolean);
    };
    return filterMenuByAccess(getMenuItems(), can, rbac.user.isSuperAdmin);
  }, [rbac]);

  // Track which menu items are expanded
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Auto-expand parent item if a child is active
  useEffect(() => {
    menuItems.forEach((item) => {
      if (item.children) {
        const hasActiveChild = item.children.some((child) => {
          if (pathname === child.href) return true;
          if (child.href !== "/admin" && pathname.startsWith(child.href)) return true;
          if (child.matchRoutes && child.matchRoutes.some((r) => pathname.startsWith(r))) return true;
          return false;
        });
        if (hasActiveChild && !expandedItems.includes(item.label)) {
          setExpandedItems((prev) => [...prev, item.label]);
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  return (
    <nav
      className={cn(
        "flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar mt-4",
        isCollapsed && "scrollbar-hide"
      )}
    >
      <div className="flex flex-col gap-1 py-1">
        {menuItems.map((item, index) => {
          const showSegment =
            !!item.segment &&
            (index === 0 || menuItems[index - 1]?.segment !== item.segment);
          const isExpanded = expandedItems.includes(item.label);

          if (item.children) {
            return (
              <SidebarMenuGroup
                key={item.label}
                item={item}
                showSegment={showSegment}
                isExpanded={isExpanded}
                isCollapsed={isCollapsed}
                onToggleExpand={toggleExpand}
                onNavigate={onNavigate}
              />
            );
          }

          return (
            <SidebarMenuItem
              key={item.label}
              item={item}
              showSegment={showSegment}
              isCollapsed={isCollapsed}
              onNavigate={onNavigate}
            />
          );
        })}
      </div>
    </nav>
  );
}
