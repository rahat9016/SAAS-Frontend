import Link from "next/link";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

/** Centered section title block: big title + muted subtitle + optional link. */
export default function SectionHeader({
  title,
  subtitle,
  ctaLabel,
  ctaHref = "#",
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`space-y-1 text-center mb-4 ${className}`}>
      <h2 className="text-2xl font-bold leading-tight text-secondary md:text-3xl">
        {title}
      </h2>
      {subtitle && (
        <p className="text-base text-gray-500 md:text-lg">{subtitle}</p>
      )}
      {ctaLabel && (
        <Link
          href={ctaHref}
          className="inline-block text-sm font-semibold text-secondary underline underline-offset-4 hover:text-primary transition-colors"
        >
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}
