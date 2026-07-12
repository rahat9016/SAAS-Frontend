import Link from "next/link";

interface SectionCtaProps {
  label: string;
  href?: string;
  className?: string;
}

/** Right-aligned "View all" style link, rendered by a section next to its content. */
export default function SectionCta({
  label,
  href = "/categories",
  className = "",
}: SectionCtaProps) {
  return (
    <div className={`mb-3 flex justify-end ${className}`}>
      <Link
        href={href}
        className="inline-block text-sm font-semibold text-secondary underline underline-offset-4 transition-colors hover:text-primary"
      >
        {label}
      </Link>
    </div>
  );
}
