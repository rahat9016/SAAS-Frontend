"use client";

import { useScroll, useMotionValueEvent } from "framer-motion";
import { useRef, useState } from "react";
import HeaderTopBar from "./HeaderTopBar";
import MobileNav from "./MobileNav";
import NavItems from "./NavItems";
import UtilityBar from "./UtilityBar";

export default function HeaderBars() {
  const [scrolled, setScrolled] = useState(false);
  const [showUtility, setShowUtility] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  
  const { scrollY } = useScroll();
  const lastYRef = useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 10);

    if (latest <= 10) {
      setShowUtility(true);
      lastYRef.current = latest;
      return;
    }

    const diff = latest - lastYRef.current;
    if (diff > 10) {
      // Scrolled down
      setShowUtility(false);
      lastYRef.current = latest;
    } else if (diff < -10) {
      // Scrolled up
      setShowUtility(true);
      lastYRef.current = latest;
    }
  });

  return (
    <>
      <div
        className={`relative w-full bg-white transition-shadow duration-300 ${
          scrolled ? "shadow-md" : ""
        }`}
      >
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out origin-top ${
            showUtility ? "max-h-[50px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <UtilityBar />
        </div>
        <HeaderTopBar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <NavItems />
      </div>
      <MobileNav open={menuOpen} setOpen={setMenuOpen} />
    </>
  );
}
