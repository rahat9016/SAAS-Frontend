"use client";

import { siteConfig } from "@/src/config/siteConfig";
import Image from "next/image";
import Link from "next/link";
import HeaderActionIcons from "./HeaderActionIcons";
import HeaderNav from "./HeaderNav";
import HeaderProfile from "./HeaderProfile";
import HeaderSearchBar from "./HeaderSearchBar";

export default function DashboardHeader() {
  return (
    <div className="bg-white border-b border-skeleton">
      <div className="h-16 flex items-center px-3 md:px-6 gap-3 md:gap-5">
        <Link href="/admin" className="flex items-center gap-2 shrink-0">
          <Image
            width={216}
            height={216}
            src="/logo.png"
            alt="logo"
            className="w-8"
          />
          <span className="hidden sm:inline text-base font-semibold text-secondary-dark whitespace-nowrap">
            {siteConfig.name}
          </span>
        </Link>

        <HeaderSearchBar />

        <div className="flex items-center gap-1 md:gap-2 ml-auto shrink-0">
          <HeaderActionIcons />
          <HeaderProfile />
        </div>
      </div>

      <HeaderNav />
    </div>
  );
}
