"use client";

import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function CheckoutFailPage() {
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
          maxWidth: 420,
          margin: "0 auto",
        }}
      >
        {/* Fail Icon */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "#fef2f2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AlertTriangle size={40} color="#ef4444" />
        </div>

        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "var(--foreground)",
          }}
        >
          Payment Failed
        </h1>

        <p
          style={{
            fontSize: "0.9rem",
            color: "var(--muted-foreground)",
            lineHeight: 1.6,
          }}
        >
          Something went wrong with your payment. Don&apos;t worry — your cart
          items are still saved. Please try again.
        </p>

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
            href="/checkout"
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0.7rem",
              borderRadius: "0.5rem",
              fontSize: "0.85rem",
              fontWeight: 600,
              background: "var(--primary)",
              color: "var(--primary-foreground)",
              textDecoration: "none",
            }}
          >
            Retry Payment
          </Link>
          <Link
            href="/"
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0.7rem",
              borderRadius: "0.5rem",
              fontSize: "0.85rem",
              fontWeight: 600,
              border: "1px solid var(--border)",
              color: "var(--foreground)",
              textDecoration: "none",
            }}
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
