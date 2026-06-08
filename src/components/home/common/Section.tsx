import { cn } from "@/src/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  /** full-width background (tailwind class), e.g. "bg-light" */
  bg?: string;
  className?: string;
}

/** Full-width colored band with a centered max-w-7xl content container. */
export default function Section({ children, bg = "bg-white", className }: SectionProps) {
  return (
    <section className={cn("w-full", bg)}>
      <div className={cn("container px-4 sm:px-6 lg:px-8 py-8 md:py-12", className)}>
        {children}
      </div>
    </section>
  );
}
