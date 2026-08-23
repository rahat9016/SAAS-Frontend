import { cn } from "@/src/lib/utils";
import { type LucideIcon } from "lucide-react";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";

interface SidebarSimpleLinkProps {
  label: string;
  icon: LucideIcon;
  href: string;
  isActive: boolean;
  isCollapsed?: boolean;
  onNavigate: () => void;
}

export default function SidebarSimpleLink({
  label,
  icon: Icon,
  href,
  isActive,
  isCollapsed = false,
  onNavigate,
}: SidebarSimpleLinkProps) {
  const link = (
    <Link
      href={href}
      onClick={onNavigate}
      title={isCollapsed ? undefined : label}
      aria-label={label}
      className={cn(
        "w-full h-11 flex items-center gap-2.5 px-3 text-sm rounded-sm transition-colors",
        isCollapsed && "justify-center gap-0 px-0",
        isActive
          ? "bg-secondary text-white font-medium"
          : "text-secondary-dark font-normal hover:bg-[#EAF6FB] hover:text-primary"
      )}
    >
      <Icon
        className={cn(
          "w-5 h-5 shrink-0",
          isActive ? "text-white" : "text-current"
        )}
      />
      {!isCollapsed && <span className="truncate">{label}</span>}
    </Link>
  );

  if (!isCollapsed) return link;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right" sideOffset={8}>
        {label}
      </TooltipContent>
    </Tooltip>
  );
}
