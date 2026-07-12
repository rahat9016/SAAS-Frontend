import Section from "./common/Section";
import {
    brandStories,
    outfitLooks,
    productSections,
} from "./data/homeData";
import BrandStoryRow from "./sections/BrandStoryRow";
import HeroBanner from "./sections/HeroBanner";
import OutfitInspiration from "./sections/OutfitInspiration";
import ProductCarouselSection from "./sections/ProductCarouselSection";

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

      {/* Product carousels — alternating bands */}
      {productSections.map((s, i) => (
        <Section key={s.id} bg={i % 2 === 0 ? "bg-light" : "bg-white"}>
          <ProductCarouselSection
            title={s.title}
            subtitle={s.subtitle}
            ctaLabel={s.ctaLabel}
            ctaHref={s.ctaHref}
            products={s.products}
          />
        </Section>
      ))}

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
