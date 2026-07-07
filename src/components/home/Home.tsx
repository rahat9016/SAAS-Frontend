import ProductCarousel from "./common/ProductCarousel";
import Section from "./common/Section";
import {
    boards,
    brandPromos,
    brandStories,
    makeProducts,
    nikeBanner,
    outfitLooks,
    philipsBanner,
    weightlessBanner,
} from "./data/homeData";
import BoardRow from "./sections/BoardRow";
import BrandPromoRow from "./sections/BrandPromoRow";
import BrandStoryRow from "./sections/BrandStoryRow";
import FeatureGridSection from "./sections/FeatureGridSection";
import HeroBanner from "./sections/HeroBanner";
import OutfitInspiration from "./sections/OutfitInspiration";

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero — stacked full-width color banners */}
      <HeroBanner
        title="Especial Summer Offer"
        ctaLabel="Save Now"
        href="/categories"
        bg="bg-sky-300"
      />
      <HeroBanner
        title="Monthly Inspiration"
        ctaLabel="Read Now"
        href="/categories"
        bg="bg-orange-200"
        image="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1600&q=80"
      />

      {/* Stores that inspire */}
      <Section bg="bg-white">
        <BrandStoryRow
          title="Stores that inspire"
          subtitle="Curated weekly"
          stories={brandStories}
        />
      </Section>

      {/* Nike feature + grid */}
      <Section bg="bg-light">
        <FeatureGridSection
          banner={nikeBanner}
          products={makeProducts("nike", 10)}
        />
      </Section>

      {/* Explore boards */}
      <Section bg="bg-white">
        <BoardRow
          title="Explore boards"
          subtitle="Find inspiration for any moment"
          boards={boards}
        />
      </Section>

      {/* Summer deals (Philips) */}
      <Section bg="bg-light">
        <BrandPromoRow
          banner={philipsBanner}
          products={makeProducts("philips", 12)}
          rows={1}
        />
      </Section>

      {/* Weightless icons + grid */}
      <Section bg="bg-light">
        <FeatureGridSection
          banner={weightlessBanner}
          products={makeProducts("weightless", 10)}
        />
      </Section>

      {/* Repeating brand promo blocks — alternating bands */}
      {brandPromos.map((b, i) => (
        <Section key={i} bg={i % 2 === 0 ? "bg-white" : "bg-light"}>
          <BrandPromoRow
            banner={b.banner}
            products={b.products}
            bannerSide={b.bannerSide}
          />
        </Section>
      ))}

      {/* New arrivals carousel */}
      <Section bg="bg-white">
        <ProductCarousel
          title="Just in: designer"
          subtitle="Curated new arrivals"
          ctaLabel="View all"
          ctaHref="/products"
          products={makeProducts("justin", 12)}
        />
      </Section>

      {/* Outfit inspiration */}
      <Section bg="bg-light">
        <OutfitInspiration
          title="Outfit inspiration"
          subtitle="Snap their style"
          looks={outfitLooks}
        />
      </Section>
    </div>
  );
}
