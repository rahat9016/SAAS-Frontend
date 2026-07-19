"use client";

import { useScroll, useMotionValueEvent } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import HeaderTopBar from "./HeaderTopBar";
import MobileNav from "./MobileNav";
import NavItems from "./NavItems";
import UtilityBar from "./UtilityBar";

export default function HeaderBars() {
  const [scrolled, setScrolled] = useState(false);
  const [showUtility, setShowUtility] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  
  const [utilityHeight, setUtilityHeight] = useState(0);
  const utilityRef = useRef<HTMLDivElement>(null);
  
  const { scrollY } = useScroll();

  useEffect(() => {
    const el = utilityRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      setUtilityHeight(el.offsetHeight);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 10);
    setShowUtility(latest <= 10);
  });

  return (
    <>
      <div
        className={`relative w-full bg-white transition-all duration-300 ease-in-out ${
          scrolled ? "shadow-md" : ""
        }`}
        style={{ transform: `translateY(${showUtility ? 0 : -utilityHeight}px)` }}
      >
        <div ref={utilityRef}>
          <UtilityBar />
        </div>
        <HeaderTopBar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <NavItems />
      </div>
      <MobileNav open={menuOpen} setOpen={setMenuOpen} />
    </>
  );
}
