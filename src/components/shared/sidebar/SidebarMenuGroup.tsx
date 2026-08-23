import { cn } from "@/src/lib/utils";
import { MenuItem } from "@/src/utils/getMenuItems";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import SidebarChildLink from "./SidebarChildLink";
import SidebarParentLink from "./SidebarParentLink";
import SidebarSegmentHeader from "./SidebarSegmentHeader";

interface SidebarMenuGroupProps {
  item: MenuItem;
  showSegment: boolean;
  isExpanded: boolean;
  isCollapsed?: boolean;
  onToggleExpand: (label: string) => void;
  onNavigate: () => void;
}

function isChildMatch(href: string, matchRoutes: string[] | undefined, pathname: string) {
  if (pathname === href) return true;
  if (href !== "/admin" && pathname.startsWith(href)) return true;
  if (matchRoutes && matchRoutes.some((r) => pathname.startsWith(r))) return true;
  return false;
}

export default function SidebarMenuGroup({
  item,
  showSegment,
  isExpanded,
  isCollapsed = false,
  onToggleExpand,
  onNavigate,
}: SidebarMenuGroupProps) {
  const pathname = usePathname();
  const [flyoutOpen, setFlyoutOpen] = useState(false);

  const isActiveParent = item.href ? pathname === item.href : false;
  const isActiveChild =
    item.children?.some((child) =>
      isChildMatch(child.href, child.matchRoutes, pathname)
    ) || false;
  const isActive = isActiveParent || isActiveChild;

  const children = item.children?.map((child) => (
    <SidebarChildLink
      key={child.label}
      label={child.label}
      href={child.href}
      isActive={isChildMatch(child.href, child.matchRoutes, pathname)}
      onNavigate={() => {
        setFlyoutOpen(false);
        onNavigate();
      }}
    />
  ));

  // Rail mode: children live in a flyout anchored to the icon.
  if (isCollapsed) {
    return (
      <div>
        {showSegment && item.segment && (
          <SidebarSegmentHeader label={item.segment} isCollapsed />
        )}
        <Popover open={flyoutOpen} onOpenChange={setFlyoutOpen}>
          <PopoverTrigger asChild>
            <SidebarParentLink
              label={item.label}
              icon={item.icon}
              isActive={isActive}
              isExpanded={flyoutOpen}
              isCollapsed
              onToggle={() => setFlyoutOpen((prev) => !prev)}
            />
          </PopoverTrigger>
          <PopoverContent
            side="right"
            align="start"
            sideOffset={12}
            className="w-56 p-2"
          >
            <p className="px-3 pb-1 text-sm font-semibold text-secondary-dark">
              {item.label}
            </p>
            <div className="flex flex-col">{children}</div>
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  return (
    <div>
      {showSegment && item.segment && (
        <SidebarSegmentHeader label={item.segment} />
      )}

      <SidebarParentLink
        label={item.label}
        icon={item.icon}
        isActive={isActive}
        isExpanded={isExpanded}
        onToggle={() => onToggleExpand(item.label)}
      />

      {/* Children with left border */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-200",
          isExpanded ? "max-h-125 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="ml-5 mt-1 border-l-2 border-gray-200 pl-3">
          {children}
        </div>
      </div>
    </div>
  );
}
