import { cn } from "@/src/lib/utils";
import { type LucideIcon } from "lucide-react";
import Link from "next/link";

interface SidebarSimpleLinkProps {
  label: string;
  icon: LucideIcon;
  href: string;
  isActive: boolean;
  onNavigate: () => void;
}

export default function SidebarSimpleLink({
  label,
  icon: Icon,
  href,
  isActive,
  onNavigate,
}: SidebarSimpleLinkProps) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "w-full h-11 flex items-center gap-2.5 px-3 text-sm rounded-sm transition-colors",
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
      <span className="truncate">{label}</span>
    </Link>
  );
}
