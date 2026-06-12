"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface AccordionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

/** Expandable section (Material & care, Details, Size & fit). */
export default function Accordion({ title, defaultOpen = false, children }: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-t border-gray-200">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between py-4 text-left"
      >
        <span className="text-base font-semibold text-secondary">{title}</span>
        <ChevronDown
          size={20}
          className={`text-gray-500 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="pb-5">{children}</div>}
    </div>
  );
}

/** Render a list of label:value spec rows. */
export function SpecList({ items }: { items: { label: string; value: string }[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((s) => (
        <li key={s.label} className="text-sm text-gray-600">
          <span className="font-semibold text-secondary">{s.label}:</span> {s.value}
        </li>
      ))}
    </ul>
  );
}
