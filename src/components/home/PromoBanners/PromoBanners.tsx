import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import styles from "./PromoBanners.module.css";

const promoBanners = [
  {
    id: "coats",
    tag: "Clearance",
    title: "Winter Coats",
    subtitle: "up to 50% off",
    btnText: "Shop Now",
    href: "/products?category=coats",
    image: "/banners/promo-coats.png",
    placement: styles.cardLeft,
  },
  {
    id: "menswear",
    tag: "On Sale",
    title: "Men's Collection",
    subtitle: "from ৳1,999",
    btnText: "Discover Now",
    href: "/products?category=menswear",
    image: "/banners/promo-menswear.png",
    placement: styles.cardCenter,
  },
  {
    id: "accessories",
    tag: "New Arrivals",
    title: "Bags & Accessories",
    subtitle: "",
    btnText: "Discover Now",
    href: "/products?category=accessories",
    image: "/banners/promo-accessories.png",
    placement: styles.cardTopRight,
  },
  {
    id: "shoes",
    tag: "On Sale",
    title: "Shoes Offer",
    subtitle: "up to 30% off",
    btnText: "Shop Now",
    href: "/products?category=shoes",
    image: "/banners/promo-shoes.png",
    placement: styles.cardBottomRight,
  },
];

export default function PromoBanners() {
  return (
    <section className={styles.section}>
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className={styles.grid}>
          {promoBanners.map((banner) => (
            <Link
              key={banner.id}
              href={banner.href}
              className={`${styles.card} ${banner.placement}`}
            >
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className={styles.cardImage}
              />
              <div className={styles.cardOverlay} />
              <div className={styles.cardContent}>
                <span className={styles.cardTag}>{banner.tag}</span>
                <h3 className={styles.cardTitle}>{banner.title}</h3>
                {banner.subtitle && (
                  <p className={styles.cardSubtitle}>{banner.subtitle}</p>
                )}
                <span className={styles.cardBtn}>
                  {banner.btnText} <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
