import { siteConfig } from "@/src/config/siteConfig";
import Image from "next/image";
import Link from "next/link";

/** Brand logo: squirrel icon + two-tone wordmark + slogan. */
export default function BrandLogo({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md";
  className?: string;
}) {
  const badge = size === "sm" ? 44 : 64;
  const text = size === "sm" ? "text-lg" : "text-2xl xl:text-3xl";
  const sub = size === "sm" ? "text-[1.2vh]" : "text-[1.2vh]";

  // Split the site name into two words for the two-tone wordmark.
  const [first, ...rest] = siteConfig.name.split(" ");
  const second = rest.join(" ");

  return (
    <Link
      href="/"
      aria-label={siteConfig.name}
      className={`group flex items-center gap-2.5 ${className}`}
    >
      {/* Logo icon */}
      <Image
        src="/logo.png"
        alt={siteConfig.name}
        width={badge}
        height={badge}
        priority
        className="shrink-0 object-contain transition-transform duration-200 group-hover:scale-105"
      />

      {/* Wordmark */}
      <span className="flex flex-col leading-none">
        <span className={`font-brand font-bold tracking-tight ${text}`}>
          <span className="text-secondary">{first}</span>
          {second && <span className="text-primary"> {second}</span>}
        </span>
        <span
          className={`mt-1 flex w-full justify-between font-medium text-gray-400 ${sub}`}
          aria-label="Try Virtually. Wear Perfectly"
        >
          {"TRY VIRTUALLY. WEAR PERFECTLY".split("").map((char, i) => (
            <span key={i} aria-hidden="true">
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </span>
      </span>
    </Link>
  );
}
