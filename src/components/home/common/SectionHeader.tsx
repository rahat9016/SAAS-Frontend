import Link from "next/link";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

/** Reusable section title block: big title + muted subtitle + optional link. */
export default function SectionHeader({
  title,
  subtitle,
  ctaLabel,
  ctaHref = "#",
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`flex items-end justify-between gap-4 mb-4 ${className}`}>
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-secondary leading-tight">
          {title}
        </h2>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {ctaLabel && (
        <Link
          href={ctaHref}
          className="shrink-0 text-sm font-semibold text-secondary underline underline-offset-4 hover:text-primary transition-colors"
        >
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}
