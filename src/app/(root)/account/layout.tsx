"use client";

import { selectCanViewOwnOrders } from "@/src/lib/redux/features/permission/permissionSelectors";
import { useAppSelector } from "@/src/lib/redux/hooks";
import {
    CreditCard,
    MapPin,
    Package,
    RotateCcw,
    User,
    XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarSections = [
  {
    title: "Manage My Account",
    items: [
      { label: "My Profile", href: "/account", icon: User },
      { label: "Address Book", href: "/account/addresses", icon: MapPin },
      {
        label: "Payment Methods",
        href: "/account/payment-methods",
        icon: CreditCard,
      },
    ],
  },
  {
    title: "My Orders",
    items: [
      { label: "My Orders", href: "/account/orders", icon: Package },
      { label: "My Returns", href: "/account/returns", icon: RotateCcw },
      {
        label: "My Cancellations",
        href: "/account/cancellations",
        icon: XCircle,
      },
    ],
  },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { userInformation } = useAppSelector((state) => state.auth);
  const canViewOwnOrders = useAppSelector(selectCanViewOwnOrders);

  const visibleSidebarSections = canViewOwnOrders
    ? sidebarSections
    : sidebarSections.filter((section) => section.title !== "My Orders");

  return (
    <div className="container px-4 sm:px-6 lg:px-8">
      <div className="py-6 lg:py-8 pb-20 lg:pb-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link
            href="/"
            className="hover:text-primary transition-colors no-underline"
          >
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">My Account</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* ═══════ SIDEBAR (Desktop) ═══════ */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-32.5 bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
              {/* User Card */}
              <div className="p-5 bg-linear-to-br from-primary/5 to-primary/10 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  {userInformation?.profilePicture ? (
                    <Image
                      src={userInformation.profilePicture}
                      alt={userInformation.firstName}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center ring-2 ring-white shadow-sm">
                      <User size={20} className="text-primary" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {userInformation?.firstName} {userInformation?.lastName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {userInformation?.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Nav Sections */}
              <nav className="p-3">
                {visibleSidebarSections.map((section, idx) => (
                  <div key={section.title}>
                    {idx > 0 && (
                      <div className="my-2 border-t border-gray-100" />
                    )}
                    <p className="px-3 py-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                      {section.title}
                    </p>
                    {section.items.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all no-underline ${
                            isActive
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                        >
                          <item.icon
                            size={16}
                            className={
                              isActive ? "text-primary" : "text-gray-400"
                            }
                          />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </nav>
            </div>
          </aside>

          {/* ═══════ MOBILE TABS (Horizontal scroll) ═══════ */}
          <div className="lg:hidden overflow-x-auto scrollbar-hide -mx-4 px-4">
            <div className="flex gap-2 pb-3 min-w-max">
              {visibleSidebarSections.flatMap((section) =>
                section.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all no-underline border ${
                        isActive
                          ? "bg-primary text-white border-primary shadow-sm"
                          : "bg-white text-gray-600 border-gray-200 hover:border-primary/30 hover:text-primary"
                      }`}
                    >
                      <item.icon size={14} />
                      {item.label}
                    </Link>
                  );
                })
              )}
            </div>
          </div>

          {/* ═══════ MAIN CONTENT ═══════ */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
