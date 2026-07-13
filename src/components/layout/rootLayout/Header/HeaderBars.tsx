"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import HeaderTopBar from "./HeaderTopBar";
import MobileNav from "./MobileNav";
import NavItems from "./NavItems";
import UtilityBar from "./UtilityBar";

export default function HeaderBars() {
  const [scrolled, setScrolled] = useState(false);
  const [showUtility, setShowUtility] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 10);
      // Utility strip hides while scrolling down, returns on scroll up / at top.
      if (y <= 10) setShowUtility(true);
      else if (Math.abs(y - lastY.current) > 4)
        setShowUtility(y < lastY.current);
      lastY.current = y;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div
        className={`relative w-full transition-shadow duration-300 ${
          scrolled ? "shadow-md" : ""
        }`}
      >
        <motion.div
          initial={false}
          animate={{ height: showUtility ? "auto" : 0 }}
          transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
          className="overflow-hidden"
        >
          <UtilityBar />
        </motion.div>
        <HeaderTopBar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <NavItems />
      </div>
      <MobileNav open={menuOpen} setOpen={setMenuOpen} />
    </>
  );
}
