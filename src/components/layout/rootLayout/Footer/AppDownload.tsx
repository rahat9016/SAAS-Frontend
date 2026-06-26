import Link from "next/link";
import { FaApple, FaGooglePlay } from "react-icons/fa6";
import { siteConfig } from "@/src/config/siteConfig";

const STORES = [
  { Icon: FaApple, size: 22, top: "Download on the", bottom: "App Store" },
  { Icon: FaGooglePlay, size: 18, top: "GET IT ON", bottom: "Google Play" },
];

/** QR + App Store / Google Play buttons. */
export default function AppDownload() {
  return (
    <div>
      <p className="mb-2 text-sm font-bold text-secondary">{siteConfig.name} Apps</p>
      <div className="flex items-center gap-3">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-md border border-gray-200 bg-white text-[9px] text-gray-400">
          QR
        </div>
        <div className="flex flex-col gap-2">
          {STORES.map(({ Icon, size, top, bottom }) => (
            <Link
              key={bottom}
              href="#"
              className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-white transition-transform hover:scale-105"
            >
              <Icon size={size} />
              <span className="flex flex-col text-left leading-none">
                <span className="text-[9px]">{top}</span>
                <span className="text-sm font-semibold">{bottom}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
