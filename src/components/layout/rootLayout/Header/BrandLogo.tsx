import { siteConfig } from "@/src/config/siteConfig";
import Link from "next/link";

/** Brand logo: "FM" monogram badge + two-tone wordmark. */
export default function BrandLogo({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md";
  className?: string;
}) {
  const badge = size === "sm" ? 30 : 40;
  const text = size === "sm" ? "text-base" : "text-2xl";
  const sub = size === "sm" ? "text-[9px]" : "text-[11px]";

  // Split the site name into two words for the two-tone wordmark.
  const [first, ...rest] = siteConfig.name.split(" ");
  const second = rest.join(" ");

  return (
    <Link
      href="/"
      aria-label={siteConfig.name}
      className={`group flex items-center gap-2.5 ${className}`}
    >
      {/* Monogram badge */}
      <svg
        width={badge}
        height={badge}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-200 group-hover:scale-105"
        aria-hidden="true"
      >
        <rect
          x="2"
          y="2"
          width="44"
          height="44"
          rx="12"
          className="fill-primary"
        />
        <rect
          x="2"
          y="2"
          width="44"
          height="44"
          rx="12"
          className="stroke-secondary/10"
          strokeWidth="1"
        />
        <path
          d="M14 34V14h12.5v3.6H18.2v4.7h7.4V26h-7.4v8H14Z"
          className="fill-white"
        />
        <path
          d="M27.4 34V14h3.9l3.1 9.6L37.4 14H41v20h-3.6V22.3L34.7 31h-1.9l-2.7-8.7V34h-2.7Z"
          className="fill-white"
        />
      </svg>

      {/* Wordmark */}
      <span className="flex flex-col leading-none">
        <span className={`font-brand font-bold tracking-tight ${text}`}>
          <span className="text-secondary">{first}</span>
          {second && <span className="text-primary"> {second}</span>}
        </span>
        <span
          className={`mt-0.5 font-medium uppercase tracking-[0.25em] text-gray-400 ${sub}`}
        >
          Fashion House
        </span>
      </span>
    </Link>
  );
}
