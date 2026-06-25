import { Gift, Mail, RefreshCw, Sparkles, Wallet } from "lucide-react";
import Link from "next/link";

const cards = [
  { amount: 25, theme: "from-rose-400 to-pink-600" },
  { amount: 50, theme: "from-cyan-400 to-blue-700" },
  { amount: 75, theme: "from-fuchsia-500 to-purple-700" },
  { amount: 100, theme: "from-amber-400 to-orange-600" },
  { amount: 150, theme: "from-emerald-400 to-teal-600" },
  { amount: 200, theme: "from-[#ffd1dc] to-[#ffd1dc]" },
];

const steps = [
  { icon: Wallet, title: "Choose an amount", text: "Pick any value from €25 to €250." },
  { icon: Mail, title: "Send instantly", text: "Delivered by email — schedule it for any date." },
  { icon: Gift, title: "They redeem", text: "Spend on everything, online or in app." },
];

const faqs = [
  { q: "How long is a gift card valid?", a: "24 months from the date of purchase." },
  { q: "Can it be used with discounts?", a: "Yes — gift cards stack with sale prices and promo codes." },
  { q: "Is there a fee?", a: "No fees, ever. You pay exactly the card value." },
];

export default function GiftCardsPage() {
  return (
    <div className="container px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero */}
      <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-fuchsia-500 to-secondary p-8 text-white md:p-12">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
          <Sparkles size={14} /> The perfect present
        </span>
        <h1 className="mt-3 text-3xl font-bold md:text-5xl">Gift Cards</h1>
        <p className="mt-2 max-w-xl text-sm opacity-90 md:text-base">
          Give the gift of choice. Redeemable on everything, valid for 24 months, delivered instantly.
        </p>
      </div>

      {/* Amount cards */}
      <h2 className="mt-10 text-xl font-bold text-secondary">Choose your amount</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <button
            key={c.amount}
            className={`group flex aspect-[16/9] flex-col justify-between rounded-2xl bg-gradient-to-br ${c.theme} p-5 text-left text-white shadow-sm transition-transform hover:scale-[1.02]`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold opacity-90">Familie Munshi</span>
              <Gift size={20} className="opacity-90" />
            </div>
            <span className="text-4xl font-bold">€{c.amount}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="#" className="rounded-full bg-secondary px-6 py-2.5 text-sm font-semibold text-white hover:bg-secondary/90">
          Buy a Gift Card
        </Link>
        <Link href="#" className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-6 py-2.5 text-sm font-semibold text-secondary hover:bg-light">
          <RefreshCw size={16} /> Redeem a Gift Card
        </Link>
      </div>

      {/* How it works */}
      <h2 className="mt-12 text-xl font-bold text-secondary">How it works</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {steps.map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-2xl border border-gray-200 p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon size={22} />
            </div>
            <h3 className="mt-3 font-bold text-secondary">{title}</h3>
            <p className="mt-1 text-sm text-gray-600">{text}</p>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <h2 className="mt-12 text-xl font-bold text-secondary">Good to know</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {faqs.map((f) => (
          <div key={f.q} className="rounded-2xl bg-light p-5">
            <h3 className="text-sm font-bold text-secondary">{f.q}</h3>
            <p className="mt-1 text-sm text-gray-600">{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
