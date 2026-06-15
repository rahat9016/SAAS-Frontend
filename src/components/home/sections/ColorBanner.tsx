import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ColorBannerProps {
  title: string;
  ctaLabel: string;
  href?: string;
  /** full-width background color class, e.g. "bg-sky-300" (fallback when no image) */
  bg: string;
  /** optional full-cover background image */
  image?: string;
  /** text color class */
  text?: string;
  /** band height */
  height?: string;
}

/** Full-width promo band (solid colour or cover image) with centered title + arrow CTA. */
export default function ColorBanner({
  title,
  ctaLabel,
  href = "#",
  bg,
  image,
  text = "text-white",
  height = "min-h-[180px] sm:min-h-[260px] md:min-h-[340px]",
}: ColorBannerProps) {
  return (
    <Link
      href={href}
      className={`group relative block w-full overflow-hidden ${image ? "" : bg}`}
    >
      {image && (
        <>
          <Image
            src={image}
            alt={title}
            fill
            sizes="100vw"
            priority
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/35" />
        </>
      )}
      <div
        className={`container relative flex flex-col items-center justify-center px-4 text-center ${height} ${text}`}
      >
        <h2 className="text-2xl font-bold sm:text-4xl md:text-6xl">{title}</h2>
        <span className="mt-2 inline-flex items-center gap-2 text-base font-medium sm:mt-3 sm:text-lg">
          {ctaLabel}
          <ArrowRight size={20} className="transition-transform group-hover:translate-x-1.5" />
        </span>
      </div>
    </Link>
  );
}
