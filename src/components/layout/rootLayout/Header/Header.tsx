"use client";

import { useEffect, useState } from "react";
import HeaderTopBar from "./HeaderTopBar";
import MobileNav from "./MobileNav";
import NavItems from "./NavItems";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="relative">
      <div
        className={`fixed top-0 left-0 w-full z-50 transition-shadow duration-300 ${
          scrolled ? "shadow-md" : ""
        }`}
      >
        {/* Top Row: Logo + Search + Actions */}
        <HeaderTopBar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

        {/* Bottom Row: Category Navigation (desktop only) */}
        <NavItems />
      </div>

      {/* Mobile category drawer + bottom bar */}
      <MobileNav open={menuOpen} setOpen={setMenuOpen} />

      {/* Spacer to push content below the fixed header */}
      <div className="h-[100px] lg:h-[112px]" />
    </header>
  );
};

export default Header;
