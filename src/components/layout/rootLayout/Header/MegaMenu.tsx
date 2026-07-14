"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MegaMenuData } from "./megaMenuData";

interface MegaMenuProps {
  data: MegaMenuData;
  /** changes per category — used to crossfade the content on switch */
  menuKey: string;
  onNavigate?: () => void;
}

/** Full-width category mega-menu panel (3 icon columns + promo card). */
export default function MegaMenu({ data, menuKey, onNavigate }: MegaMenuProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="absolute inset-x-0 top-full z-40 border-t border-gray-100 bg-white shadow-[0_12px_24px_rgba(0,0,0,0.08)]"
    >
      <motion.div
        key={menuKey}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
        className="container grid grid-cols-4 gap-6 pt-2 pb-4 min-[1024px]:max-[1480px]:pt-3"
      >
        {data.columns.map((col) => (
          <div key={col.heading}>
            <h4 className="text-center text-base font-bold text-gray-400 ">
              {col.heading}
            </h4>
            {/* 5 items per sub-column, filled column-wise */}
            <ul className="grid grid-flow-col grid-rows-5 gap-x-2 xl:gap-x-4 min-[1024px]:max-[1480px]:gap-x-3">
              {col.items.map(({ label, href, icon: Icon, highlight }) => (
                <li key={label} className="">
                  <Link
                    href={href}
                    onClick={onNavigate}
                    className={`group/i flex items-center gap-0.5 xl:gap-3 rounded-md px-0 xl:px-2 py-0.5 xl:py-1.5 -mx-2 text-xs xl:sm transition-colors duration-150 ${
                      highlight
                        ? "font-semibold text-red-500 hover:bg-red-50"
                        : "text-foreground hover:bg-light hover:text-primary"
                    }`}
                  >
                    <Icon
                      size={18}
                      strokeWidth={1.6}
                      className="shrink-0 transition-transform duration-150 group-hover/i:scale-110"
                    />
                    <span>{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
