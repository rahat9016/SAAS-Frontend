export default function BrandProductsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-semibold">Brand Products</h1>
      <p className="text-muted-foreground mt-2">Products from this brand</p>
    </div>
  );
}
