"use client";

import { Bell, Heart, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";
import ProductCarousel from "../../common/ProductCarousel";
import { makeProducts } from "../../data/homeData";
import Accordion, { SpecList } from "./Accordion";
import ColorSwatches from "./ColorSwatches";
import DeliveryInfo from "./DeliveryInfo";
import Gallery from "./Gallery";
import SizeSelect from "./SizeSelect";
import { ProductDetail } from "./detailTypes";

const fmt = (n: number) => `€${n.toFixed(2)}`;

export default function ProductDetailView({ product }: { product: ProductDetail }) {
  const [activeColor, setActiveColor] = useState(product.colors[0]?.id ?? "");
  const [size, setSize] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState(false);
  const [wished, setWished] = useState(false);

  const discounted = !!product.lastLowest && product.lastLowest > product.price;

  // Gallery images follow the selected colour (fallback to the product set).
  const selected = product.colors.find((c) => c.id === activeColor);
  const galleryImages =
    selected?.images && selected.images.length ? selected.images : product.images;

  const handleAddToBag = () => {
    if (!size) {
      setSizeError(true);
      toast.error("Please choose your size");
      return;
    }
    toast.success("Added to bag");
  };

  return (
    <div className="container px-4 sm:px-6 lg:px-8 py-6 md:py-10">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        {/* Gallery — 43% width on desktop; swaps with the selected colour */}
        <div className="w-full lg:w-[43%] lg:shrink-0">
          <Gallery key={activeColor} images={galleryImages} alt={product.title} />
        </div>

        {/* Info — fills the remaining width after the 43% gallery */}
        <div className="w-full lg:flex-1">
          {/* Brand */}
          <div className="mb-2">
            <Link
              href={product.brandHref ?? "#"}
              className="text-base font-bold text-secondary underline underline-offset-2"
            >
              {product.brand}
            </Link>
          </div>

          <h1 className="text-xl font-bold leading-snug text-secondary">{product.title}</h1>

          {/* Price */}
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-bold ${discounted ? "text-primary" : "text-secondary"}`}>
                {fmt(product.price)}
              </span>
              <span className="text-xs text-gray-500">VAT included</span>
            </div>
            {discounted && (
              <p className="mt-0.5 text-xs text-gray-500">
                Last lowest price:{" "}
                <span className="line-through">{fmt(product.lastLowest!)}</span>{" "}
                {product.discountLabel && (
                  <span className="font-semibold text-primary">{product.discountLabel}</span>
                )}
              </p>
            )}
          </div>

          {/* Colour */}
          <div className="mt-5">
            <p className="mb-2 text-sm text-gray-600">
              Colour: <span className="font-semibold text-secondary">{product.colourName}</span>
            </p>
            <ColorSwatches colors={product.colors} activeId={activeColor} onSelect={setActiveColor} />
          </div>

          {/* Out of stock note */}
          {!product.inStock && (
            <div className="mt-6">
              <p className="text-2xl font-bold text-secondary">Out of stock</p>
              <p className="text-sm text-gray-500">
                You&apos;ll get an email if this item comes back in stock.
              </p>
            </div>
          )}

          {/* Size */}
          <div className="mt-5">
            <p className="mb-1.5 text-sm text-gray-600">Size</p>
            <SizeSelect
              sizes={product.sizes}
              value={size}
              onChange={(s) => {
                setSize(s);
                setSizeError(false);
              }}
              error={sizeError}
            />
          </div>

          {/* CTA */}
          <div className="mt-4 flex items-center gap-3">
            {product.inStock ? (
              <button
                type="button"
                onClick={handleAddToBag}
                className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-secondary text-sm font-semibold text-white transition-transform hover:scale-[1.01]"
              >
                <ShoppingBag size={18} /> Add to bag
              </button>
            ) : (
              <button
                type="button"
                onClick={() => toast.success("Reminder set")}
                className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-secondary text-sm font-semibold text-white transition-transform hover:scale-[1.01]"
              >
                <Bell size={18} /> Set a reminder
              </button>
            )}
            <button
              type="button"
              onClick={() => setWished((w) => !w)}
              aria-label="wishlist"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gray-300 hover:bg-light"
            >
              <Heart size={20} className={wished ? "text-red-500" : "text-secondary"} fill={wished ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Delivery */}
          <div className="mt-6">
            <DeliveryInfo soldBy={product.soldBy} range={product.delivery.range} cost={product.delivery.cost} />
          </div>

          {/* Accordions */}
          <div className="mt-6">
            <Accordion title="Material & care" defaultOpen>
              <SpecList items={product.material} />
            </Accordion>
            <Accordion title="Details" defaultOpen>
              <SpecList items={product.details} />
              {product.articleNumber && (
                <p className="mt-2 text-sm text-gray-600">
                  <span className="font-semibold text-secondary">Article number:</span> {product.articleNumber}
                </p>
              )}
            </Accordion>
            <Accordion title="Size & fit">
              <SpecList items={product.sizeFit} />
            </Accordion>
          </div>

          <p className="mt-4 text-xs text-gray-400">⚐ Report a legal concern</p>
        </div>
      </div>

      {/* Related products */}
      <div className="mt-14">
        <ProductCarousel
          title="You may also like"
          subtitle="Related products"
          ctaLabel="View all"
          ctaHref="/products"
          products={makeProducts(`related-${product.id}`, 12)}
          compact
        />
      </div>
    </div>
  );
}
