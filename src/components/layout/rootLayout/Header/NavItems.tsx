"use client";

import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import MegaMenu from "./MegaMenu";
import { getMegaMenu } from "./megaMenuData";
import { navLinks } from "./navLinks";

const GENDER_TABS = ["Women", "Men", "Kids"] as const;

export default function NavItems() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<(typeof GENDER_TABS)[number]>("Women");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const open = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(label);
  };
  // Small delay so moving the cursor link → panel doesn't flicker.
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 120);
  };
  const close = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(null);
  };

  return (
    <nav
      className="relative hidden lg:block bg-white border-b border-gray-100"
      onMouseLeave={scheduleClose}
      onMouseEnter={() => closeTimer.current && clearTimeout(closeTimer.current)}
    >
      <div className="container flex items-center gap-5 h-12">
        {/* Women / Men / Kids pill tabs */}
        <div className="flex items-center gap-1.5 pr-5 mr-1 border-r border-gray-200">
          {GENDER_TABS.map((tab) => {
            const active = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors cursor-pointer ${
                  active ? "bg-secondary text-white" : "text-secondary hover:bg-gray-100"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Category links */}
        <div className="flex items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {navLinks.map(({ label, href, isHighlighted }) => {
            const isActive =
              pathname === href || pathname.startsWith(href.split("?")[0] + "/");
            const isOpen = openMenu === label;

            return (
              <Link
                key={label}
                href={href}
                onMouseEnter={() => open(label)}
                className={`relative px-2.5 py-1.5 text-sm transition-colors whitespace-nowrap after:absolute after:left-2.5 after:right-2.5 after:-bottom-[1px] after:h-0.5 after:rounded-full after:bg-primary after:transition-transform after:duration-200 ${
                  isOpen ? "after:scale-x-100" : "after:scale-x-0"
                } ${
                  isHighlighted
                    ? "font-bold text-red-500 hover:text-red-600"
                    : isActive || isOpen
                      ? "text-primary font-semibold"
                      : "text-secondary hover:text-primary"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Animated mega-menu panel on hover */}
      <AnimatePresence>
        {openMenu && (
          <MegaMenu
            data={getMegaMenu(openMenu)}
            menuKey={openMenu}
            onNavigate={close}
          />
        )}
      </AnimatePresence>
    </nav>
  );
}
