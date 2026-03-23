import EcommerceHero from "./HeroSection/EcommerceHero";
import NewArrivals from "./NewArrivals/NewArrivals";
import FeaturedProducts from "./FeaturedProducts/FeaturedProducts";

export default function Home() {
  return (
    <div>
      <EcommerceHero />
      <NewArrivals />
      <FeaturedProducts />
    </div>
  );
}
