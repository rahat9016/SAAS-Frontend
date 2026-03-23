import EcommerceHero from "./HeroSection/EcommerceHero";
import PromoBanners from "./PromoBanners/PromoBanners";
import NewArrivals from "./NewArrivals/NewArrivals";
import FeaturedProducts from "./FeaturedProducts/FeaturedProducts";

export default function Home() {
  return (
    <div>
      <EcommerceHero />
      <PromoBanners />
      <NewArrivals />
      <FeaturedProducts />
    </div>
  );
}
