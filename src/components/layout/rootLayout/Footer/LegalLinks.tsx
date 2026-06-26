import Link from "next/link";
import { legalLinks } from "../footerData";

/** Legal links row + VAT note. */
export default function LegalLinks() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        {legalLinks.map((l) => (
          <Link
            key={l.label}
            href={l.href}
            className="text-xs text-gray-600 transition-colors hover:text-primary"
          >
            {l.label}
          </Link>
        ))}
      </div>
      <p className="text-xs text-gray-500">All prices include VAT</p>
    </div>
  );
}
