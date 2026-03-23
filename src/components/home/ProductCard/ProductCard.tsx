"use client";

import { useAppDispatch, useAppSelector } from "@/src/lib/redux/hooks";
import { toggleWishlist } from "@/src/lib/redux/features/wishlist/wishlistSlice";
import { IProduct } from "@/src/types/ecommerce/product";
import { Heart, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  product: IProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const wishlistIds = useAppSelector((state) => state.wishlist.productIds);
  const isWishlisted = wishlistIds.includes(product.id);

  const primaryImage =
    product.images.find((img) => img.isPrimary) ?? product.images[0];
  const hasDiscount =
    product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.compareAtPrice! - product.price) / product.compareAtPrice!) *
          100
      )
    : 0;

  return (
    <Link href={`/products/${product.slug}`} className={styles.card}>
      {/* Image */}
      <div className={styles.imageWrap}>
        {primaryImage && (
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt ?? product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        )}

        {/* Wishlist heart – top right */}
        <button
          className={`${styles.wishlistBtn} ${isWishlisted ? styles.wishlistBtnActive : ""}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            dispatch(toggleWishlist(product.id));
          }}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
        </button>

        {/* Badges on image – New + Free Delivery only */}
        <div className={styles.badges}>
          {product.isNewArrival && (
            <span className={styles.badgeNew}>New</span>
          )}
          {product.freeShipping && (
            <span className={styles.badgeFreeDelivery}>
              <Truck size={12} strokeWidth={2.5} />
              Free Delivery
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {product.brand && (
          <span className={styles.brand}>{product.brand.name}</span>
        )}
        <h3 className={styles.name}>{product.name}</h3>

        {/* Deal badges – below description */}
        {hasDiscount && (
          <div className={styles.dealBadges}>
            <span className={styles.badgeDiscount}>{discountPercent}%</span>
            <span className={styles.badgeDeal}>Deal</span>
          </div>
        )}

        {/* Price */}
        <div className={styles.priceSection}>
          <span className={styles.price}>
            <span className={styles.priceSymbol}>৳</span>
            {product.price.toLocaleString()}
          </span>
          {hasDiscount && (
            <div className={styles.regularPriceRow}>
              <span className={styles.regularLabel}>Regular price:</span>
              <span className={styles.comparePrice}>
                ৳{product.compareAtPrice!.toLocaleString()}
              </span>
              <span className={styles.discountPercent}>
                -{discountPercent}%
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
