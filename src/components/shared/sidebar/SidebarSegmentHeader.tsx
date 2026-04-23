interface SidebarSegmentHeaderProps {
  label: string;
}

export default function SidebarSegmentHeader({
  label,
}: SidebarSegmentHeaderProps) {
  return (
    <p className="px-3 pt-3 pb-1 text-sm font-semibold uppercase tracking-wide text-primary">
      {label}
    </p>
  );
}
