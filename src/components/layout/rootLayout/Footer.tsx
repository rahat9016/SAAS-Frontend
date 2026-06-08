import Link from "next/link";
import {
  CreditCard,
  Gift,
  HelpCircle,
  Info,
  ShoppingBag,
  Truck,
} from "lucide-react";
import {
  FaApple,
  FaCcAmex,
  FaCcApplePay,
  FaCcDinersClub,
  FaCcDiscover,
  FaCcMastercard,
  FaCcPaypal,
  FaCcVisa,
  FaFacebookF,
  FaGooglePlay,
  FaInstagram,
  FaPinterest,
  FaTiktok,
} from "react-icons/fa6";
import { SiDhl, SiKlarna } from "react-icons/si";
import { siteConfig } from "@/src/config/siteConfig";
import {
  aboutLinks,
  FooterLink,
  giftCardLinks,
  helpLinks,
  legalLinks,
  moreBrands,
  moreInspiration,
  promises,
} from "./footerData";

const PAYMENTS = [
  { Icon: FaCcVisa, color: "#1A1F71", label: "Visa" },
  { Icon: FaCcMastercard, color: "#EB001B", label: "Mastercard" },
  { Icon: FaCcPaypal, color: "#003087", label: "PayPal" },
  { Icon: FaCcAmex, color: "#2E77BC", label: "American Express" },
  { Icon: FaCcDiscover, color: "#FF6000", label: "Discover" },
  { Icon: FaCcDinersClub, color: "#0079BE", label: "Diners Club" },
  { Icon: FaCcApplePay, color: "#000000", label: "Apple Pay" },
  { Icon: SiKlarna, color: "#FFB3C7", label: "Klarna" },
];

function LinkGrid({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <h3 className="mb-5 text-2xl font-bold text-secondary">{title}</h3>
      <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 lg:grid-cols-4">
        {links.map((l) => (
          <Link
            key={l.label}
            href={l.href}
            className="text-sm text-secondary hover:text-primary transition-colors"
          >
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-8 items-center rounded-md border border-gray-200 bg-white px-2.5 text-[11px] font-semibold text-gray-600">
      {children}
    </span>
  );
}

const Footer = () => {
  return (
    <footer className="bg-light">
      {/* More Brands + More Inspiration */}
      <div className="container space-y-10 px-4 py-12">
        <LinkGrid title="More Brands" links={moreBrands} />
        <LinkGrid title="More Inspiration" links={moreInspiration} />
      </div>

      {/* Main footer columns */}
      <div className="border-t border-gray-200">
        <div className="container grid gap-10 px-4 py-12 lg:grid-cols-3">
          {/* Help & Contact */}
          <div>
            <h4 className="mb-5 flex items-center gap-2 text-xl font-bold text-secondary">
              <HelpCircle size={22} strokeWidth={1.6} /> Help &amp; Contact
            </h4>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {helpLinks.map((l, i) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className={`text-sm transition-colors hover:text-primary ${
                    i === 0 ? "font-bold text-secondary" : "text-gray-600"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Gift Cards */}
          <div>
            <h4 className="mb-5 flex items-center gap-2 text-xl font-bold text-secondary">
              <Gift size={22} strokeWidth={1.6} /> Gift Cards
            </h4>
            <ul className="space-y-3">
              {giftCardLinks.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-gray-600 hover:text-primary transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About us */}
          <div>
            <h4 className="mb-5 flex items-center gap-2 text-xl font-bold text-secondary">
              <Info size={22} strokeWidth={1.6} /> About us
            </h4>
            <ul className="space-y-3">
              {aboutLinks.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-gray-600 hover:text-primary transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Partners / Payments / Promises */}
        <div className="container grid gap-10 px-4 pb-12 md:grid-cols-3">
          <div>
            <h4 className="mb-4 flex items-center gap-2 text-xl font-bold text-secondary">
              <Truck size={22} strokeWidth={1.6} /> Our partners
            </h4>
            <div className="flex flex-wrap items-center gap-2">
              <span
                title="DHL"
                className="grid h-9 w-14 place-items-center rounded-md border border-gray-200 bg-[#FFCC00]"
              >
                <SiDhl size={34} color="#D40511" />
              </span>
              <Chip>Hermes</Chip>
            </div>
          </div>
          <div>
            <h4 className="mb-4 flex items-center gap-2 text-xl font-bold text-secondary">
              <CreditCard size={22} strokeWidth={1.6} /> Our payment methods
            </h4>
            <div className="flex flex-wrap gap-2">
              {PAYMENTS.map(({ Icon, color, label }) => (
                <span
                  key={label}
                  title={label}
                  className="grid h-9 w-12 place-items-center rounded-md border border-gray-200 bg-white"
                >
                  <Icon size={26} color={color} />
                </span>
              ))}
              <Chip>SEPA</Chip>
              <Chip>Invoice</Chip>
            </div>
          </div>
          <div>
            <h4 className="mb-4 flex items-center gap-2 text-xl font-bold text-secondary">
              <ShoppingBag size={22} strokeWidth={1.6} /> Our promises
            </h4>
            <ul className="space-y-2">
              {promises.map((p) => (
                <li key={p} className="text-sm text-gray-600">
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-200">
        <div className="container flex flex-col gap-8 px-4 py-8 lg:flex-row lg:items-start lg:justify-between">
          {/* Legal */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {legalLinks.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="text-xs text-gray-600 hover:text-primary transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
            <p className="text-xs text-gray-500">All prices include VAT</p>
          </div>

          {/* Apps */}
          <div>
            <p className="mb-2 text-sm font-bold text-secondary">{siteConfig.name} Apps</p>
            <div className="flex items-center gap-3">
              <div className="grid h-14 w-14 place-items-center rounded-md border border-gray-200 bg-white text-[9px] text-gray-400">
                QR
              </div>
              <div className="flex flex-col gap-2">
                <Link
                  href="#"
                  className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-white transition-transform hover:scale-105"
                >
                  <FaApple size={22} />
                  <span className="flex flex-col text-left leading-none">
                    <span className="text-[9px]">Download on the</span>
                    <span className="text-sm font-semibold">App Store</span>
                  </span>
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-white transition-transform hover:scale-105"
                >
                  <FaGooglePlay size={18} />
                  <span className="flex flex-col text-left leading-none">
                    <span className="text-[9px]">GET IT ON</span>
                    <span className="text-sm font-semibold">Google Play</span>
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* Social */}
          <div>
            <p className="mb-2 text-sm font-bold text-secondary">You can also find us on</p>
            <div className="flex items-center gap-2">
              {[FaFacebookF, FaInstagram, FaPinterest, FaTiktok].map((Icon, i) => (
                <Link
                  key={i}
                  href="#"
                  aria-label="social"
                  className="grid h-9 w-9 place-items-center rounded-md bg-secondary text-white transition-transform hover:scale-110"
                >
                  <Icon size={16} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
