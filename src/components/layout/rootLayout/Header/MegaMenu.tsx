"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
        className="container grid grid-cols-[repeat(3,1fr)_320px] gap-8 py-8"
      >
        {data.columns.map((col) => (
          <div key={col.heading}>
            <h4 className="mb-4 text-base font-bold text-gray-400">{col.heading}</h4>
            <ul className="space-y-1">
              {col.items.map(({ label, href, icon: Icon, highlight }) => (
                <li key={label}>
                  <Link
                    href={href}
                    onClick={onNavigate}
                    className={`group/i flex items-center gap-3 rounded-md px-2 py-1.5 -mx-2 text-sm transition-colors duration-150 ${
                      highlight
                        ? "font-semibold text-red-500 hover:bg-red-50"
                        : "text-foreground hover:bg-light hover:text-primary"
                    }`}
                  >
                    <Icon
                      size={20}
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

        {/* Promo card */}
        <Link href={data.promo.href} onClick={onNavigate} className="group block">
          <div className="relative aspect-[16/11] w-full overflow-hidden rounded-xl bg-light">
            <Image
              src={data.promo.image}
              alt={data.promo.label}
              fill
              sizes="320px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <p className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-secondary">
            {data.promo.label}
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </p>
        </Link>
      </motion.div>
    </motion.div>
  );
}
