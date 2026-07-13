"use client";

import { toggleWishlist } from "@/src/lib/redux/features/wishlist/wishlistSlice";
import { useAppDispatch, useAppSelector } from "@/src/lib/redux/hooks";
import { Camera, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HomeProduct } from "./homeTypes";

interface ProductCardProps {
  product: HomeProduct;
  className?: string;
  /** hide the extra price info (Originally / Last lowest) */
  compact?: boolean;
  /** stretch the image to fill the card height instead of a fixed 3/4 ratio */
  fill?: boolean;
  /** override the image aspect ratio when not using fill */
  ratio?: string;
}

const fmt = (n: number) => `€${n.toFixed(2)}`;

/** Shared product card used by every home/catalog section (props-driven). */
export default function ProductCard({
  product,
  className = "",
  compact = false,
  fill = false,
  ratio = "aspect-3/4",
}: ProductCardProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const wished = useAppSelector((s) =>
    s.wishlist.productIds.includes(product.id)
  );

  return (
    <Link
      href={product.href ?? "#"}
      className={`group flex h-full flex-col ${className}`}
    >
      {/* Image */}
      <div
        data-card-image
        className={`relative w-full overflow-hidden rounded-lg bg-light ${
          fill ? "flex-1 min-h-0" : ratio
        }`}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width:640px) 50vw, 220px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Wishlist */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            dispatch(toggleWishlist(product.id));
          }}
          aria-label="wishlist"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm transition-transform hover:scale-110"
        >
          <Heart
            size={18}
            className={wished ? "text-red-500" : "text-secondary"}
            fill={wished ? "currentColor" : "none"}
          />
        </button>

        {/* Virtual trial-room — only when a slug is available */}
        {product.slug && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              router.push(`/trial-room?product=${product.slug}`);
            }}
            aria-label="Try on with virtual camera"
            className="absolute right-3 top-14 flex h-9 w-9 items-center justify-center rounded-full bg-white text-secondary shadow-sm transition-transform hover:scale-110 hover:text-primary"
          >
            <Camera size={18} />
          </button>
        )}

        {/* Badges */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          {product.extraLabel && (
            <span className="rounded-md bg-secondary px-2.5 py-1 text-xs font-bold text-white">
              {product.extraLabel}
            </span>
          )}
          {product.deal && (
            <span className="rounded-md bg-red-500 px-2.5 py-1 text-xs font-bold text-white">
              Deal
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="mt-3 space-y-0.5">
        <p className="truncate text-sm font-bold text-secondary">
          {product.brand}
        </p>
        <p className="truncate text-sm text-gray-600">{product.name}</p>

        <p className="pt-1 text-base font-bold text-primary">
          From {fmt(product.price)}
        </p>

        {!compact && product.originalPrice && (
          <p className="text-xs text-gray-500">
            Originally: {fmt(product.originalPrice)}
          </p>
        )}
        {!compact && product.lastLowest && (
          <p className="text-xs text-gray-500">
            Last lowest price:{" "}
            <span className="line-through">{fmt(product.lastLowest)}</span>{" "}
            {product.lastLowestLabel && (
              <span className="font-semibold text-red-500">
                {product.lastLowestLabel}
              </span>
            )}
          </p>
        )}
      </div>
    </Link>
  );
}
