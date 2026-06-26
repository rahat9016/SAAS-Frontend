import Link from "next/link";
import type { FooterLink } from "../footerData";

interface FooterLinkListProps {
  links: FooterLink[];
  /** "list" = stacked rows, "grid" = 2-column compact grid */
  variant?: "list" | "grid";
  /** bold + dark first link (used for the lead "Help" link) */
  firstBold?: boolean;
}

/** Vertical or 2-column list of footer links. */
export default function FooterLinkList({
  links,
  variant = "list",
  firstBold = false,
}: FooterLinkListProps) {
  if (variant === "grid") {
    return (
      <div className="grid grid-cols-2 gap-x-6 gap-y-3">
        {links.map((l, i) => (
          <Link
            key={l.label}
            href={l.href}
            className={`text-sm transition-colors hover:text-primary ${
              firstBold && i === 0 ? "font-bold text-secondary" : "text-gray-600"
            }`}
          >
            {l.label}
          </Link>
        ))}
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {links.map((l) => (
        <li key={l.label}>
          <Link
            href={l.href}
            className="text-sm text-gray-600 transition-colors hover:text-primary"
          >
            {l.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
