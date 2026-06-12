import ProductCarousel from "./common/ProductCarousel";
import Section from "./common/Section";
import AppPromo from "./sections/AppPromo";
import BoardRow from "./sections/BoardRow";
import BrandPromoRow from "./sections/BrandPromoRow";
import BrandStoryRow from "./sections/BrandStoryRow";
import ColorBanner from "./sections/ColorBanner";
import FeatureGridSection from "./sections/FeatureGridSection";
import OutfitInspiration from "./sections/OutfitInspiration";
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

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero — stacked full-width color banners */}
      <ColorBanner title="Especial Summer Offer" ctaLabel="Save Now" href="/products" bg="bg-sky-300" />
      <ColorBanner title="Monthly Inspiration" ctaLabel="Read Now" href="/products" bg="bg-orange-200" />

      {/* Stores that inspire */}
      <Section bg="bg-white">
        <BrandStoryRow title="Stores that inspire" subtitle="Curated weekly" stories={brandStories} />
      </Section>

      {/* Nike feature + grid */}
      <Section bg="bg-light">
        <FeatureGridSection banner={nikeBanner} products={makeProducts("nike", 10)} />
      </Section>

      {/* Explore boards */}
      <Section bg="bg-white">
        <BoardRow title="Explore boards" subtitle="Find inspiration for any moment" boards={boards} />
      </Section>

      {/* Summer deals (Philips) */}
      <Section bg="bg-light">
        <BrandPromoRow banner={philipsBanner} products={makeProducts("philips", 12)} rows={2} />
      </Section>

      {/* App promo */}
      <Section bg="bg-white">
        <AppPromo
          title="Try our app yet?"
          subtitle="Shop faster, track orders, and get app-only deals"
          ctaLabel="Get the app"
        />
      </Section>

      {/* Weightless icons + grid */}
      <Section bg="bg-light">
        <FeatureGridSection banner={weightlessBanner} products={makeProducts("weightless", 10)} />
      </Section>

      {/* Repeating brand promo blocks — alternating bands */}
      {brandPromos.map((b, i) => (
        <Section key={i} bg={i % 2 === 0 ? "bg-white" : "bg-light"}>
          <BrandPromoRow banner={b.banner} products={b.products} bannerSide={b.bannerSide} />
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
        <OutfitInspiration title="Outfit inspiration" subtitle="Snap their style" looks={outfitLooks} />
      </Section>
    </div>
  );
}
