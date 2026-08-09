import { cn } from "@/src/lib/utils";
import { MenuItem } from "@/src/utils/getMenuItems";
import { usePathname } from "next/navigation";
import SidebarChildLink from "./SidebarChildLink";
import SidebarParentLink from "./SidebarParentLink";
import SidebarSegmentHeader from "./SidebarSegmentHeader";

interface SidebarMenuGroupProps {
  item: MenuItem;
  showSegment: boolean;
  isExpanded: boolean;
  onToggleExpand: (label: string) => void;
  onNavigate: () => void;
}

export default function SidebarMenuGroup({
  item,
  showSegment,
  isExpanded,
  onToggleExpand,
  onNavigate,
}: SidebarMenuGroupProps) {
  const pathname = usePathname();

  const isActiveParent = item.href ? pathname === item.href : false;
  const isActiveChild =
    item.children?.some((child) => {
      if (pathname === child.href) return true;
      if (child.href !== "/admin" && pathname.startsWith(child.href)) return true;
      if (child.matchRoutes && child.matchRoutes.some((r) => pathname.startsWith(r))) {
        return true;
      }
      return false;
    }) || false;
  const isActive = isActiveParent || isActiveChild;

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
          {item.children?.map((child) => {
            let isChildActive = pathname === child.href;
            if (child.href !== "/admin" && pathname.startsWith(child.href)) {
              isChildActive = true;
            } else if (child.matchRoutes && child.matchRoutes.some((r) => pathname.startsWith(r))) {
              isChildActive = true;
            }

            return (
              <SidebarChildLink
                key={child.label}
                label={child.label}
                href={child.href}
                isActive={isChildActive}
                onNavigate={onNavigate}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
