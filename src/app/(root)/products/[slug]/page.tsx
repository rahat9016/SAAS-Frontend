export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-semibold">Product Detail</h1>
      <p className="text-muted-foreground mt-2">Product details will appear here</p>
    </div>
  );
}
