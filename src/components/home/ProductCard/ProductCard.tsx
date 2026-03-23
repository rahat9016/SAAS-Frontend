"use client";

import { useAppDispatch, useAppSelector } from "@/src/lib/redux/hooks";
import { toggleWishlist } from "@/src/lib/redux/features/wishlist/wishlistSlice";
import { IProduct } from "@/src/types/ecommerce/product";
import { Heart, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
    <Link href={`/products/${product.slug}`} className="group relative flex flex-col rounded-lg overflow-hidden bg-card hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-shadow">
      {/* Image */}
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-100 rounded-lg">
        {primaryImage && (
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt ?? product.name}
            fill
            className="object-cover transition-transform duration-[450ms] ease-out group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        )}

        {/* Wishlist heart – top right */}
        <button
          className={`absolute top-2.5 right-2.5 flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-sm border-none cursor-pointer z-[3] transition-all hover:scale-110 ${
            isWishlisted ? "text-red-500 hover:text-red-600" : "text-gray-400 hover:text-red-500"
          }`}
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
        <div className="absolute bottom-2 left-2 flex items-center gap-1 z-[2] flex-wrap">
          {product.isNewArrival && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm bg-gradient-to-br from-violet-600 to-blue-600 text-white uppercase tracking-wider">
              New
            </span>
          )}
          {product.freeShipping && (
            <span className="flex items-center gap-1 text-[10px] font-extrabold px-2 py-[3px] rounded-sm bg-emerald-600 text-white uppercase tracking-wider">
              <Truck size={12} strokeWidth={2.5} />
              Free Delivery
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-0.5 py-2.5 px-1">
        {product.brand && (
          <span className="text-xs font-bold text-foreground">{product.brand.name}</span>
        )}
        <h3 className="text-xs font-normal text-muted-foreground line-clamp-2 leading-snug">
          {product.name}
        </h3>

        {/* Deal badges – below description */}
        {hasDiscount && (
          <div className="flex items-center gap-1 mt-0.5">
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-foreground text-background">
              {discountPercent}%
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-red-500 text-white uppercase tracking-wide">
              Deal
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex flex-col gap-0.5 mt-1">
          <span className="text-sm font-bold text-foreground">
            <span className="text-xs">৳</span>
            {product.price.toLocaleString()}
          </span>
          {hasDiscount && (
            <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
              <span>Regular price:</span>
              <span className="line-through">
                ৳{product.compareAtPrice!.toLocaleString()}
              </span>
              <span className="font-bold text-red-500">
                -{discountPercent}%
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
