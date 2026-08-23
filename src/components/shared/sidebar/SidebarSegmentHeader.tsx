import { cn } from "@/src/lib/utils";

interface SidebarSegmentHeaderProps {
  label: string;
  isCollapsed?: boolean;
}

export default function SidebarSegmentHeader({
  label,
  isCollapsed = false,
}: SidebarSegmentHeaderProps) {
  // In rail mode the section title has no room — a divider keeps the grouping.
  if (isCollapsed) {
    return <div className="mx-auto my-2 h-px w-6 bg-skeleton" aria-hidden />;
  }

  return (
    <p
      className={cn(
        "px-3 pt-3 pb-1 text-sm font-semibold uppercase tracking-wide text-primary"
      )}
    >
      {label}
    </p>
  );
}
