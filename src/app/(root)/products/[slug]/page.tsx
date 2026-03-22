import { dummyProducts } from "@/src/data/dummyProducts";
import ProductDetails from "@/src/components/home/ProductDetails/ProductDetails";
import { notFound } from "next/navigation";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = dummyProducts.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  return <ProductDetails product={product} />;
}
