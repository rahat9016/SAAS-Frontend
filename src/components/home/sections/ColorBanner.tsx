import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface ColorBannerProps {
  title: string;
  ctaLabel: string;
  href?: string;
  /** full-width background color class, e.g. "bg-sky-300" */
  bg: string;
  /** text color class */
  text?: string;
  /** band height */
  height?: string;
}

/** Full-width solid-color promo band with centered title + arrow CTA. */
export default function ColorBanner({
  title,
  ctaLabel,
  href = "#",
  bg,
  text = "text-white",
  height = "min-h-[260px] md:min-h-[340px]",
}: ColorBannerProps) {
  return (
    <Link href={href} className={`group block w-full ${bg}`}>
      <div className={`container flex flex-col items-center justify-center px-4 text-center ${height} ${text}`}>
        <h2 className="text-4xl font-bold md:text-6xl">{title}</h2>
        <span className="mt-3 inline-flex items-center gap-2 text-lg font-medium">
          {ctaLabel}
          <ArrowRight size={22} className="transition-transform group-hover:translate-x-1.5" />
        </span>
      </div>
    </Link>
  );
}
