import Link from "next/link";
import type { FooterLink } from "../footerData";

interface FooterLinkGridProps {
  title: string;
  links: FooterLink[];
}

/** Big titled block with a responsive multi-column link grid. */
export default function FooterLinkGrid({ title, links }: FooterLinkGridProps) {
  return (
    <div>
      <h3 className="mb-5 text-xl font-bold text-secondary sm:text-2xl">{title}</h3>
      <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 lg:grid-cols-4">
        {links.map((l) => (
          <Link
            key={l.label}
            href={l.href}
            className="text-sm text-secondary transition-colors hover:text-primary"
          >
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
