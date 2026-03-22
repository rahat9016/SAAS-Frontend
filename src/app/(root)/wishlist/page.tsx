"use client";

import { addToCart } from "@/src/lib/redux/features/cart/cartSlice";
import {
  removeFromWishlist,
  clearWishlist,
} from "@/src/lib/redux/features/wishlist/wishlistSlice";
import { useAppDispatch, useAppSelector } from "@/src/lib/redux/hooks";
import { dummyProducts } from "@/src/data/dummyProducts";
import { ArrowRight, Heart, ShoppingCart, Trash2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import styles from "./Wishlist.module.css";

export default function WishlistPage() {
  const dispatch = useAppDispatch();
  const wishlistIds = useAppSelector((state) => state.wishlist.productIds);

  // Look up products from dummy data
  const wishlistProducts = wishlistIds
    .map((id) => dummyProducts.find((p) => p.id === id))
    .filter(Boolean);

  // Empty state
  if (wishlistProducts.length === 0) {
    return (
      <div className="container">
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <Heart size={32} />
          </div>
          <h1 className={styles.emptyTitle}>Your wishlist is empty</h1>
          <p className={styles.emptyText}>
            Save products you like by clicking the heart icon on any product.
          </p>
          <Link href="/" className={styles.emptyBtn}>
            Browse Products
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className={styles.page}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>My Wishlist</h1>
            <span className={styles.itemCount}>
              {wishlistProducts.length}{" "}
              {wishlistProducts.length === 1 ? "item" : "items"}
            </span>
          </div>
          <button
            className={styles.clearBtn}
            onClick={() => {
              dispatch(clearWishlist());
              toast.success("Wishlist cleared");
            }}
          >
            <Trash2 size={14} />
            Clear All
          </button>
        </div>

        {/* Grid */}
        <div className={styles.grid}>
          {wishlistProducts.map((product) => {
            if (!product) return null;
            const primaryImage =
              product.images.find((img) => img.isPrimary) ?? product.images[0];
            const hasDiscount =
              product.compareAtPrice && product.compareAtPrice > product.price;

            return (
              <div key={product.id} className={styles.card}>
                {/* Image */}
                <Link
                  href={`/products/${product.slug}`}
                  className={styles.imageWrap}
                >
                  {primaryImage && (
                    <Image
                      src={primaryImage.url}
                      alt={primaryImage.alt ?? product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    />
                  )}
                </Link>

                {/* Remove button */}
                <button
                  className={styles.removeBtn}
                  onClick={() => {
                    dispatch(removeFromWishlist(product.id));
                    toast.success("Removed from wishlist");
                  }}
                  aria-label="Remove from wishlist"
                >
                  <X size={14} />
                </button>

                {/* Content */}
                <div className={styles.content}>
                  <Link
                    href={`/products/${product.slug}`}
                    className={styles.name}
                  >
                    {product.name}
                  </Link>
                  <div className={styles.priceRow}>
                    <span className={styles.price}>
                      ৳{product.price.toLocaleString()}
                    </span>
                    {hasDiscount && (
                      <span className={styles.comparePrice}>
                        ৳{product.compareAtPrice!.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <button
                    className={styles.addToCartBtn}
                    onClick={() => {
                      dispatch(
                        addToCart({
                          productId: product.id,
                          name: product.name,
                          slug: product.slug,
                          image: primaryImage?.url ?? "",
                          price: product.price,
                          compareAtPrice: product.compareAtPrice,
                          quantity: 1,
                          stock: product.stock,
                        })
                      );
                      toast.success(`${product.name} added to cart!`);
                    }}
                  >
                    <ShoppingCart size={14} />
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
