"use client";

import { siteConfig } from "@/src/config/siteConfig";
import { openLoginModal } from "@/src/lib/redux/features/auth/authSlice";
import { IUserInformation } from "@/src/lib/redux/features/auth/authTypes";
import { useAppDispatch } from "@/src/lib/redux/hooks";
import { Heart, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { ProfileDropdown } from "./ProfileDropdown";

interface HeaderTopBarActionsProps {
  cartCount: number;
  wishlistCount: number;
  userInformation: IUserInformation;
  authLoading: boolean;
}

export default function HeaderTopBarActions({
  cartCount,
  wishlistCount,
  userInformation,
  authLoading,
}: HeaderTopBarActionsProps) {
  const dispatch = useAppDispatch();

  return (
    <div className="flex items-center gap-1 lg:gap-2 shrink-0">
      <div className="hidden xl:flex items-center gap-1.5 px-3 py-2 text-xs text-gray-500">
        <span className="font-medium text-gray-700">{siteConfig.currency}</span>
      </div>

      <Link
        href="/wishlist"
        className="relative flex flex-col items-center gap-0.5 px-3 py-1.5 text-gray-600 hover:text-primary transition-colors group"
      >
        <Heart
          size={20}
          className="group-hover:scale-110 transition-transform"
        />
        <span className="text-xs">Wishlist</span>
        {wishlistCount > 0 && (
          <span className="absolute -top-0.5 right-1 min-w-4.5 h-4.5 flex items-center justify-center rounded-full bg-primary text-white text-[10px] font-bold px-1">
            {wishlistCount}
          </span>
        )}
      </Link>

      <Link
        href="/cart"
        className="relative flex flex-col items-center gap-0.5 px-3 py-1.5 text-gray-600 hover:text-primary transition-colors group"
      >
        <ShoppingCart
          size={20}
          className="group-hover:scale-110 transition-transform"
        />
        <span className="text-xs">Cart</span>
        {cartCount > 0 && (
          <span className="absolute -top-0.5 right-1 min-w-4.5 h-4.5 flex items-center justify-center rounded-full bg-primary text-white text-[10px] font-bold px-1">
            {cartCount > 99 ? "99+" : cartCount}
          </span>
        )}
      </Link>

      <div className="hidden lg:block w-px h-8 bg-gray-200 mx-1" />

      {authLoading ? (
        <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200">
          <div className="w-4 h-4 rounded-full bg-gray-200 animate-pulse" />
          <div className="w-14 h-2.5 bg-gray-200 rounded animate-pulse" />
        </div>
      ) : userInformation?.firstName ? (
        <ProfileDropdown />
      ) : (
        <button
          onClick={() => dispatch(openLoginModal())}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors cursor-pointer"
        >
          <User size={16} />
          <span className="whitespace-nowrap">Sign In</span>
        </button>
      )}
    </div>
  );
}
