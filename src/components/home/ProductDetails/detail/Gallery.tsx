"use client";

import { ChevronDown, ChevronUp, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface GalleryProps {
  images: string[];
  alt: string;
}

/** Vertical thumbnail rail + large main image. */
export default function Gallery({ images, alt }: GalleryProps) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const list = images.length ? images : [""];

  const trackCursor = (e: React.MouseEvent<HTMLDivElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - box.left) / box.width) * 100;
    const y = ((e.clientY - box.top) / box.height) * 100;
    setOrigin(`${x}% ${y}%`);
  };

  return (
    <div className="flex gap-2 sm:gap-3">
      {/* Thumbnails */}
      <div className="flex w-20 flex-col items-center gap-3 sm:w-24">
        <div className="flex max-h-[600px] flex-col gap-2 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {list.map((src, i) => (
            <button
              key={i}
              type="button"
              onMouseEnter={() => setActive(i)}
              onClick={() => setActive(i)}
              className={`flex w-20 aspect-[3/4] shrink-0 rounded-lg p-[3px] transition-all sm:w-24 ${
                active === i ? "border-[1.5px] border-secondary" : "border-[1.5px] border-transparent hover:border-gray-300"
              }`}
            >
              <div className="relative h-full w-full overflow-hidden rounded-md bg-light">
                <Image src={src} alt={`${alt} ${i + 1}`} fill sizes="64px" className="object-cover" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main image — fills the gallery column; zooms toward the cursor on hover */}
      <div
        className="relative aspect-[3/4] flex-1 cursor-zoom-in overflow-hidden rounded-xl bg-light"
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
        onMouseMove={trackCursor}
        onClick={() => setIsFullScreen(true)}
      >
        <Image
          src={list[active]}
          alt={alt}
          fill
          sizes="(max-width:1024px) 90vw, 60vw"
          style={{ transformOrigin: origin }}
          className={`object-cover transition-transform duration-200 ease-out ${
            zoomed ? "scale-200" : "scale-100"
          }`}
          priority
        />
      </div>

      {/* Full-screen Modal */}
      {isFullScreen && (
        <div className="fixed inset-0 z-[100] flex h-screen w-screen items-center justify-center bg-white p-4 sm:p-8">
          <button
            type="button"
            onClick={() => setIsFullScreen(false)}
            className="absolute right-6 top-6 z-[110] flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <X size={24} />
          </button>
          
          <div className="flex h-full w-full flex-col md:flex-row items-center gap-4 sm:gap-6 md:gap-12">
            {/* Thumbnails (Modal) */}
            <div className="flex w-full shrink-0 overflow-x-auto gap-3 py-2 md:h-full md:w-24 md:flex-col md:overflow-y-auto md:overflow-x-hidden md:py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {list.map((src, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`flex aspect-[3/4] h-20 md:h-auto md:w-full shrink-0 rounded-lg p-[3px] transition-all ${
                    active === i ? "border-[1.5px] border-secondary" : "border-[1.5px] border-transparent hover:border-gray-300"
                  }`}
                >
                  <div className="relative h-full w-full overflow-hidden rounded-md bg-light">
                    <Image src={src} alt={`${alt} ${i + 1}`} fill sizes="96px" className="object-cover" />
                  </div>
                </button>
              ))}
            </div>

            {/* Main Image (Modal) */}
            <div className="relative flex-1 h-full w-full overflow-hidden bg-transparent flex items-center justify-center">
              <Image
                src={list[active]}
                alt={alt}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
