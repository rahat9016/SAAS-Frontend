import ProductDetailView from "@/src/components/home/ProductDetails/detail/ProductDetailView";
import { getProductDetail } from "@/src/components/home/ProductDetails/detail/detailData";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductDetail(slug);

  return <ProductDetailView product={product} />;
}
