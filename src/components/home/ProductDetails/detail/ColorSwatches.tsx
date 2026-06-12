"use client";

import Image from "next/image";
import { DetailColor } from "./detailTypes";

interface ColorSwatchesProps {
  colors: DetailColor[];
  activeId: string;
  onSelect: (id: string) => void;
}

/** Colour variant thumbnails with selected ring. */
export default function ColorSwatches({ colors, activeId, onSelect }: ColorSwatchesProps) {
  if (colors.length <= 1) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {colors.map((c) => (
        <button
          key={c.id}
          type="button"
          title={c.label}
          onClick={() => onSelect(c.id)}
          className={`relative h-16 w-14 overflow-hidden rounded-lg bg-light transition ${
            activeId === c.id ? "ring-2 ring-secondary" : "ring-1 ring-gray-200 hover:ring-gray-300"
          }`}
        >
          <Image src={c.image} alt={c.label} fill sizes="56px" className="object-cover" />
        </button>
      ))}
    </div>
  );
}
