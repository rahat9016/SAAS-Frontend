"use client";

import { Check, Globe } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const LANGUAGES = [
  { code: "EN", label: "English" },
  { code: "DE", label: "Deutsch" },
  { code: "FR", label: "Français" },
  { code: "ES", label: "Español" },
];

/** Language selector with a dropdown menu. */
export default function LanguageDropdown() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("EN");
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
        className="flex flex-col items-center gap-0.5 px-3 py-1.5 text-gray-600 hover:text-primary transition-colors group"
      >
        <span className="flex items-center gap-1">
          <span className="text-xs font-bold">{active}</span>
          <Globe size={18} className="group-hover:scale-110 transition-transform" />
        </span>
        <span className="text-xs">Language</span>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-1 w-44 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => {
                setActive(l.code);
                setOpen(false);
              }}
              className="flex w-full items-center justify-between px-3 py-2 text-sm text-secondary hover:bg-light"
            >
              <span>
                <span className="mr-2 font-semibold text-gray-400">{l.code}</span>
                {l.label}
              </span>
              {active === l.code && <Check size={15} className="text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
