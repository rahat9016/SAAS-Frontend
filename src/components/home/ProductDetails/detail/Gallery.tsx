"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface GalleryProps {
  images: string[];
  alt: string;
}

/** Vertical thumbnail rail + large main image. */
export default function Gallery({ images, alt }: GalleryProps) {
  const [active, setActive] = useState(0);
  const list = images.length ? images : [""];

  return (
    <div className="flex gap-2 sm:gap-3">
      {/* Thumbnails */}
      <div className="flex w-14 flex-col items-center gap-2 sm:w-16">
        <button
          type="button"
          aria-label="scroll up"
          className="hidden h-6 w-6 items-center justify-center rounded-full text-gray-400 hover:text-secondary md:flex"
        >
          <ChevronUp size={16} />
        </button>
        <div className="flex max-h-[520px] flex-col gap-2 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {list.map((src, i) => (
            <button
              key={i}
              type="button"
              onMouseEnter={() => setActive(i)}
              onClick={() => setActive(i)}
              className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-light sm:h-16 sm:w-16 ${
                active === i ? "ring-2 ring-secondary" : "ring-1 ring-gray-200"
              }`}
            >
              <Image src={src} alt={`${alt} ${i + 1}`} fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
        <button
          type="button"
          aria-label="scroll down"
          className="hidden h-6 w-6 items-center justify-center rounded-full text-gray-400 hover:text-secondary md:flex"
        >
          <ChevronDown size={16} />
        </button>
      </div>

      {/* Main image (capped under 500px) */}
      <div className="relative aspect-[4/5] w-full max-w-[390px] overflow-hidden rounded-xl bg-light">
        <Image
          src={list[active]}
          alt={alt}
          fill
          sizes="390px"
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}
