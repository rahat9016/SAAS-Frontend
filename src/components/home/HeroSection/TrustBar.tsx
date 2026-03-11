"use client";

import {
    BadgeCheck,
    CreditCard,
    Lock,
    RotateCcw,
    Tag,
    Truck,
} from "lucide-react";

const badges = [
  {
    icon: <CreditCard size={20} className="text-primary" />,
    label: "Easy Payment",
  },
  {
    icon: <Truck size={20} className="text-primary" />,
    label: "Nationwide Delivery",
  },
  {
    icon: <RotateCcw size={20} className="text-primary" />,
    label: "Free & Easy Returns",
  },
  {
    icon: <Tag size={20} className="text-primary" />,
    label: "Best Price Guaranteed",
  },
  {
    icon: <BadgeCheck size={20} className="text-primary" />,
    label: "100% Authentic Products",
  },
  {
    icon: <Lock size={20} className="text-primary" />,
    label: "Secure Payment",
  },
];

export default function TrustBar() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg mt-4 lg:mt-5">
      <div className="flex items-center overflow-x-auto scrollbar-none">
        {badges.map((badge, index) => (
          <div
            key={badge.label}
            className={`flex items-center gap-2 px-4 lg:px-5 py-3 shrink-0 ${
              index < badges.length - 1
                ? "border-r border-gray-200"
                : ""
            }`}
          >
            {badge.icon}
            <span className="text-xs lg:text-sm font-medium text-gray-700 whitespace-nowrap">
              {badge.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
