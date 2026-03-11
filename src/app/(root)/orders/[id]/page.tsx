export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-semibold">Order Details</h1>
      <p className="text-muted-foreground mt-2">Order information and tracking</p>
    </div>
  );
}
