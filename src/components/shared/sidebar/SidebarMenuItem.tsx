import { MenuItem } from "@/src/utils/getMenuItems";
import { usePathname } from "next/navigation";
import SidebarSegmentHeader from "./SidebarSegmentHeader";
import SidebarSimpleLink from "./SidebarSimpleLink";

interface SidebarMenuItemProps {
  item: MenuItem;
  showSegment: boolean;
  onNavigate: () => void;
}

export default function SidebarMenuItem({
  item,
  showSegment,
  onNavigate,
}: SidebarMenuItemProps) {
  const pathname = usePathname();
  const isActive = item.href && pathname === item.href;

  return (
    <div>
      {showSegment && item.segment && (
        <SidebarSegmentHeader label={item.segment} />
      )}
      <SidebarSimpleLink
        label={item.label}
        icon={item.icon}
        href={item.href ?? "#"}
        isActive={!!isActive}
        onNavigate={onNavigate}
      />
    </div>
  );
}
