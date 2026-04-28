import { cn } from "@/src/lib/utils";
import Link from "next/link";

interface SidebarChildLinkProps {
  label: string;
  href: string;
  isActive: boolean;
  onNavigate: () => void;
}

export default function SidebarChildLink({
  label,
  href,
  isActive,
  onNavigate,
}: SidebarChildLinkProps) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "flex items-center h-10 px-3 rounded-sm text-sm transition-colors",
        isActive
          ? "text-primary font-medium "
          : "text-[#6B7280] hover:text-primary"
      )}
    >
      <span className="truncate">{label}</span>
    </Link>
  );
}
