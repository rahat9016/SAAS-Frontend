"use client";

import CategorySidebar from "./CategorySidebar";
import FlashSaleCards from "./FlashSaleCards";
import HeroBanner from "./HeroBanner";
import TrustBar from "./TrustBar";

export default function EcommerceHero() {
  return (
    <section className="bg-gray-50 py-4 lg:py-5">
      <div className="container">
        {/* Main hero area: sidebar + banner */}
        <div className="flex gap-4 lg:gap-5 items-stretch">
          {/* Category Sidebar — Desktop only */}
          <CategorySidebar />

          {/* Right side: Banner + Flash Sale (Desktop) */}
          <div className="flex-1 min-w-0">
            <HeroBanner />
            {/* Flash sale — desktop only inside container */}
            <div className="hidden lg:block">
              <FlashSaleCards />
            </div>
          </div>
        </div>

        {/* Trust bar — Desktop only inside container */}
        <div className="hidden lg:block">
          <TrustBar />
        </div>
      </div>

      {/* Flash sale — mobile: full-width scroll */}
      <div className="lg:hidden px-4 mt-3">
        <FlashSaleCards />
      </div>

      {/* Trust bar — mobile: full-width scroll */}
      <div className="lg:hidden px-4 mt-3">
        <TrustBar />
      </div>
    </section>
  );
}
