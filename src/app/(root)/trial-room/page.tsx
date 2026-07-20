"use client";

import { dummyProducts } from "@/src/data/dummyProducts";
import { Camera, Sparkles, X, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import { Suspense, useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/src/lib/redux/hooks";
import { removeFromTrialRoom } from "@/src/lib/redux/features/trialRoom/trialRoomSlice";
import { addToCart } from "@/src/lib/redux/features/cart/cartSlice";

function TrialRoom() {
  const dispatch = useAppDispatch();
  const trialRoomIds = useAppSelector((state) => state.trialRoom.productIds);

  // Map IDs back to product objects
  const selectedProducts = dummyProducts.filter(
    (p) => trialRoomIds.includes(p.id) || trialRoomIds.includes(p.slug)
  );

  console.log("TRIAL ROOM PAGE - trialRoomIds:", trialRoomIds);
  console.log("TRIAL ROOM PAGE - selectedProducts:", selectedProducts);

  // Default active product is the first one, or null
  const [activeProductId, setActiveProductId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (selectedProducts.length > 0 && !activeProductId) {
      setActiveProductId(selectedProducts[0].id);
    } else if (selectedProducts.length === 0 && activeProductId !== null) {
      setActiveProductId(null);
    }
  }, [selectedProducts, activeProductId]);

  if (!mounted) {
    return (
      <div className="container px-4 sm:px-6 lg:px-8 py-20 flex justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  const activeProduct = selectedProducts.find((p) => p.id === activeProductId);
  const activePrimaryImage = activeProduct?.images.find((img) => img.isPrimary) ?? activeProduct?.images[0];

  const handleAddToCart = (product: typeof dummyProducts[0]) => {
    dispatch(
      addToCart({
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        quantity: 1,
        stock: 10,
        image: product.images[0]?.url ?? "",
      })
    );
  };

  const handleRemove = (id: string, slug: string, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(removeFromTrialRoom(id));
    dispatch(removeFromTrialRoom(slug));
  };

  return (
    <div className="container px-4 sm:px-6 lg:px-8">
      <div className="py-2">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-2 mb-2 sm:mb-2">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary">
            <Camera size={26} />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            Virtual Trial Room
          </h1>
          <p className="text-sm text-muted-foreground ">
            Try the outfit on virtually with your camera before you buy.
          </p>
        </div>

        <div className="grid gap-2 lg:grid-cols-[1.4fr_1fr] ">
          {/* Camera stage */}
          <div className="relative w-full flex flex-col items-center justify-center h-[500px] lg:h-[600px] rounded-2xl border border-dashed border-border bg-muted/40 overflow-hidden">
            {activePrimaryImage ? (
              <div className="absolute inset-0 z-0">
                <Image
                  src={activePrimaryImage.url}
                  alt={activeProduct?.name || "Active product"}
                  fill
                  className="object-cover opacity-50"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              </div>
            ) : null}
            
            <div className="relative z-10 flex flex-col items-center">
              <Camera size={40} className="text-muted-foreground" />
              <p className="mt-3 text-sm font-medium text-foreground">
                Camera preview
              </p>
              <p className="mt-1 text-xs text-muted-foreground max-w-xs text-center px-4">
                Allow camera access to start the virtual try-on.
              </p>
              {activeProduct && (
                <div className="mt-4 text-center bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full">
                  <p className="text-sm font-semibold text-primary">Previewing: {activeProduct.name}</p>
                </div>
              )}
              <button className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer shadow-lg">
                <Sparkles size={16} />
                Start Camera
              </button>
            </div>
          </div>

          {/* Selected outfit */}
          <div className="flex flex-col gap-3">

            
            {selectedProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-1 pb-4">
                {selectedProducts.map((product) => {
                  const primaryImage = product.images.find((img) => img.isPrimary) ?? product.images[0];
                  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
                  const isActive = activeProductId === product.id;

                  return (
                    <div
                      key={product.id}
                      onClick={() => setActiveProductId(product.id)}
                      className={`group flex flex-col relative rounded-xl border overflow-hidden cursor-pointer transition-all hover:border-primary/50 ${isActive ? "border-primary shadow-sm bg-primary/5" : "border-transparent bg-card"}`}
                    >
                      {/* Image */}
                      <div className="relative w-full overflow-hidden bg-light aspect-3/4">
                        <div className="absolute inset-0 z-0 pointer-events-none">
                          {primaryImage && (
                            <Image
                              src={primaryImage.url}
                              alt={primaryImage.alt ?? product.name}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                            />
                          )}
                        </div>

                        {/* Remove button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemove(product.id, product.slug, e);
                          }}
                          aria-label="Remove from trial room"
                          className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-sm transition-transform hover:scale-110"
                        >
                          <X size={14} className="text-gray-500 hover:text-red-500 transition-colors" />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="flex-1 flex flex-col justify-between pt-2 px-3 pb-3">
                        <div className="space-y-0.5">
                          <p className="truncate text-[11px] font-bold text-secondary uppercase">
                            {product.brand?.name ?? "Brand"}
                          </p>
                          <span className="block truncate text-xs text-gray-600 group-hover:text-primary">
                            {product.name}
                          </span>
                          <p className="pt-1 text-sm font-bold text-primary">
                            ৳{product.price.toLocaleString()}
                          </p>
                          {hasDiscount && (
                            <p className="text-[10px] text-gray-500">
                              Originally: ৳{product.compareAtPrice!.toLocaleString()}
                            </p>
                          )}
                        </div>

                        {/* Add to Cart button */}
                        <button
                          className="mt-3 flex items-center justify-center gap-1.5 w-full py-2 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAddToCart(product);
                            toast.success(`${product.name} added to bag!`);
                          }}
                        >
                          <ShoppingBag size={14} />
                          Add to Bag
                        </button>
                      </div>
                    </div>
                  );
                })}
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
