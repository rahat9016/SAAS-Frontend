import { cn } from "@/src/lib/utils";
import { ChevronDown, type LucideIcon } from "lucide-react";

interface SidebarParentLinkProps {
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  isExpanded: boolean;
  onToggle: () => void;
}

export default function SidebarParentLink({
  label,
  icon: Icon,
  isActive,
  isExpanded,
  onToggle,
}: SidebarParentLinkProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "w-full h-11 flex items-center justify-between px-3 rounded-sm text-sm font-medium transition-colors cursor-pointer",
        isActive
          ? "bg-secondary text-white"
          : "text-secondary-dark hover:bg-[#EAF6FB] hover:text-primary"
      )}
    >
      <div className="flex items-center gap-2.5">
        <Icon
          className={cn(
            "w-5 h-5 shrink-0",
            isActive ? "text-white" : "text-current"
          )}
        />
        <span className="truncate">{label}</span>
      </div>
      <ChevronDown
        className={cn(
          "h-4 w-4 shrink-0 transition-transform duration-200",
          isExpanded ? "rotate-180" : ""
        )}
      />
    </button>
  );
}
