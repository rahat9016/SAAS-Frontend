import { cn } from "@/src/lib/utils";
import { ChevronDown, type LucideIcon } from "lucide-react";
import * as React from "react";

interface SidebarParentLinkProps
  extends React.ComponentPropsWithoutRef<"button"> {
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  isExpanded: boolean;
  isCollapsed?: boolean;
  onToggle: () => void;
}

const SidebarParentLink = React.forwardRef<
  HTMLButtonElement,
  SidebarParentLinkProps
>(function SidebarParentLink(
  {
    label,
    icon: Icon,
    isActive,
    isExpanded,
    isCollapsed = false,
    onToggle,
    className,
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onToggle}
      aria-expanded={isExpanded}
      aria-label={label}
      title={isCollapsed ? undefined : label}
      className={cn(
        "w-full h-11 flex items-center justify-between px-3 rounded-sm text-sm font-medium transition-colors cursor-pointer",
        isCollapsed && "justify-center px-0",
        isActive
          ? "bg-secondary text-white"
          : "text-secondary-dark hover:bg-[#EAF6FB] hover:text-primary",
        className
      )}
      {...props}
    >
      <div className={cn("flex items-center gap-2.5", isCollapsed && "gap-0")}>
        <Icon
          className={cn(
            "w-5 h-5 shrink-0",
            isActive ? "text-white" : "text-current"
          )}
        />
        {!isCollapsed && <span className="truncate">{label}</span>}
      </div>
      {!isCollapsed && (
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 transition-transform duration-200",
            isExpanded ? "rotate-180" : ""
          )}
        />
      )}
    </button>
  );
});

export default SidebarParentLink;
