"use client";

import { dummyProducts } from "@/src/data/dummyProducts";
import { addToCart } from "@/src/lib/redux/features/cart/cartSlice";
import {
    selectCanAddToCart,
    selectCanCheckout,
} from "@/src/lib/redux/features/permission/permissionSelectors";
import { toggleWishlist } from "@/src/lib/redux/features/wishlist/wishlistSlice";
import { useAppDispatch, useAppSelector } from "@/src/lib/redux/hooks";
import { IProduct, IProductVariant } from "@/src/types/ecommerce/product";
import {
    ChevronLeft,
    ChevronRight,
    Heart,
    HelpCircle,
    MessageSquare,
    Minus,
    Plus,
    Send,
    Share2,
    ShieldCheck,
    ShoppingCart,
    Star,
    ThumbsUp,
    Truck,
    X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";

interface ProductDetailsProps {
  product: IProduct;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const wishlistIds = useAppSelector((state) => state.wishlist.productIds);
  const canAddToCart = useAppSelector(selectCanAddToCart);
  const canCheckout = useAppSelector(selectCanCheckout);
  const isWishlisted = wishlistIds.includes(product.id);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<
    "description" | "reviews" | "questions"
  >("description");

  // --- Attribute Selection ---
  const attributeGroups = useMemo(() => {
    const groups: Record<string, string[]> = {};
    product.attributes.forEach((attr) => {
      if (!groups[attr.name]) groups[attr.name] = [];
      if (!groups[attr.name].includes(attr.value)) {
        groups[attr.name].push(attr.value);
      }
    });
    return groups;
  }, [product.attributes]);

  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >(() => {
    const defaults: Record<string, string> = {};
    Object.entries(attributeGroups).forEach(([name, values]) => {
      defaults[name] = values[0];
    });
    return defaults;
  });

  const matchedVariant: IProductVariant | undefined = useMemo(() => {
    if (product.variants.length === 0) return undefined;
    return product.variants.find((v) =>
      v.attributes.every((a) => selectedAttributes[a.name] === a.value)
    );
  }, [product.variants, selectedAttributes]);

  const effectivePrice = matchedVariant?.price ?? product.price;
  const effectiveCompareAtPrice =
    matchedVariant?.compareAtPrice ?? product.compareAtPrice;
  const effectiveStock = matchedVariant?.stock ?? product.stock;

  const hasDiscount =
    effectiveCompareAtPrice && effectiveCompareAtPrice > effectivePrice;
  const discountPercent = hasDiscount
    ? Math.round(
        ((effectiveCompareAtPrice! - effectivePrice) /
          effectiveCompareAtPrice!) *
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

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: "",
    comment: "",
  });
  const [questionForm, setQuestionForm] = useState("");

  const renderStars = (rating: number, size = 14) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={size}
        className={
          rating >= i + 1
            ? "fill-yellow-400 text-yellow-400"
            : rating >= i + 0.5
              ? "fill-yellow-400/50 text-yellow-400"
              : "fill-gray-200 text-gray-200"
        }
      />
    ));

  const ratingBreakdown = useMemo(() => {
    const counts = [0, 0, 0, 0, 0];
    (product.reviews ?? []).forEach((r) => {
      if (r.rating >= 1 && r.rating <= 5) counts[r.rating - 1]++;
    });
    return counts.reverse();
  }, [product.reviews]);

  const totalReviewsActual = product.reviews?.length ?? 0;
  const avgRating =
    totalReviewsActual > 0
      ? (
          product.reviews!.reduce((s, r) => s + r.rating, 0) /
          totalReviewsActual
        ).toFixed(1)
      : product.rating.toFixed(1);

  const handleAddToCart = (buyNow = false) => {
    if (!canAddToCart) {
      toast.error("This action is only available for USER accounts.");
      return;
    }

    if (buyNow && !canCheckout) {
      toast.error("Checkout is only available for USER accounts.");
      return;
    }

    const primaryImg =
      product.images.find((img) => img.isPrimary) ?? product.images[0];
    const attrLabel = Object.entries(selectedAttributes)
      .map(([, v]) => v)
      .join(" / ");
    dispatch(
      addToCart({
        productId: product.id,
        variantId: matchedVariant?.id,
        name: product.name,
        slug: product.slug,
        image: primaryImg?.url ?? "",
        price: effectivePrice,
        compareAtPrice: effectiveCompareAtPrice,
        quantity,
        stock: effectiveStock,
        variantName: attrLabel || undefined,
        selectedAttributes:
          Object.keys(selectedAttributes).length > 0
            ? selectedAttributes
            : undefined,
        freeShipping: product.freeShipping ?? false,
      })
    );
    if (buyNow) {
      router.push("/checkout");
    } else {
      toast.success(`${product.name} added to cart!`);
    }
  };

  const inputClass =
    "w-full px-3 py-2.5 rounded-lg border border-border text-sm bg-background text-foreground focus:outline-none focus:border-primary transition-colors";

  return (
    <div className="container px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
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
          <div className="flex flex-col gap-3">
            {/* Main image */}
            <div className="group relative w-full aspect-square rounded-xl overflow-hidden bg-gray-100 border border-border">
              <Image
                src={product.images[selectedImage]?.url ?? ""}
                alt={product.images[selectedImage]?.alt ?? product.name}
                fill
                className="object-cover transition-transform duration-400 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 33vw"
                priority
              />
            </div>
            {/* Thumbnails (≤5) */}
            {product.images.length > 1 && product.images.length <= 5 && (
              <div className="flex gap-2">
                {product.images.map((img, idx) => (
                  <button
                    key={img.id}
                    className={`relative w-[4.5rem] h-[4.5rem] rounded-lg overflow-hidden cursor-pointer border-2 shrink-0 bg-gray-100 transition-all hover:opacity-80 ${idx === selectedImage ? "border-primary" : "border-transparent"}`}
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
            {/* Thumbnails (>5 with arrows) */}
            {product.images.length > 5 && (
              <div className="relative flex items-center gap-1">
                {selectedImage > 0 && (
                  <button
                    className="flex items-center justify-center w-7 h-7 rounded-full border border-border bg-card text-foreground cursor-pointer shrink-0 shadow-sm hover:bg-primary hover:text-white hover:border-primary transition-all"
                    onClick={() => setSelectedImage((i) => Math.max(0, i - 1))}
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={16} />
                  </button>
                )}
                <div className="flex gap-2 overflow-hidden flex-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={img.id}
                      className={`relative w-[4.5rem] h-[4.5rem] rounded-lg overflow-hidden cursor-pointer border-2 shrink-0 bg-gray-100 transition-all hover:opacity-80 ${idx === selectedImage ? "border-primary" : "border-transparent"}`}
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
                {selectedImage < product.images.length - 1 && (
                  <button
                    className="flex items-center justify-center w-7 h-7 rounded-full border border-border bg-card text-foreground cursor-pointer shrink-0 shadow-sm hover:bg-primary hover:text-white hover:border-primary transition-all"
                    onClick={() =>
                      setSelectedImage((i) =>
                        Math.min(product.images.length - 1, i + 1)
                      )
                    }
                    aria-label="Next image"
                  >
                    <ChevronRight size={16} />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ========== CENTER: Product Info ========== */}
        <div className="lg:col-span-5 flex flex-col gap-4">
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

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>
              Availability:{" "}
              <span
                className={
                  effectiveStock > 0
                    ? "text-green-600 font-semibold"
                    : "text-red-500 font-semibold"
                }
              >
                {effectiveStock > 0 ? "In Stock" : "Out of Stock"}
              </span>
            </span>
            <span>SKU: {matchedVariant?.sku ?? product.sku}</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mt-1">
            <div className="flex items-baseline gap-1">
              <span className="text-sm text-muted-foreground">৳</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-foreground">
                {effectivePrice.toLocaleString()}
              </span>
            </div>
            {hasDiscount && (
              <>
                <span className="text-base text-muted-foreground line-through">
                  ৳{effectiveCompareAtPrice!.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-white bg-red-500 px-2 py-0.5 rounded">
                  -{discountPercent}%
                </span>
              </>
            )}
          </div>

          {hasDiscount && (
            <p className="text-xs text-green-600 font-medium">
              You save ৳
              {(effectiveCompareAtPrice! - effectivePrice).toLocaleString()} on
              this product
            </p>
          )}

          {product.shortDescription && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.shortDescription}
            </p>
          )}

          <hr className="border-border" />

          {/* ====== Attributes ====== */}
          {Object.keys(attributeGroups).length > 0 && (
            <div className="flex flex-col gap-3">
              {Object.entries(attributeGroups).map(([name, values]) => (
                <div key={name}>
                  <span className="text-xs font-semibold text-foreground mb-1.5 block">
                    {name}:{" "}
                    <span className="font-normal text-muted-foreground">
                      {selectedAttributes[name]}
                    </span>
                  </span>
                  <div className="flex gap-2 flex-wrap">
                    {name.toLowerCase() === "color"
                      ? values.map((val) => (
                          <button
                            key={val}
                            className={`flex items-center gap-1.5 px-2.5 py-1 pr-3 rounded-full border-[1.5px] cursor-pointer text-xs text-muted-foreground transition-all ${
                              selectedAttributes[name] === val
                                ? "border-primary bg-primary/10 shadow-[0_0_0_1px] shadow-primary"
                                : "border-border hover:border-primary"
                            }`}
                            onClick={() =>
                              setSelectedAttributes((prev) => ({
                                ...prev,
                                [name]: val,
                              }))
                            }
                            title={val}
                          >
                            <span
                              className="w-[1.15rem] h-[1.15rem] rounded-full shrink-0 border border-black/12"
                              style={{ background: getColorHex(val) }}
                            />
                            <span className="font-medium">{val}</span>
                          </button>
                        ))
                      : values.map((val) => (
                          <button
                            key={val}
                            className={`px-4 py-1.5 text-xs font-medium rounded-md border-[1.5px] cursor-pointer transition-all ${
                              selectedAttributes[name] === val
                                ? "border-primary bg-primary text-white font-semibold"
                                : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                            }`}
                            onClick={() =>
                              setSelectedAttributes((prev) => ({
                                ...prev,
                                [name]: val,
                              }))
                            }
                          >
                            {val}
                          </button>
                        ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-4 flex-wrap mt-1">
            <div>
              <span className="text-xs font-semibold text-foreground mb-1.5 block">
                Quantity:
              </span>
              <div className="flex items-center border border-border rounded-lg overflow-hidden">
                <button
                  className="flex items-center justify-center w-9 h-9 bg-transparent hover:bg-muted text-foreground transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center text-sm font-semibold border-x border-border py-1.5">
                  {quantity}
                </span>
                <button
                  className="flex items-center justify-center w-9 h-9 bg-transparent hover:bg-muted text-foreground transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  onClick={() =>
                    setQuantity((q) => Math.min(effectiveStock, q + 1))
                  }
                  disabled={quantity >= effectiveStock}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <button
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-white transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              disabled={effectiveStock <= 0 || !canCheckout}
              onClick={() => handleAddToCart(true)}
            >
              Buy Now
            </button>
            <button
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              disabled={effectiveStock <= 0 || !canAddToCart}
              onClick={() => handleAddToCart(false)}
            >
              <ShoppingCart size={16} />
              Add to Cart
            </button>
            <button
              className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-colors cursor-pointer ${isWishlisted ? "border-red-300 text-red-500" : "border-border text-muted-foreground hover:text-red-500 hover:border-red-300"}`}
              onClick={() => {
                dispatch(toggleWishlist(product.id));
                toast.success(
                  isWishlisted ? "Removed from wishlist" : "Added to wishlist"
                );
              }}
              aria-label={
                isWishlisted ? "Remove from wishlist" : "Add to wishlist"
              }
            >
              <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
            </button>
            <button
              className="flex items-center justify-center w-10 h-10 rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors cursor-pointer"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: product.name,
                    url: window.location.href,
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Link copied to clipboard!");
                }
              }}
            >
              <Share2 size={18} />
            </button>
          </div>

          {/* Trust badges */}
          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
            {product.freeShipping && (
              <div className="flex items-center gap-1.5">
                <Truck size={14} className="text-green-600" />
                <span>Free Shipping</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-blue-600" />
              <span>Genuine Product</span>
            </div>
          </div>
        </div>

        {/* ========== RIGHT: Pricing Panel & Related ========== */}
        <div className="lg:col-span-3 flex flex-col gap-5">
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
                  ৳{effectivePrice.toLocaleString()}
                </span>
              </div>
              {hasDiscount && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span className="font-medium">
                    -৳
                    {(
                      (effectiveCompareAtPrice! - effectivePrice) *
                      quantity
                    ).toLocaleString()}
                  </span>
                </div>
              )}
              <hr className="border-border" />
              <div className="flex justify-between text-base font-bold">
                <span>Total</span>
                <span className="text-primary">
                  ৳{(effectivePrice * quantity).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Delivery</span>
                <span
                  className={
                    product.freeShipping
                      ? "text-green-600 font-medium"
                      : "font-medium"
                  }
                >
                  {product.freeShipping ? "Free Shipping" : "Standard Shipping"}
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
                          ((rp.compareAtPrice - rp.price) / rp.compareAtPrice) *
                            100
                        )
                      : 0;
                  return (
                    <Link
                      key={rp.id}
                      href={`/products/${rp.slug}`}
                      className="flex gap-3 p-3 rounded-lg border border-border hover:shadow-md hover:-translate-y-0.5 transition-all no-underline"
                    >
                      <div className="relative w-[4.5rem] h-[4.5rem] rounded-md overflow-hidden shrink-0 bg-gray-100">
                        <Image
                          src={rpImg?.url ?? ""}
                          alt={rp.name}
                          fill
                          className="object-cover"
                          sizes="72px"
                        />
                      </div>
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="text-xs font-medium text-foreground line-clamp-2">
                          {rp.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-red-500">
                            ৳{rp.price.toLocaleString()}
                          </span>
                          {rp.compareAtPrice && (
                            <span className="text-[11px] text-gray-400 line-through">
                              ৳{rp.compareAtPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                        {rpDiscount > 0 && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-red-50 text-red-500 w-fit">
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

      {/* ========== TABS ========== */}
      <div className="mt-10">
        <div className="flex gap-0 border-b border-border">
          {(["description", "reviews", "questions"] as const).map((tab) => (
            <button
              key={tab}
              className={`px-5 py-3 text-sm font-semibold transition-colors relative cursor-pointer ${activeTab === tab ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "description" && "Description"}
              {tab === "reviews" &&
                `Reviews (${totalReviewsActual || product.totalReviews})`}
              {tab === "questions" &&
                `Questions (${product.questions?.length ?? 0})`}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t" />
              )}
            </button>
          ))}
        </div>

        <div className="py-6">
          {/* Description */}
          {activeTab === "description" && (
            <div className="max-w-4xl">
              <h2 className="text-lg font-bold text-foreground mb-4">
                {product.name}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6 whitespace-pre-line">
                {product.description}
              </p>
              {product.specifications &&
                Object.keys(product.specifications).length > 0 && (
                  <div>
                    <h3 className="text-base font-bold text-foreground mb-3">
                      Specifications
                    </h3>
                    <div className="rounded-lg border border-border overflow-hidden">
                      <table className="w-full border-collapse">
                        <tbody>
                          {Object.entries(product.specifications).map(
                            ([key, value], idx) => (
                              <tr
                                key={key}
                                className={idx % 2 === 1 ? "bg-muted" : ""}
                              >
                                <td className="px-4 py-2.5 text-sm font-semibold text-foreground w-[40%] border-b border-border">
                                  {key}
                                </td>
                                <td className="px-4 py-2.5 text-sm text-muted-foreground border-b border-border">
                                  {value}
                                </td>
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

          {/* Reviews */}
          {activeTab === "reviews" && (
            <div className="max-w-4xl">
              {/* Summary */}
              <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-6 items-start p-6 rounded-xl border border-border bg-card mb-6">
                <div className="flex flex-col items-center gap-1 md:pr-6 md:border-r md:border-border max-md:border-b max-md:border-border max-md:pb-4">
                  <div className="text-4xl font-extrabold text-foreground leading-none">
                    {avgRating}
                  </div>
                  <div className="flex items-center gap-1 mb-1">
                    {renderStars(Number(avgRating), 18)}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {totalReviewsActual || product.totalReviews} reviews
                  </span>
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                  {ratingBreakdown.map((count, idx) => {
                    const starNum = 5 - idx;
                    const pct =
                      totalReviewsActual > 0
                        ? (count / totalReviewsActual) * 100
                        : 0;
                    return (
                      <div key={starNum} className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-muted-foreground w-10 text-right">
                          {starNum} ★
                        </span>
                        <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full bg-yellow-400 transition-all duration-400"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-[11px] text-muted-foreground w-6">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <button
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold rounded-lg border-[1.5px] border-primary bg-transparent text-primary cursor-pointer hover:bg-primary hover:text-white transition-all whitespace-nowrap self-start"
                  onClick={() => setShowReviewModal(true)}
                >
                  Write a Review
                </button>
              </div>

              {/* Review cards */}
              <div className="flex flex-col gap-4">
                {(product.reviews ?? []).length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare
                      size={32}
                      className="mx-auto text-muted-foreground mb-2"
                    />
                    <p className="text-muted-foreground text-sm">
                      No reviews yet. Be the first to review!
                    </p>
                  </div>
                ) : (
                  (product.reviews ?? []).map((review) => (
                    <div
                      key={review.id}
                      className="p-5 rounded-xl border border-border bg-card hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-0.5">
                            {renderStars(review.rating, 13)}
                          </div>
                          {review.verified && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                              <ShieldCheck size={10} /> Verified
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-muted-foreground">
                          {new Date(review.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-foreground mb-1">
                        {review.title}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                        {review.comment}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          By{" "}
                          <strong className="text-primary font-semibold">
                            {review.author}
                          </strong>
                        </span>
                        {review.helpful !== undefined && review.helpful > 0 && (
                          <button className="inline-flex items-center gap-1 text-[11px] text-muted-foreground border border-border rounded-md px-2.5 py-1 cursor-pointer hover:text-primary hover:border-primary transition-all">
                            <ThumbsUp size={12} /> Helpful ({review.helpful})
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Questions */}
          {activeTab === "questions" && (
            <div className="max-w-4xl">
              <div className="flex items-center justify-between gap-4 mb-6 p-4 sm:p-5 rounded-xl bg-muted flex-wrap">
                <div>
                  <h3 className="text-base font-bold text-foreground flex items-center gap-1.5 mb-0.5">
                    <HelpCircle size={18} /> Customer Questions (
                    {product.questions?.length ?? 0})
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Have a question about this product? Get specific details
                    from expert.
                  </p>
                </div>
                <button
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-semibold rounded-lg border-[1.5px] border-primary bg-transparent text-primary cursor-pointer hover:bg-primary hover:text-white transition-all whitespace-nowrap"
                  onClick={() => setShowQuestionModal(true)}
                >
                  Ask Question
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {(product.questions ?? []).length === 0 ? (
                  <div className="text-center py-8">
                    <HelpCircle
                      size={32}
                      className="mx-auto text-muted-foreground mb-2"
                    />
                    <p className="text-muted-foreground text-sm">
                      No questions yet. Be the first to ask!
                    </p>
                  </div>
                ) : (
                  (product.questions ?? []).map((q) => (
                    <div
                      key={q.id}
                      className="p-5 rounded-xl border border-border bg-card hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-center gap-2 mb-2.5">
                        <span className="text-xs font-semibold text-primary">
                          {q.author}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          on{" "}
                          {new Date(q.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex gap-2 mb-1.5">
                        <span className="text-sm font-bold text-foreground min-w-[1.2rem]">
                          Q:
                        </span>
                        <p className="text-sm text-foreground leading-relaxed">
                          {q.question}
                        </p>
                      </div>
                      {q.answer && (
                        <div className="flex gap-2 p-3 rounded-md bg-muted mt-1">
                          <span className="text-sm font-bold text-foreground min-w-[1.2rem]">
                            A:
                          </span>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {q.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========== Write Review Modal ========== */}
      {showReviewModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in"
          onClick={() => setShowReviewModal(false)}
        >
          <div
            className="bg-card rounded-2xl w-[90%] max-w-[480px] max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <h3 className="text-base font-bold text-foreground">
                Write a Review
              </h3>
              <button
                onClick={() => setShowReviewModal(false)}
                className="flex items-center justify-center p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-foreground">
                  Rating
                </label>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <button
                      key={i}
                      onClick={() =>
                        setReviewForm((f) => ({ ...f, rating: i + 1 }))
                      }
                      className="p-0.5 cursor-pointer"
                    >
                      <Star
                        size={24}
                        className={
                          reviewForm.rating >= i + 1
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-gray-200 text-gray-200"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-foreground">
                  Title
                </label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Review title..."
                  value={reviewForm.title}
                  onChange={(e) =>
                    setReviewForm((f) => ({ ...f, title: e.target.value }))
                  }
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-foreground">
                  Comment
                </label>
                <textarea
                  className={`${inputClass} resize-y font-[inherit]`}
                  rows={4}
                  placeholder="Share your experience..."
                  value={reviewForm.comment}
                  onChange={(e) =>
                    setReviewForm((f) => ({ ...f, comment: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="px-6 pb-6 flex justify-end">
              <button
                className="inline-flex items-center gap-1.5 px-6 py-2.5 text-sm font-semibold rounded-lg bg-primary text-primary-foreground cursor-pointer hover:opacity-90 active:scale-[0.97] transition-all"
                onClick={() => {
                  toast.success(
                    "Review submitted! Thank you for your feedback."
                  );
                  setShowReviewModal(false);
                  setReviewForm({ rating: 5, title: "", comment: "" });
                }}
              >
                <Send size={14} /> Submit Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== Ask Question Modal ========== */}
      {showQuestionModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in"
          onClick={() => setShowQuestionModal(false)}
        >
          <div
            className="bg-card rounded-2xl w-[90%] max-w-[480px] max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <h3 className="text-base font-bold text-foreground">
                Ask a Question
              </h3>
              <button
                onClick={() => setShowQuestionModal(false)}
                className="flex items-center justify-center p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-foreground">
                  Your Question
                </label>
                <textarea
                  className={`${inputClass} resize-y font-[inherit]`}
                  rows={4}
                  placeholder="What would you like to know about this product?"
                  value={questionForm}
                  onChange={(e) => setQuestionForm(e.target.value)}
                />
              </div>
            </div>
            <div className="px-6 pb-6 flex justify-end">
              <button
                className="inline-flex items-center gap-1.5 px-6 py-2.5 text-sm font-semibold rounded-lg bg-primary text-primary-foreground cursor-pointer hover:opacity-90 active:scale-[0.97] transition-all"
                onClick={() => {
                  toast.success(
                    "Question submitted! We'll get back to you soon."
                  );
                  setShowQuestionModal(false);
                  setQuestionForm("");
                }}
              >
                <Send size={14} /> Submit Question
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getColorHex(colorName: string): string {
  const map: Record<string, string> = {
    Indigo: "#3F51B5",
    "Light Wash": "#A8C4E0",
    "Rose Pink": "#E8919A",
    "Sky Blue": "#87CEEB",
    Charcoal: "#36454F",
    Cream: "#FFFDD0",
    "Forest Green": "#228B22",
    Black: "#1a1a1a",
    "Grey Marl": "#9E9E9E",
    Khaki: "#C3B091",
    Navy: "#000080",
    Olive: "#808000",
    "Dusty Pink": "#D4A0A0",
    White: "#FFFFFF",
  };
  return map[colorName] ?? "#ccc";
}
