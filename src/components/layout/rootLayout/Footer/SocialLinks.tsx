import Link from "next/link";
import { FaFacebookF, FaInstagram, FaPinterest, FaTiktok } from "react-icons/fa6";

const SOCIALS = [FaFacebookF, FaInstagram, FaPinterest, FaTiktok];

/** Social media icon links. */
export default function SocialLinks() {
  return (
    <div className="pt-6 pr-32 lg:pr-36">
      <p className="mb-2 text-sm font-bold text-secondary">You can also find us on</p>
      <div className="flex items-center gap-2">
        {SOCIALS.map((Icon, i) => (
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
  );
}
