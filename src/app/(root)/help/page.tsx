import {
  CreditCard,
  Mail,
  MessageCircle,
  Package,
  Phone,
  RotateCcw,
  Ruler,
  ShieldCheck,
  Truck,
} from "lucide-react";
import Link from "next/link";

const topics = [
  { icon: Truck, label: "Track your parcel", text: "See where your order is.", href: "/orders" },
  { icon: Package, label: "Delivery information", text: "Times, costs & options.", href: "/help" },
  { icon: RotateCcw, label: "Returns & refunds", text: "14-day free returns.", href: "/help/returns" },
  { icon: Ruler, label: "Find the right size", text: "Size guides & fit tips.", href: "/help" },
  { icon: CreditCard, label: "Payment & invoices", text: "Methods & billing.", href: "/help" },
  { icon: ShieldCheck, label: "Report an issue", text: "Damaged or wrong item.", href: "/help" },
];

const contacts = [
  { icon: MessageCircle, title: "Live chat", text: "Mon–Sat, 9am–8pm", action: "Start chat" },
  { icon: Mail, title: "Email us", text: "support@familiemunshi.com", action: "Send email" },
  { icon: Phone, title: "Call us", text: "+49 30 1234 5678", action: "Call now" },
];

const faqs = [
  { q: "How long does delivery take?", a: "Standard delivery is 2–4 working days. Express options are available at checkout." },
  { q: "Is delivery free?", a: "Yes — free standard delivery on orders over €34.90, and free returns always." },
  { q: "Can I change my order after placing it?", a: "We process orders fast, but contact us within 1 hour and we'll do our best." },
  { q: "How do I track my parcel?", a: "Open your Orders page or use the tracking link in your shipping email." },
  { q: "What payment methods do you accept?", a: "Visa, Mastercard, PayPal, Klarna, Apple Pay, Amex and more." },
  { q: "How do refunds work?", a: "Refunds go back to your original payment method within 5–10 days of us receiving the return." },
];

export default function HelpPage() {
  return (
    <div className="container px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-secondary">Help and contact</h1>
      <p className="mt-2 max-w-2xl text-sm text-gray-600">
        Need a hand? Browse popular topics, read FAQs, or reach our support team directly.
      </p>

      {/* Topics */}
      <h2 className="mt-8 text-xl font-bold text-secondary">Popular topics</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map(({ icon: Icon, label, text, href }) => (
          <Link
            key={label}
            href={href}
            className="group rounded-xl border border-gray-200 p-5 transition-colors hover:border-primary"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon size={22} />
            </div>
            <h3 className="mt-3 font-bold text-secondary group-hover:text-primary">{label}</h3>
            <p className="mt-1 text-sm text-gray-600">{text}</p>
          </Link>
        ))}
      </div>

      {/* Contact channels */}
      <h2 className="mt-12 text-xl font-bold text-secondary">Contact us</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {contacts.map(({ icon: Icon, title, text, action }) => (
          <div key={title} className="rounded-2xl bg-light p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-primary">
              <Icon size={22} />
            </div>
            <h3 className="mt-3 font-bold text-secondary">{title}</h3>
            <p className="mt-1 text-sm text-gray-600">{text}</p>
            <button className="mt-3 rounded-full bg-secondary px-4 py-1.5 text-xs font-semibold text-white hover:bg-secondary/90">
              {action}
            </button>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <h2 className="mt-12 text-xl font-bold text-secondary">Frequently asked questions</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {faqs.map((f) => (
          <div key={f.q} className="rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-bold text-secondary">{f.q}</h3>
            <p className="mt-1 text-sm text-gray-600">{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
