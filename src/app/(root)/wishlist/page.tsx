"use client";

import { dummyProducts } from "@/src/data/dummyProducts";
import { addToCart } from "@/src/lib/redux/features/cart/cartSlice";
import { selectCanAddToCart } from "@/src/lib/redux/features/permission/permissionSelectors";
import {
    clearWishlist,
    removeFromWishlist,
} from "@/src/lib/redux/features/wishlist/wishlistSlice";
import { useAppDispatch, useAppSelector } from "@/src/lib/redux/hooks";
import { ArrowRight, Heart, ShoppingCart, Trash2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";

export default function WishlistPage() {
  const dispatch = useAppDispatch();
  const wishlistIds = useAppSelector((state) => state.wishlist.productIds);
  const canAddToCart = useAppSelector(selectCanAddToCart);

  // Look up products from dummy data
  const wishlistProducts = wishlistIds
    .map((id) => dummyProducts.find((p) => p.id === id))
    .filter(Boolean);

  // Empty state
  if (wishlistProducts.length === 0) {
    return (
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-center gap-4">
          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Heart size={32} />
          </div>
          <h1 className="text-xl font-bold text-foreground">
            Your wishlist is empty
          </h1>
          <p className="text-sm text-muted-foreground max-w-xs">
            Save products you like by clicking the heart icon on any product.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 mt-2 px-6 py-2.5 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity no-underline"
          >
            Browse Products
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 sm:px-6 lg:px-8">
      <div className="py-4 sm:py-6 lg:py-8 pb-20 lg:pb-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
              My Wishlist
            </h1>
            <span className="text-xs sm:text-sm text-muted-foreground mt-0.5 block">
              {wishlistProducts.length}{" "}
              {wishlistProducts.length === 1 ? "item" : "items"}
            </span>
          </div>
          <button
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground border border-border rounded-lg px-3 py-1.5 hover:text-red-500 hover:border-red-500 transition-colors cursor-pointer"
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {wishlistProducts.map((product) => {
            if (!product) return null;
            const primaryImage =
              product.images.find((img) => img.isPrimary) ?? product.images[0];
            const hasDiscount =
              product.compareAtPrice && product.compareAtPrice > product.price;

            return (
              <div
                key={product.id}
                className="relative bg-card rounded-xl border border-border overflow-hidden group hover:shadow-md transition-shadow"
              >
                {/* Image */}
                <Link
                  href={`/products/${product.slug}`}
                  className="relative block w-full aspect-3/4 bg-gray-100 overflow-hidden"
                >
                  {primaryImage && (
                    <Image
                      src={primaryImage.url}
                      alt={primaryImage.alt ?? product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    />
                  )}
                </Link>

                {/* Remove button */}
                <button
                  className="absolute top-2 right-2 flex items-center justify-center w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm text-gray-500 hover:text-red-500 hover:bg-white transition-all z-10 cursor-pointer"
                  onClick={() => {
                    dispatch(removeFromWishlist(product.id));
                    toast.success("Removed from wishlist");
                  }}
                  aria-label="Remove from wishlist"
                >
                  <X size={14} />
                </button>

                {/* Content */}
                <div className="p-3 flex flex-col gap-1.5">
                  <Link
                    href={`/products/${product.slug}`}
                    className="text-sm font-semibold text-foreground line-clamp-2 hover:text-primary transition-colors no-underline"
                  >
                    {product.name}
                  </Link>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-foreground">
                      ৳{product.price.toLocaleString()}
                    </span>
                    {hasDiscount && (
                      <span className="text-xs text-muted-foreground line-through">
                        ৳{product.compareAtPrice!.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <button
                    className="flex items-center justify-center gap-1.5 w-full py-2 mt-1 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!canAddToCart}
                    onClick={() => {
                      if (!canAddToCart) {
                        toast.error(
                          "This action is only available for USER accounts."
                        );
                        return;
                      }

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
