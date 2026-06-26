import type { LucideIcon } from "lucide-react";

interface FooterColumnProps {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
}

/** A footer column: icon heading + arbitrary content. */
export default function FooterColumn({ icon: Icon, title, children }: FooterColumnProps) {
  return (
    <div>
      <h4 className="mb-5 flex items-center gap-2 text-lg font-bold text-secondary sm:text-xl">
        <Icon size={22} strokeWidth={1.6} className="shrink-0" /> {title}
      </h4>
      {children}
    </div>
  );
}
