"use client";

import { dummyProducts } from "@/src/data/dummyProducts";
import { Camera, Sparkles, X, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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
    if (selectedProducts.length > 0 && !activeProductId) {
      setActiveProductId(selectedProducts[0].id);
    } else if (selectedProducts.length === 0) {
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
        name: product.name,
        price: product.price,
        originalPrice: product.compareAtPrice,
        quantity: 1,
        stock: 10,
        image: product.images[0]?.url ?? "",
        brand: product.brand?.name,
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
          <div className="relative flex flex-col items-center justify-center aspect-[3/4] rounded-2xl border border-dashed border-border bg-muted/40 overflow-hidden">
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
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">
                Selected Outfit ({selectedProducts.length})
              </h2>
            </div>
            
            {selectedProducts.length > 0 ? (
              <div className="flex flex-col gap-3 max-h-[600px] overflow-y-auto pr-2 pb-4">
                {selectedProducts.map((product) => {
                  const primaryImage = product.images.find((img) => img.isPrimary) ?? product.images[0];
                  const isActive = activeProductId === product.id;

                  return (
                    <div 
                      key={product.id}
                      onClick={() => setActiveProductId(product.id)}
                      className={`flex gap-3 rounded-xl border p-3 cursor-pointer transition-all hover:border-primary/50 ${isActive ? "border-primary bg-primary/5 shadow-sm" : "border-border"}`}
                    >
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
                      <div className="flex flex-col gap-1 min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-sm font-semibold text-foreground line-clamp-2">
                            {product.name}
                          </span>
                          <button 
                            onClick={(e) => handleRemove(product.id, product.slug, e)}
                            className="text-muted-foreground hover:text-red-500 transition-colors p-1"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        <span className="text-sm font-bold text-foreground">
                          ৳{product.price.toLocaleString()}
                        </span>
                        
                        <div className="mt-auto flex items-center gap-2 justify-between">
                          <Link
                            href={`/products/${product.slug}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs font-medium text-primary hover:underline"
                          >
                            View
                          </Link>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(product);
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-xs font-semibold hover:bg-primary/90 transition-colors"
                          >
                            <ShoppingCart size={14} />
                            Add
                          </button>
                        </div>
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
