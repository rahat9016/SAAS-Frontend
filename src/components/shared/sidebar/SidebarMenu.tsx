"use client";

import { getMenuItems } from "@/src/utils/getMenuItems";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import SidebarMenuGroup from "./SidebarMenuGroup";
import SidebarMenuItem from "./SidebarMenuItem";

interface SidebarMenuProps {
  onNavigate: () => void;
}

export default function SidebarMenu({ onNavigate }: SidebarMenuProps) {
  const pathname = usePathname();
  const menuItems = getMenuItems();

  // Track which menu items are expanded
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Auto-expand parent item if a child is active
  useEffect(() => {
    menuItems.forEach((item) => {
      if (item.children) {
        const hasActiveChild = item.children.some(
          (child) => pathname === child.href
        );
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
    <nav className="flex-1 overflow-y-auto custom-scrollbar mt-4">
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
              onNavigate={onNavigate}
            />
          );
        })}
      </div>
    </nav>
  );
}
