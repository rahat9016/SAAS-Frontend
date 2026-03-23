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
  { icon: <CreditCard size={18} />, label: "Easy Payment" },
  { icon: <Truck size={18} />, label: "Nationwide Delivery" },
  { icon: <RotateCcw size={18} />, label: "Easy Returns" },
  { icon: <Tag size={18} />, label: "Best Price" },
  { icon: <BadgeCheck size={18} />, label: "100% Authentic" },
  { icon: <Lock size={18} />, label: "Secure Payment" },
];

export default function TrustBar() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl mt-5 overflow-hidden max-sm:border-none max-sm:bg-transparent max-sm:rounded-none max-sm:overflow-visible">
      <div className="flex items-stretch overflow-x-auto scrollbar-hide max-sm:gap-2.5 max-sm:px-1 max-sm:snap-x max-sm:snap-mandatory">
        {badges.map((badge, idx) => (
          <div
            key={badge.label}
            className={`
              flex items-center gap-2.5 py-3.5 px-4 whitespace-nowrap hover:bg-gray-50 transition-colors
              ${idx < badges.length - 1 ? "border-r border-gray-200" : ""}
              lg:flex-1 lg:justify-center lg:py-3.5 lg:px-1.5 lg:gap-2 lg:min-w-0
              max-sm:flex-col max-sm:items-center max-sm:justify-center max-sm:gap-1.5
              max-sm:min-w-[5.5rem] max-sm:py-3 max-sm:px-2 max-sm:border-r-0
              max-sm:bg-white max-sm:border max-sm:border-gray-200 max-sm:rounded-xl
              max-sm:text-center max-sm:snap-start max-sm:shrink-0
            `}
          >
            <span className="inline-flex items-center justify-center w-8 h-8 min-w-8 min-h-8 rounded-full bg-primary/10 text-primary lg:w-[1.65rem] lg:h-[1.65rem] lg:min-w-[1.65rem] lg:min-h-[1.65rem] max-sm:w-9 max-sm:h-9 max-sm:min-w-9 max-sm:min-h-9">
              {badge.icon}
            </span>
            <span className="text-[13px] font-semibold text-gray-700 tracking-tight lg:text-[11.5px] lg:overflow-hidden lg:text-ellipsis max-sm:text-[10.5px] max-sm:whitespace-nowrap max-sm:leading-tight">
              {badge.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
