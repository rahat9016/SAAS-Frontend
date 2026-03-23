"use client";

import {
    BadgeCheck,
    CreditCard,
    Lock,
    RotateCcw,
    Tag,
    Truck,
} from "lucide-react";
import styles from "./TrustBar.module.css";

const badges = [
  {
    icon: <CreditCard size={18} />,
    label: "Easy Payment",
  },
  {
    icon: <Truck size={18} />,
    label: "Nationwide Delivery",
  },
  {
    icon: <RotateCcw size={18} />,
    label: "Easy Returns",
  },
  {
    icon: <Tag size={18} />,
    label: "Best Price",
  },
  {
    icon: <BadgeCheck size={18} />,
    label: "100% Authentic",
  },
  {
    icon: <Lock size={18} />,
    label: "Secure Payment",
  },
];

export default function TrustBar() {
  return (
    <div className={styles.trustBar}>
      <div className={styles.trackWrap}>
        {badges.map((badge) => (
          <div key={badge.label} className={styles.badge}>
            <span className={styles.iconWrap}>{badge.icon}</span>
            <span className={styles.label}>{badge.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
