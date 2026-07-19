"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DetailSize } from "./detailTypes";

interface SizeSelectProps {
  sizes: DetailSize[];
  value: string | null;
  onChange: (label: string) => void;
  error?: boolean;
}

/** Custom size dropdown with stock notes + sold-out states. */
export default function SizeSelect({ sizes, value, onChange, error }: SizeSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex h-12 w-full items-center rounded-md border bg-white p-1 pl-3 text-sm transition-colors ${
          error ? "border-red-400" : "border-gray-300 hover:border-gray-400"
        }`}
      >
        <span className={value ? "text-secondary" : "text-gray-400"}>
          {value ?? "Choose your size"}
        </span>
        <ChevronDown size={18} className={`text-gray-500 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-20 mt-1 max-h-72 w-full overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
          {sizes.map((s) => (
            <button
              key={s.label}
              type="button"
              disabled={s.soldOut}
              onClick={() => {
                onChange(s.label);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between border-b border-gray-100 px-4 py-3 text-left text-sm last:border-0 ${
                s.soldOut
                  ? "cursor-not-allowed text-gray-300"
                  : "text-secondary hover:bg-light"
              }`}
            >
              <span className={s.soldOut ? "line-through" : "font-medium"}>{s.label}</span>
              {s.note && <span className="text-xs text-gray-400">{s.note}</span>}
              {s.soldOut && !s.note && <span className="text-xs text-gray-300">Sold out</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
