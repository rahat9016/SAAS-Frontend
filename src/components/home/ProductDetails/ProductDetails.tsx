"use client";

import { dummyProducts } from "@/src/data/dummyProducts";
import { IProduct } from "@/src/types/ecommerce/product";
import {
  ChevronRight,
  Heart,
  Minus,
  Plus,
  Share2,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "./ProductDetails.module.css";

interface ProductDetailsProps {
  product: IProduct;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "reviews">(
    "description"
  );

  const hasDiscount =
    product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.compareAtPrice! - product.price) / product.compareAtPrice!) *
          100
      )
    : 0;

  const relatedProducts = dummyProducts
    .filter(
      (p) =>
        p.category.id === product.category.id &&
        p.id !== product.id &&
        p.isActive
    )
    .slice(0, 5);

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        className={
          rating >= i + 1
            ? "fill-yellow-400 text-yellow-400"
            : rating >= i + 0.5
            ? "fill-yellow-400/50 text-yellow-400"
            : "fill-gray-200 text-gray-200"
        }
      />
    ));

  return (
    <div className="container py-6 lg:py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6 flex-wrap">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <ChevronRight size={12} />
        <Link
          href={`/categories/${product.category.slug}`}
          className="hover:text-primary transition-colors"
        >
          {product.category.name}
        </Link>
        <ChevronRight size={12} />
        <span className="text-foreground font-medium truncate max-w-[200px]">
          {product.name}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* ========== LEFT: Image Gallery ========== */}
        <div className="lg:col-span-4">
          <div className={styles.gallery}>
            {/* Main image */}
            <div className={styles.mainImage}>
              <Image
                src={product.images[selectedImage]?.url ?? ""}
                alt={
                  product.images[selectedImage]?.alt ?? product.name
                }
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 33vw"
                priority
              />
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className={styles.thumbnails}>
                {product.images.map((img, idx) => (
                  <button
                    key={img.id}
                    className={`${styles.thumb} ${
                      idx === selectedImage ? styles.thumbActive : ""
                    }`}
                    onClick={() => setSelectedImage(idx)}
                    aria-label={`View image ${idx + 1}`}
                  >
                    <Image
                      src={img.url}
                      alt={img.alt ?? `${product.name} ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="72px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ========== CENTER: Product Info ========== */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Brand & Flags */}
          {product.brand && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-primary uppercase tracking-wide bg-primary/10 px-2 py-0.5 rounded">
                by {product.brand.name}
              </span>
            </div>
          )}

          <h1 className="text-xl sm:text-2xl font-bold text-foreground leading-tight">
            {product.name}
          </h1>

          {/* Rating row */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {renderStars(product.rating)}
            </div>
            <span className="text-sm font-medium text-foreground">
              {product.rating}
            </span>
            <span className="text-xs text-muted-foreground">
              ({product.totalReviews} reviews)
            </span>
          </div>

          {/* Availability & SKU */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>
              Availability:{" "}
              <span
                className={
                  product.stock > 0 ? "text-green-600 font-semibold" : "text-red-500 font-semibold"
                }
              >
                {product.stock > 0 ? "In Stock" : "Out of Stock"}
              </span>
            </span>
            <span>SKU: {product.sku}</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mt-1">
            <div className="flex items-baseline gap-1">
              <span className="text-sm text-muted-foreground">৳</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-foreground">
                {product.price.toLocaleString()}
              </span>
            </div>
            {hasDiscount && (
              <>
                <span className="text-base text-muted-foreground line-through">
                  ৳{product.compareAtPrice!.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-white bg-red-500 px-2 py-0.5 rounded">
                  -{discountPercent}%
                </span>
              </>
            )}
          </div>

          {hasDiscount && (
            <p className="text-xs text-green-600 font-medium">
              You save ৳{(product.compareAtPrice! - product.price).toLocaleString()} on this product
            </p>
          )}

          {/* Short description */}
          {product.shortDescription && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.shortDescription}
            </p>
          )}

          {/* Divider */}
          <hr className="border-border" />

          {/* Attributes (Color / Size selection) */}
          {product.attributes.length > 0 && (
            <div className="flex flex-col gap-3">
              {Object.entries(
                product.attributes.reduce((acc, attr) => {
                  if (!acc[attr.name]) acc[attr.name] = [];
                  acc[attr.name].push(attr.value);
                  return acc;
                }, {} as Record<string, string[]>)
              ).map(([name, values]) => (
                <div key={name}>
                  <span className="text-xs font-semibold text-foreground mb-1.5 block">
                    {name}:
                  </span>
                  <div className="flex gap-2 flex-wrap">
                    {values.map((val, vi) => (
                      <button
                        key={vi}
                        className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${
                          vi === 0
                            ? "border-primary bg-primary/10 text-primary font-semibold"
                            : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quantity & Actions */}
          <div className="flex items-center gap-4 flex-wrap mt-1">
            <div>
              <span className="text-xs font-semibold text-foreground mb-1.5 block">
                Quantity:
              </span>
              <div className={styles.qtyPicker}>
                <button
                  className={styles.qtyBtn}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus size={14} />
                </button>
                <span className={styles.qtyValue}>{quantity}</span>
                <button
                  className={styles.qtyBtn}
                  onClick={() =>
                    setQuantity((q) => Math.min(product.stock, q + 1))
                  }
                  disabled={quantity >= product.stock}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <button className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-white transition-colors shadow-md hover:shadow-lg">
              Buy Now
            </button>
            <button className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-colors shadow-md hover:shadow-lg">
              <ShoppingCart size={16} />
              Add to Cart
            </button>
            <button className="flex items-center justify-center w-10 h-10 rounded-lg border border-border text-muted-foreground hover:text-red-500 hover:border-red-300 transition-colors">
              <Heart size={18} />
            </button>
            <button className="flex items-center justify-center w-10 h-10 rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors">
              <Share2 size={18} />
            </button>
          </div>

          {/* Trust badges */}
          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Truck size={14} className="text-green-600" />
              <span>Free Shipping</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-blue-600" />
              <span>Genuine Product</span>
            </div>
          </div>
        </div>

        {/* ========== RIGHT: Pricing Panel & Related ========== */}
        <div className="lg:col-span-3 flex flex-col gap-5">
          {/* Pricing details card */}
          <div className="rounded-xl border border-border p-5 bg-card">
            <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-primary rounded-full" />
              Pricing Details
            </h3>
            <div className="flex flex-col gap-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Product Qty</span>
                <span className="font-medium">{quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Unit Price</span>
                <span className="font-medium">
                  ৳{product.price.toLocaleString()}
                </span>
              </div>
              {hasDiscount && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span className="font-medium">
                    -৳
                    {(
                      (product.compareAtPrice! - product.price) *
                      quantity
                    ).toLocaleString()}
                  </span>
                </div>
              )}
              <hr className="border-border" />
              <div className="flex justify-between text-base font-bold">
                <span>Total</span>
                <span className="text-primary">
                  ৳{(product.price * quantity).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Delivery</span>
                <span className="text-green-600 font-medium">
                  Free Shipping
                </span>
              </div>
            </div>
          </div>

          {/* Related products */}
          {relatedProducts.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <span className="w-1 h-4 bg-primary rounded-full" />
                Related Products
              </h3>
              <div className="flex flex-col gap-2.5">
                {relatedProducts.map((rp) => {
                  const rpImg =
                    rp.images.find((i) => i.isPrimary) ?? rp.images[0];
                  const rpDiscount =
                    rp.compareAtPrice && rp.compareAtPrice > rp.price
                      ? Math.round(
                          ((rp.compareAtPrice - rp.price) /
                            rp.compareAtPrice) *
                            100
                        )
                      : 0;
                  return (
                    <Link
                      key={rp.id}
                      href={`/products/${rp.slug}`}
                      className={styles.relatedItem}
                    >
                      <div className={styles.relatedImg}>
                        <Image
                          src={rpImg?.url ?? ""}
                          alt={rp.name}
                          fill
                          className="object-cover"
                          sizes="72px"
                        />
                      </div>
                      <div className={styles.relatedInfo}>
                        <span className={styles.relatedName}>{rp.name}</span>
                        <div className="flex items-center gap-2">
                          <span className={styles.relatedPrice}>
                            ৳{rp.price.toLocaleString()}
                          </span>
                          {rp.compareAtPrice && (
                            <span className={styles.relatedCompare}>
                              ৳{rp.compareAtPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                        {rpDiscount > 0 && (
                          <span className={styles.relatedDiscount}>
                            {rpDiscount}% OFF
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========== TABS: Description & Reviews ========== */}
      <div className="mt-10">
        <div className="flex gap-0 border-b border-border">
          <button
            className={`px-5 py-3 text-sm font-semibold transition-colors relative ${
              activeTab === "description"
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("description")}
          >
            Description
            {activeTab === "description" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t" />
            )}
          </button>
          <button
            className={`px-5 py-3 text-sm font-semibold transition-colors relative ${
              activeTab === "reviews"
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews ({product.totalReviews})
            {activeTab === "reviews" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t" />
            )}
          </button>
        </div>

        <div className="py-6">
          {activeTab === "description" && (
            <div className="max-w-4xl">
              <h2 className="text-lg font-bold text-foreground mb-4">
                {product.name}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6 whitespace-pre-line">
                {product.description}
              </p>

              {/* Specifications table */}
              {product.specifications &&
                Object.keys(product.specifications).length > 0 && (
                  <div>
                    <h3 className="text-base font-bold text-foreground mb-3">
                      Specifications
                    </h3>
                    <div className="rounded-lg border border-border overflow-hidden">
                      <table className={styles.specTable}>
                        <tbody>
                          {Object.entries(product.specifications).map(
                            ([key, value]) => (
                              <tr key={key}>
                                <td>{key}</td>
                                <td>{value}</td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-sm">
                Reviews coming soon. Be the first to review this product!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
