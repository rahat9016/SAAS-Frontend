"use client";

import { cn } from "@/src/lib/utils";
import SidebarLogo from "./SidebarLogo";
import SidebarLogout from "./SidebarLogout";
import SidebarMenu from "./SidebarMenu";

interface SidebarProps {
  className?: string;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export default function Sidebar({
  className,
  isOpen,
  setIsOpen,
}: SidebarProps) {
  const handleNavigate = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    setIsOpen(false);
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 h-screen w-70 bg-white border-r border-skeleton flex flex-col px-4 sm:px-5 transition-transform duration-300 ease-in-out z-50",
          {
            "-translate-x-full": !isOpen,
            "translate-x-0": isOpen,
            "lg:translate-x-0 lg:static": true,
          },
          className
        )}
      >
        <SidebarLogo />
        <SidebarMenu onNavigate={handleNavigate} />
        <SidebarLogout onLogout={handleLogout} />
      </aside>
    </>
  );
}
