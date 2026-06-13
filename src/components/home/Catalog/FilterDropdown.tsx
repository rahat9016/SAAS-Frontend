"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface FilterDropdownProps {
  label: string;
  options: string[];
}

/** A single filter pill that opens a checkbox dropdown. */
export default function FilterDropdown({ label, options }: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const toggle = (o: string) =>
    setSelected((s) => (s.includes(o) ? s.filter((x) => x !== o) : [...s, o]));

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
          selected.length
            ? "border-secondary bg-secondary text-white"
            : "border-gray-300 text-secondary hover:border-gray-400"
        }`}
      >
        {label}
        {selected.length > 0 && ` (${selected.length})`}
        <ChevronDown size={15} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute left-0 z-30 mt-1 max-h-72 w-56 overflow-y-auto rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
          {options.map((o) => {
            const on = selected.includes(o);
            return (
              <button
                key={o}
                type="button"
                onClick={() => toggle(o)}
                className="flex w-full items-center justify-between px-4 py-2 text-sm text-secondary hover:bg-light"
              >
                <span>{o}</span>
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded border ${
                    on ? "border-primary bg-primary text-white" : "border-gray-300"
                  }`}
                >
                  {on && <Check size={12} strokeWidth={3} />}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
