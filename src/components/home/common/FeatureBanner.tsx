import Image from "next/image";
import Link from "next/link";
import { cn } from "@/src/lib/utils";
import { BannerContent } from "./homeTypes";

interface FeatureBannerProps extends BannerContent {
  /** aspect ratio utility, e.g. "aspect-[16/9]" or "aspect-[3/4]" */
  ratio?: string;
  align?: "start" | "center" | "end";
  className?: string;
  /** Constrain the overlay text to a centered max-w-7xl container. */
  contained?: boolean;
  /** larger hero-scale typography */
  large?: boolean;
}

/** Reusable image banner with overlaid eyebrow/title/subtitle + CTA. */
export default function FeatureBanner({
  image,
  eyebrow,
  title,
  subtitle,
  ctaLabel,
  ctaHref = "#",
  theme = "light",
  ratio = "aspect-[16/9]",
  align = "start",
  className = "",
  contained = false,
  large = false,
}: FeatureBannerProps) {
  const text = theme === "light" ? "text-white" : "text-secondary";
  const eyebrowCls = large ? "text-sm md:text-lg" : "text-xs";
  const titleCls = large
    ? "max-w-2xl text-4xl md:text-6xl lg:text-7xl leading-[1.15] md:leading-[1.2]"
    : "max-w-md text-2xl md:text-4xl leading-tight";
  const subtitleCls = large
    ? "max-w-xl text-base md:text-2xl"
    : "max-w-md text-sm md:text-base";
  const alignCls =
    align === "center"
      ? "items-center text-center"
      : align === "end"
        ? "items-end text-right"
        : "items-start text-left";

  return (
    <Link
      href={ctaHref}
      className={cn(
        "group relative block w-full overflow-hidden rounded-2xl",
        ratio,
        className,
      )}
    >
      <Image
        src={image}
        alt={title}
        fill
        sizes="100vw"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
      <div className={cn("absolute inset-0 flex flex-col justify-end", text)}>
        <div
          className={cn(
            "flex w-full flex-col gap-2",
            alignCls,
            contained
              ? "container px-4 sm:px-6 lg:px-8 py-5 md:py-8"
              : "p-5 md:p-8",
          )}
        >
          {eyebrow && (
            <span className={cn("font-semibold uppercase tracking-widest opacity-90", eyebrowCls)}>
              {eyebrow}
            </span>
          )}
          <h3 className={cn("font-bold leading-tight", titleCls)}>{title}</h3>
          {subtitle && <p className={cn("opacity-90", subtitleCls)}>{subtitle}</p>}
          {ctaLabel && (
            <span className="mt-2 inline-flex w-fit rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary/90 group-hover:scale-105">
              {ctaLabel}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
