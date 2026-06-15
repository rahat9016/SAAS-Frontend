import Link from "next/link";

/** Thin top utility strip: help / delivery / returns / gift cards. */
export default function UtilityBar() {
  return (
    <div className="hidden lg:block w-full bg-gray-100 text-secondary">
      <div className="container flex items-center justify-between py-1.5 text-xs font-semibold">
        <Link href="/help" className="hover:text-primary transition-colors">
          Help and contact
        </Link>
        <span className="text-gray-700">
          Free standard delivery over €34,90 &amp; free returns*
        </span>
        <Link href="/help/returns" className="hover:text-primary transition-colors">
          14-day return policy
        </Link>
        <Link href="/gift-cards" className="hover:text-primary transition-colors">
          Gift Cards
        </Link>
      </div>
    </div>
  );
}
