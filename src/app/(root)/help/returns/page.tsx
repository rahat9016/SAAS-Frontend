import { Banknote, PackageCheck, RotateCcw, Tag, Truck } from "lucide-react";
import Link from "next/link";

const steps = [
  { icon: RotateCcw, title: "Start your return", text: "Go to your Orders page and select the items within 14 days of delivery." },
  { icon: Tag, title: "Pack it up", text: "Repack with all tags attached, in the original packaging where possible." },
  { icon: Truck, title: "Drop it off", text: "Attach the free prepaid label and drop at any partner point." },
  { icon: Banknote, title: "Get refunded", text: "We refund the original payment method once the return is received." },
];

const eligible = [
  "Unworn items with original tags attached",
  "Footwear returned in the original box",
  "Items returned within 14 days of delivery",
];
const excluded = [
  "Underwear & swimwear without hygiene seal",
  "Pierced jewellery & cosmetics that are opened",
  "Personalised or made-to-order items",
];

const faqs = [
  { q: "How long do refunds take?", a: "5–10 days after we receive your return, back to the original payment method." },
  { q: "Do I pay for returns?", a: "No — returns are completely free with the prepaid label." },
  { q: "Can I exchange instead of refund?", a: "Return the item for a refund and place a new order for the size/colour you want." },
  { q: "What if my item is faulty?", a: "Contact support — faulty items are returned free and refunded in full, even after 14 days." },
];

export default function ReturnPolicyPage() {
  return (
    <div className="container px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero */}
      <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-secondary to-primary p-8 text-white md:p-10">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
          <PackageCheck size={14} /> Free returns
        </span>
        <h1 className="mt-3 text-3xl font-bold md:text-4xl">14-day return policy</h1>
        <p className="mt-2 max-w-xl text-sm opacity-90">
          Changed your mind? You have 14 days from delivery to send items back for a full refund — returns are always free.
        </p>
      </div>

      {/* Steps */}
      <h2 className="mt-10 text-xl font-bold text-secondary">How returns work</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map(({ icon: Icon, title, text }, i) => (
          <div key={title} className="rounded-2xl border border-gray-200 p-5">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                {i + 1}
              </span>
              <Icon size={20} className="text-primary" />
            </div>
            <h3 className="mt-3 font-bold text-secondary">{title}</h3>
            <p className="mt-1 text-sm text-gray-600">{text}</p>
          </div>
        ))}
      </div>

      {/* Eligibility */}
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 p-6">
          <h3 className="font-bold text-secondary">✓ Eligible for return</h3>
          <ul className="mt-3 space-y-2">
            {eligible.map((e) => (
              <li key={e} className="text-sm text-gray-600">• {e}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-gray-200 p-6">
          <h3 className="font-bold text-secondary">✕ Not returnable</h3>
          <ul className="mt-3 space-y-2">
            {excluded.map((e) => (
              <li key={e} className="text-sm text-gray-600">• {e}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* FAQ */}
      <h2 className="mt-12 text-xl font-bold text-secondary">Return FAQs</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {faqs.map((f) => (
          <div key={f.q} className="rounded-xl bg-light p-5">
            <h3 className="text-sm font-bold text-secondary">{f.q}</h3>
            <p className="mt-1 text-sm text-gray-600">{f.a}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Link href="/orders" className="rounded-full bg-secondary px-6 py-2.5 text-sm font-semibold text-white hover:bg-secondary/90">
          Start a return
        </Link>
      </div>
    </div>
  );
}
