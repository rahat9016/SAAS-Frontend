"use client";

import { useGet } from "@/src/hooks/useGet";
import { useEffect, useState } from "react";
import HeaderTopBar from "./HeaderTopBar"; // Keep your existing TopBar
import Logo from "./Logo";
import MobileNav from "./MobileNav";
import NavItems from "./NavItems";
import { Specialty } from "./types";

const Header = () => {
  const { data } = useGet<Specialty[]>("/specialties", ["specialties"]);

  const [showTopBar, setShowTopBar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 50) {
        setShowTopBar(false);
      } else {
        setShowTopBar(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header className="relative">
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-lg transition-all duration-300">
        <HeaderTopBar show={showTopBar} />
        <div className="h-20 md:h-24 lg:h-28 flex items-center">
          <div className="container flex items-center justify-between">
            <Logo />
            <NavItems specialty={data?.data} />
            <MobileNav specialty={data?.data} />
          </div>
        </div>
      </div>
      <div className={"h-20 md:h-24 lg:h-40"}></div>
    </header>
  );
};

export default Header;
