interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

/** Centered section title block: big title + muted subtitle. */
export default function SectionHeader({
  title,
  subtitle,
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`space-y-1 text-center mb-3 ${className}`}>
      <h2 className="text-2xl font-bold leading-tight text-secondary md:text-3xl">
        {title}
      </h2>
      {subtitle && (
        <p className="text-base text-gray-500 md:text-lg">{subtitle}</p>
      )}
    </div>
  );
}
