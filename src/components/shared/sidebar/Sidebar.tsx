"use client";

import { useSidebarCollapsed } from "@/src/hooks/useSidebarCollapsed";
import { cn } from "@/src/lib/utils";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { TooltipProvider } from "../../ui/tooltip";
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
  const { isCollapsed, isDesktop, toggle } = useSidebarCollapsed();

  const handleNavigate = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    setIsOpen(false);
  };

  return (
    <TooltipProvider delayDuration={150}>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        data-collapsed={isCollapsed}
        className={cn(
          "group/sidebar fixed top-0 left-0 h-screen bg-white border-r border-skeleton flex flex-col transition-[width,transform] duration-300 ease-in-out z-50",
          isCollapsed ? "w-70 lg:w-20 lg:px-2 px-4 sm:px-5" : "w-70 px-4 sm:px-5",
          {
            "-translate-x-full": !isOpen,
            "translate-x-0": isOpen,
            "lg:translate-x-0 lg:static": true,
          },
          className
        )}
      >
        {isDesktop && (
          <button
            type="button"
            onClick={toggle}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-pressed={isCollapsed}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="hidden lg:flex absolute -right-3 top-20 h-6 w-6 items-center justify-center rounded-full border border-skeleton bg-white text-secondary-dark shadow-sm transition-colors hover:text-primary cursor-pointer z-10"
          >
            {isCollapsed ? (
              <PanelLeftOpen className="h-3.5 w-3.5" />
            ) : (
              <PanelLeftClose className="h-3.5 w-3.5" />
            )}
          </button>
        )}

        <SidebarLogo isCollapsed={isCollapsed} />
        <SidebarMenu isCollapsed={isCollapsed} onNavigate={handleNavigate} />
        <SidebarLogout isCollapsed={isCollapsed} onLogout={handleLogout} />
      </aside>
    </TooltipProvider>
  );
}
