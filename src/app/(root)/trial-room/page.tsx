"use client";

import { dummyProducts } from "@/src/data/dummyProducts";
import { Camera, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function TrialRoom() {
  const params = useSearchParams();
  const productId = params.get("product");
  const product = productId
    ? dummyProducts.find((p) => p.id === productId || p.slug === productId)
    : undefined;
  const primaryImage =
    product?.images.find((img) => img.isPrimary) ?? product?.images[0];

  return (
    <div className="container px-4 sm:px-6 lg:px-8">
      <div className="py-6 sm:py-8 lg:py-10 pb-20 lg:pb-16">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-2 mb-6 sm:mb-8">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary">
            <Camera size={26} />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            Virtual Trial Room
          </h1>
          <p className="text-sm text-muted-foreground max-w-md">
            Try the outfit on virtually with your camera before you buy.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] max-w-5xl mx-auto">
          {/* Camera stage */}
          <div className="relative flex flex-col items-center justify-center aspect-3/4 rounded-2xl border border-dashed border-border bg-muted/40 overflow-hidden">
            <Camera size={40} className="text-muted-foreground" />
            <p className="mt-3 text-sm font-medium text-foreground">
              Camera preview
            </p>
            <p className="mt-1 text-xs text-muted-foreground max-w-xs text-center px-4">
              Allow camera access to start the virtual try-on.
            </p>
            <button className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer">
              <Sparkles size={16} />
              Start Camera
            </button>
          </div>

          {/* Selected outfit */}
          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-foreground">
              Selected outfit
            </h2>
            {product ? (
              <div className="flex gap-3 rounded-xl border border-border p-3">
                <div className="relative w-24 h-32 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  {primaryImage && (
                    <Image
                      src={primaryImage.url}
                      alt={primaryImage.alt ?? product.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  )}
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-sm font-semibold text-foreground line-clamp-2">
                    {product.name}
                  </span>
                  <span className="text-sm font-bold text-foreground">
                    ৳{product.price.toLocaleString()}
                  </span>
                  <Link
                    href={`/products/${product.slug}`}
                    className="text-xs font-medium text-primary hover:underline mt-auto"
                  >
                    View product
                  </Link>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground rounded-xl border border-dashed border-border p-4">
                No outfit selected. Open the Trial Room from a product card to
                try it on.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TrialRoomPage() {
  return (
    <Suspense fallback={null}>
      <TrialRoom />
    </Suspense>
  );
}
