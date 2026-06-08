"use client";

import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { HomeProduct } from "./homeTypes";

interface ProductTileProps {
  product: HomeProduct;
  className?: string;
  /** hide the extra price info (Originally / Last lowest) */
  compact?: boolean;
}

const fmt = (n: number) => `€${n.toFixed(2)}`;

/** Independent product card (props only — no redux/fetching). */
export default function ProductTile({
  product,
  className = "",
  compact = false,
}: ProductTileProps) {
  const [wished, setWished] = useState(false);

  return (
    <Link href={product.href ?? "#"} className={`group block ${className}`}>
      {/* Image */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-light">
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
            setWished((w) => !w);
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
        <p className="truncate text-sm font-bold text-secondary">{product.brand}</p>
        <p className="truncate text-sm text-gray-600">{product.name}</p>

        <p className="pt-1 text-base font-bold text-primary">From {fmt(product.price)}</p>

        {!compact && product.originalPrice && (
          <p className="text-xs text-gray-500">Originally: {fmt(product.originalPrice)}</p>
        )}
        {!compact && product.lastLowest && (
          <p className="text-xs text-gray-500">
            Last lowest price:{" "}
            <span className="line-through">{fmt(product.lastLowest)}</span>{" "}
            {product.lastLowestLabel && (
              <span className="font-semibold text-red-500">{product.lastLowestLabel}</span>
            )}
          </p>
        )}
      </div>
    </Link>
  );
}
