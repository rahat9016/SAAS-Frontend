import { siteConfig } from "@/src/config/siteConfig";
import { Star } from "lucide-react";
import Link from "next/link";

/** Brand logo: star icon + site name. */
export default function BrandLogo({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md";
  className?: string;
}) {
  const star = size === "sm" ? 26 : 34;
  const text = size === "sm" ? "text-lg" : "text-2xl";
  return (
    <Link href="/" aria-label={siteConfig.name} className={`flex items-center gap-2 ${className}`}>
      <Star
        size={star}
        className="fill-yellow-400 text-red-500"
        strokeWidth={1.5}
      />
      <span className={`font-bold tracking-tight text-secondary ${text}`}>
        {siteConfig.name}
      </span>
    </Link>
  );
}
