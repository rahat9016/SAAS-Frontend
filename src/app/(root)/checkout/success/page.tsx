"use client";

import { CheckCircle, Package, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  // Generate a random order number
  const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`;

  return (
    <div className="container">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "4rem 2rem",
          textAlign: "center",
          gap: "1.25rem",
          maxWidth: 480,
          margin: "0 auto",
        }}
      >
        {/* Success Icon */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "#f0fdf4",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "fadeInScale 0.5s ease-out",
          }}
        >
          <CheckCircle size={40} color="#16a34a" />
        </div>

        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "var(--foreground)",
          }}
        >
          Order Placed Successfully!
        </h1>

        <p
          style={{
            fontSize: "0.9rem",
            color: "var(--muted-foreground)",
            lineHeight: 1.6,
          }}
        >
          Thank you for your order. Your order number is{" "}
          <strong style={{ color: "var(--primary)" }}>{orderNumber}</strong>.
          We&apos;ll send you a confirmation shortly.
        </p>

        {/* Info Cards */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            width: "100%",
            marginTop: "0.5rem",
          }}
        >
          <div
            style={{
              flex: 1,
              padding: "1rem",
              borderRadius: "0.5rem",
              border: "1px solid var(--border)",
              background: "var(--card)",
              textAlign: "center",
            }}
          >
            <Package
              size={20}
              style={{ margin: "0 auto 0.5rem", color: "var(--primary)" }}
            />
            <p style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>
              Estimated Delivery
            </p>
            <p
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "var(--foreground)",
              }}
            >
              3-5 Business Days
            </p>
          </div>
          <div
            style={{
              flex: 1,
              padding: "1rem",
              borderRadius: "0.5rem",
              border: "1px solid var(--border)",
              background: "var(--card)",
              textAlign: "center",
            }}
          >
            <ShoppingBag
              size={20}
              style={{ margin: "0 auto 0.5rem", color: "var(--primary)" }}
            />
            <p style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>
              Payment
            </p>
            <p
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "var(--foreground)",
              }}
            >
              Cash on Delivery
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            width: "100%",
            marginTop: "0.5rem",
          }}
        >
          <Link
            href="/orders"
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.4rem",
              padding: "0.7rem",
              borderRadius: "0.5rem",
              fontSize: "0.85rem",
              fontWeight: 600,
              border: "1px solid var(--border)",
              color: "var(--foreground)",
              textDecoration: "none",
              transition: "background 0.2s",
            }}
          >
            View Orders
          </Link>
          <Link
            href="/"
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.4rem",
              padding: "0.7rem",
              borderRadius: "0.5rem",
              fontSize: "0.85rem",
              fontWeight: 600,
              background: "var(--primary)",
              color: "var(--primary-foreground)",
              textDecoration: "none",
              transition: "opacity 0.2s",
            }}
          >
            Continue Shopping
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
