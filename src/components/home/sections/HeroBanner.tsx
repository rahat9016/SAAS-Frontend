import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { HeroBannerProps } from "../types";

export default function HeroBanner({
  title,
  ctaLabel,
  href = "#",
  bg,
  image,
  text = "text-white",
  height = "min-h-[180px] sm:min-h-[260px] md:min-h-[340px]",
  imagePosition = "object-cover",
}: HeroBannerProps) {
  return (
    <div
      className={`group relative block w-full overflow-hidden ${image ? "" : bg}`}
    >
      {image && (
        <>
          {/* Using native img ensures the height perfectly matches the image's original aspect ratio */}
          <img
            src={image}
            alt={title}
            className={`w-full h-auto block ${imagePosition} transition-transform duration-700 group-hover:scale-105`}
          />
          <div className="absolute inset-0 bg-black/35" />
        </>
      )}
      <div
        className={`container ${
          image ? "absolute inset-0" : `relative ${height}`
        } flex flex-col items-center justify-center px-4 text-center ${text}`}
      >
        <h2 className="text-2xl font-bold sm:text-4xl md:text-6xl">{title}</h2>
        <Link
          href={href}
          className="mt-2 inline-flex items-center gap-2 rounded-full border border-current/20 bg-white/10 px-4 py-2 text-base font-medium transition-colors hover:bg-white/20 sm:mt-3 sm:text-lg"
        >
          {ctaLabel}
          <ArrowRight
            size={20}
            className="transition-transform group-hover:translate-x-1.5"
          />
        </Link>
      </div>
    </div>
  );
}
