"use client";

import { useAppSelector } from "@/src/lib/redux/hooks";
import BrandLogo from "./BrandLogo";
import GenderTabs from "./GenderTabs";
import HeaderTopBarActions from "./HeaderTopBarActions";
import HeaderTopBarSearch from "./HeaderTopBarSearch";
import LanguageDropdown from "./LanguageDropdown";
import { useHeaderSearch } from "./useHeaderSearch";

interface HeaderTopBarProps {
  menuOpen: boolean;
  setMenuOpen: (value: boolean) => void;
}

export default function HeaderTopBar({
  menuOpen,
  setMenuOpen,
}: HeaderTopBarProps) {
  const search = useHeaderSearch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const wishlistIds = useAppSelector((state) => state.wishlist.productIds);
  const { userInformation, loading: authLoading } = useAppSelector(
    (state) => state.auth
  );

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <div className="bg-white border-b border-gray-100">
      {/* ═══════ DESKTOP HEADER ═══════ */}
      <div className="hidden lg:block">
        {/* Row: gender tabs · centered logo · actions */}
        <div className="container relative flex items-center justify-between gap-4 h-16">
          <div className="flex-shrink-0 z-10">
            <GenderTabs />
          </div>

          <div className="xl:absolute xl:left-1/2 xl:-translate-x-1/2 z-0">
            <BrandLogo />
          </div>

          <div className="flex-shrink-0 z-10">
            <HeaderTopBarActions
              cartCount={cartCount}
              wishlistCount={wishlistIds.length}
              userInformation={userInformation}
              authLoading={authLoading}
            />
          </div>
        </div>
      </div>

      {/* ═══════ MOBILE HEADER (AliExpress-style) ═══════ */}
      <div className="lg:hidden">
        {/* Row 1: Hamburger (left) + centered Logo */}
        <div className="relative flex items-center justify-center px-4 h-12">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="absolute left-3 flex items-center justify-center w-8 h-8 text-gray-700 hover:text-primary transition-colors"
            aria-label="Open menu"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <BrandLogo size="sm" />

          <div className="absolute right-1">
            <LanguageDropdown />
          </div>
        </div>

        <HeaderTopBarSearch
          searchRef={search.searchRef}
          inputRef={search.inputRef}
          searchQuery={search.searchQuery}
          showResults={search.showResults}
          isSearching={search.isSearching}
          searchResults={search.searchResults}
          setSearchQuery={search.setSearchQuery}
          setShowResults={search.setShowResults}
          handleSearch={search.handleSearch}
          clearSearch={search.clearSearch}
          handleProductClick={search.handleProductClick}
          onViewAllResults={search.handleViewAllResults}
        />
      </div>
      </div>
    </>
  );
}
