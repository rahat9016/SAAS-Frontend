"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import SectionHeader from "../common/SectionHeader";
import { BoardItem } from "../common/homeTypes";

interface OutfitInspirationProps {
  title: string;
  subtitle?: string;
  looks: BoardItem[];
}

/** "Snap their style" — tall lifestyle look cards in a horizontal carousel. */
export default function OutfitInspiration({ title, subtitle, looks }: OutfitInspirationProps) {
  const ref = useRef<HTMLDivElement>(null);
  const scrollBy = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * 600, behavior: "smooth" });

  return (
    <section>
      <SectionHeader title={title} subtitle={subtitle} />

      <div className="relative">
        <div
          ref={ref}
          className="grid grid-flow-col auto-cols-[70%] gap-3 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x sm:auto-cols-[45%] lg:auto-cols-[calc((100%-2.25rem)/4)]"
        >
          {looks.map((l) => (
            <Link
              key={l.id}
              href={l.href ?? "#"}
              className="group relative aspect-[9/16] snap-start overflow-hidden rounded-xl bg-light"
            >
              <Image
                src={l.image}
                alt={l.title}
                fill
                sizes="(max-width: 640px) 70vw, (max-width: 1024px) 45vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <p className="absolute bottom-3 left-3 text-sm font-semibold text-white">
                {l.title}
              </p>
            </Link>
          ))}
        </div>

        <button
          type="button"
          onClick={() => scrollBy(-1)}
          aria-label="previous"
          className="absolute left-1 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur hover:bg-light md:-left-3 md:bg-white"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          onClick={() => scrollBy(1)}
          aria-label="next"
          className="absolute right-1 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur hover:bg-light md:-right-3 md:bg-white"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
}
