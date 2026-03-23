"use client";

import { dummyPaymentMethods, IPaymentCard } from "@/src/data/dummyPaymentMethods";
import {
  Check,
  CreditCard,
  Plus,
  Shield,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";

const brandLogos: Record<string, { name: string; gradient: string; textColor: string }> = {
  visa: { name: "VISA", gradient: "from-blue-600 to-blue-800", textColor: "text-white" },
  mastercard: { name: "MC", gradient: "from-red-500 to-orange-500", textColor: "text-white" },
  amex: { name: "AMEX", gradient: "from-emerald-500 to-teal-600", textColor: "text-white" },
  discover: { name: "DISC", gradient: "from-orange-400 to-amber-500", textColor: "text-white" },
};

export default function PaymentMethodsPage() {
  const [cards, setCards] = useState<IPaymentCard[]>(dummyPaymentMethods);
  const [showForm, setShowForm] = useState(false);

  const handleDelete = (id: string) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
  };

  const setDefault = (id: string) => {
    setCards((prev) =>
      prev.map((c) => ({ ...c, isDefault: c.id === id }))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Payment Methods</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your saved payment methods</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm cursor-pointer"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Add Card</span>
        </button>
      </div>

      {/* Stripe Security Badge */}
      <div className="flex items-center gap-2 px-4 py-3 bg-blue-50/50 border border-blue-100 rounded-lg">
        <Shield size={18} className="text-blue-600 shrink-0" />
        <p className="text-xs text-blue-700">
          Your payment information is securely processed by <strong>Stripe</strong>. 
          We never store your full card details.
        </p>
      </div>

      {/* Card List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards.map((card) => {
          const brand = brandLogos[card.brand] || brandLogos.visa;
          return (
            <div
              key={card.id}
              className={`relative bg-white rounded-xl border p-5 shadow-sm transition-all hover:shadow-md ${
                card.isDefault ? "border-primary/30 ring-1 ring-primary/10" : "border-gray-100"
              }`}
            >
              {/* Card Visual */}
              <div className={`w-full h-36 rounded-xl bg-gradient-to-br ${brand.gradient} p-5 flex flex-col justify-between shadow-inner mb-4`}>
                <div className="flex items-center justify-between">
                  <div className="w-10 h-7 rounded bg-white/20 flex items-center justify-center">
                    <CreditCard size={18} className="text-white/80" />
                  </div>
                  <span className={`text-lg font-bold ${brand.textColor} tracking-widest opacity-90`}>
                    {brand.name}
                  </span>
                </div>
                <div>
                  <p className="text-white/70 text-xs tracking-widest mb-1">
                    •••• •••• •••• {card.last4}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-white/90 text-xs font-medium uppercase tracking-wider">
                      {card.holderName}
                    </p>
                    <p className="text-white/70 text-xs">
                      {String(card.expMonth).padStart(2, "0")}/{card.expYear}
                    </p>
                  </div>
                </div>
              </div>

              {/* Default + Info */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-semibold text-gray-800 capitalize">
                  {card.brand} ending in {card.last4}
                </span>
                {card.isDefault && (
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Check size={11} />
                    Default
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500">
                Expires {String(card.expMonth).padStart(2, "0")}/{card.expYear}
              </p>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
                {!card.isDefault && (
                  <>
                    <button
                      onClick={() => setDefault(card.id)}
                      className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-primary transition-colors cursor-pointer"
                    >
                      <Star size={13} />
                      Set as Default
                    </button>
                    <span className="text-gray-200">|</span>
                  </>
                )}
                <button
                  onClick={() => handleDelete(card.id)}
                  className="flex items-center gap-1.5 text-xs font-medium text-red-400 hover:text-red-600 transition-colors cursor-pointer"
                >
                  <Trash2 size={13} />
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Card Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <CreditCard size={18} className="text-primary" />
                <h2 className="text-lg font-semibold text-gray-900">Add Payment Method</h2>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Stripe Elements Placeholder */}
            <div className="px-6 py-6 space-y-4">
              <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50 text-center">
                <CreditCard size={32} className="text-gray-300 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-600">Stripe Card Element</p>
                <p className="text-xs text-gray-400 mt-1">
                  This area will be replaced with Stripe Elements for secure card input
                </p>
              </div>

              {/* Mock form fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Card Number</label>
                <input
                  type="text"
                  placeholder="4242 4242 4242 4242"
                  className="w-full h-11 px-4 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full h-11 px-4 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">CVC</label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full h-11 px-4 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Cardholder Name</label>
                <input
                  type="text"
                  placeholder="Name on card"
                  className="w-full h-11 px-4 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <Shield size={14} />
                Secured by Stripe
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowForm(false)}
                  className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button className="px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm cursor-pointer">
                  Add Card
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
