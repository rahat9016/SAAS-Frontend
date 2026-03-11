export default function CheckoutFailPage() {
  return (
    <div className="container py-16 text-center">
      <h1 className="text-2xl font-semibold text-red-600">Payment Failed</h1>
      <p className="text-muted-foreground mt-2">Something went wrong. Please try again.</p>
    </div>
  );
}
