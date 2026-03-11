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

          {/* Right side: Banner + Flash Sale */}
          <div className="flex-1 min-w-0">
            <HeroBanner />
            <FlashSaleCards />
          </div>
        </div>

        {/* Trust bar — Full width */}
        <TrustBar />
      </div>
    </section>
  );
}
