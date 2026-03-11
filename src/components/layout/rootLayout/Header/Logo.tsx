import logo from "@/public/logo.png";
import { siteConfig } from "@/src/config/siteConfig";
import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <div className="flex items-center gap-3 sm:gap-5">
      <Link
        href="/"
        aria-label={siteConfig.name}
        className="shrink-0 flex items-center cursor-pointer"
      >
        <Image
          src={logo}
          alt={siteConfig.name}
          width={216}
          height={216}
          className="w-24 h-24"
        />
        <h2 className="text-sm 2xl:text-base text-secondary font-semibold">
          {siteConfig.name}
        </h2>
      </Link>
    </div>
  );
}
