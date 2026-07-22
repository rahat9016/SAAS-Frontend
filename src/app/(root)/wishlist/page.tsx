"use client";

import { dummyProducts } from "@/src/data/dummyProducts";
import { addToCart } from "@/src/lib/redux/features/cart/cartSlice";
import { selectCanAddToCart } from "@/src/lib/redux/features/permission/permissionSelectors";
import { toggleTrialRoom } from "@/src/lib/redux/features/trialRoom/trialRoomSlice";
import {
    clearWishlist,
    removeFromWishlist,
} from "@/src/lib/redux/features/wishlist/wishlistSlice";
import { useAppDispatch, useAppSelector } from "@/src/lib/redux/hooks";
import { ArrowRight, Camera, Heart, ShoppingBag, Trash2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";

export default function WishlistPage() {
  const dispatch = useAppDispatch();
  const wishlistIds = useAppSelector((state) => state.wishlist.productIds);
  const canAddToCart = useAppSelector(selectCanAddToCart);

  const wishlistProducts = wishlistIds
    .map((id) => dummyProducts.find((p) => p.id === id))
    .filter(Boolean);

  const trialRoomIds = useAppSelector((state) => state.trialRoom.productIds);

  // Empty state
  if (wishlistProducts.length === 0) {
    return (
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center py-4 sm:py-4 text-center gap-4">
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
      <div className="py-2 ">
        {/* Header */}
        <div className="flex items-center justify-between mb-2 xl:mb-6">
          <div>
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
              My Wishlist
            </h1>
            {/* <span className="text-xs sm:text-sm text-muted-foreground mt-0.5 block">
              {wishlistProducts.length}{" "}
              {wishlistProducts.length === 1 ? "item" : "items"}
            </span> */}
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {wishlistProducts.map((product) => {
            if (!product) return null;
            const primaryImage =
              product.images.find((img) => img.isPrimary) ?? product.images[0];
            const hasDiscount =
              product.compareAtPrice && product.compareAtPrice > product.price;

            const inTrialRoom = trialRoomIds.includes(product.id) || trialRoomIds.includes(product.slug);

            return (
              <div
                key={product.id}
                className="group flex h-full flex-col relative"
              >
                {/* Image */}
                <div className="relative w-full overflow-hidden rounded-lg bg-light aspect-3/4">
                  <Link href={`/products/${product.slug}`} className="absolute inset-0 z-0">
                    {primaryImage && (
                      <Image
                        src={primaryImage.url}
                        alt={primaryImage.alt ?? product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      />
                    )}
                  </Link>

                  {/* Remove / Wishlist (Heart) button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      dispatch(removeFromWishlist(product.id));
                      toast.success("Removed from wishlist");
                    }}
                    aria-label="Remove from wishlist"
                    className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm transition-transform hover:scale-110"
                  >
                    <Heart size={18} className="text-red-500" fill="currentColor" />
                  </button>

                  {/* Trial Room button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      dispatch(toggleTrialRoom(product.id));
                      if (inTrialRoom) {
                        toast.info("Removed from Trial Room");
                      } else {
                        toast.success(
                          <div className="flex flex-col gap-1">
                            <span>Added to Trial Room</span>
                            <Link
                              href="/trial-room"
                              className="text-primary hover:underline text-xs font-semibold"
                            >
                              Go to Trial Room →
                            </Link>
                          </div>
                        );
                      }
                    }}
                    aria-label="Try on with virtual camera"
                    className="absolute right-3 top-14 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm transition-transform hover:scale-110 hover:text-primary"
                  >
                    <Camera
                      size={18}
                      className={inTrialRoom ? "text-primary" : "text-secondary"}
                    />
                  </button>
                </div>

                {/* Content */}
                <div className="mt-3 space-y-0.5 flex-1">
                  <p className="truncate text-sm font-bold text-secondary">
                    {product.brand?.name ?? "Brand"}
                  </p>
                  <Link href={`/products/${product.slug}`} className="block truncate text-sm text-gray-600 hover:text-primary">
                    {product.name}
                  </Link>
                  <p className="pt-1 text-base font-bold text-primary">
                    ৳{product.price.toLocaleString()}
                  </p>
                  {hasDiscount && (
                    <p className="text-xs text-gray-500">
                      Originally: ৳{product.compareAtPrice!.toLocaleString()}
                    </p>
                  )}
                </div>

                {/* Add to Cart button */}
                <button
                  className="mt-3 flex items-center justify-center gap-1.5 w-full py-2.5 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
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
                    dispatch(removeFromWishlist(product.id));
                    toast.success(`${product.name} added to cart!`);
                  }}
                >
                  <ShoppingBag size={16} />
                  Add to Bag
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
