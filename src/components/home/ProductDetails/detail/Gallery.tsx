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
    <div className="flex flex-col-reverse md:flex-row gap-2 pt-0 md:pt-0">
      {/* Thumbnails */}
      <div className="flex w-full shrink-0 flex-row gap-1 overflow-x-auto py-1 md:py-0 md:w-32 lg:w-40 xl:w-44 md:max-h-[600px] md:flex-col md:overflow-x-hidden md:overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {list.map((src, i) => (
            <button
              key={i}
              type="button"
              onMouseEnter={() => setActive(i)}
              onClick={() => setActive(i)}
              className={`flex w-24 md:w-32 lg:w-40 xl:w-44 aspect-3/4 shrink-0 rounded-lg  transition-all ${
                active === i ? "border-[1.5px] border-secondary" : "border-[1.5px] border-transparent hover:border-gray-300"
              }`}
            >
              <div className="relative h-full w-full overflow-hidden rounded-md bg-light">
                <Image src={src} alt={`${alt} ${i + 1}`} fill sizes="(max-width: 768px) 80px, 128px" className="object-cover" />
              </div>
            </button>
          ))}
      </div>

      {/* Main image — fills the gallery column; zooms toward the cursor on hover */}
      <div
        className="relative aspect-4/5 md:aspect-3/4 flex-1 cursor-zoom-in overflow-hidden rounded-xl bg-light"
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
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-white p-2">
          <button
            type="button"
            onClick={() => setIsFullScreen(false)}
            className="absolute right-6 top-6 z-110 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <X size={24} />
          </button>
          
          <div className="flex h-full w-full flex-col-reverse md:flex-row items-center gap-2">
            {/* Thumbnails (Modal) */}
            <div className="flex w-full shrink-0 overflow-x-auto gap-3 pb-2 md:h-full md:w-32 lg:w-40 xl:w-44 md:flex-col md:overflow-y-auto md:overflow-x-hidden md:pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {list.map((src, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`flex aspect-3/4 h-20 md:h-auto md:w-full shrink-0 rounded-lg p-[3px] transition-all ${
                    active === i ? "border-[1.5px] border-secondary" : "border-[1.5px] border-transparent hover:border-gray-300"
                  }`}
                >
                  <div className="relative h-full w-full overflow-hidden rounded-md bg-light">
                    <Image src={src} alt={`${alt} ${i + 1}`} fill sizes="128px" className="object-cover" />
                  </div>
                </button>
              ))}
            </div>

            {/* Main Image (Modal) */}
            <div className="relative flex-1 h-full w-full overflow-hidden rounded-xl bg-transparent flex items-center justify-center">
              <Image
                src={list[active]}
                alt={alt}
                fill
                sizes="100vw"
                className="object-cover object-top"
                priority
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
