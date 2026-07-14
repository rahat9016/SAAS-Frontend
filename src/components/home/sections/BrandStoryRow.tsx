"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import SectionHeader from "../common/SectionHeader";
import { BrandStory } from "../common/homeTypes";

interface BrandStoryRowProps {
  title: string;
  subtitle?: string;
  stories: BrandStory[];
}

/** "Stores that inspire" — horizontal slider of brand story cards. */
export default function BrandStoryRow({ title, subtitle, stories }: BrandStoryRowProps) {
  const ref = useRef<HTMLDivElement>(null);
  const scrollBy = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * 600, behavior: "smooth" });

  return (
    <section>
      <SectionHeader title={title} subtitle={subtitle} />
      <div className="relative">
        <div
          ref={ref}
          className="grid grid-flow-col gap-3 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x auto-cols-[70%] sm:auto-cols-[45%] lg:auto-cols-[calc((100%-2.25rem)/4)]"
        >
          {stories.map((s) => (
            <Link
              key={s.id}
              href={s.href ?? "#"}
              className="group relative aspect-[3/4] snap-start overflow-hidden rounded-xl bg-light"
            >
              <Image
                src={s.image}
                alt={s.title}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                <p className="text-sm font-bold">{s.title}</p>
                {s.subtitle && <p className="text-[11px] opacity-90">{s.subtitle}</p>}
              </div>
            </Link>
          ))}
        </div>

        <button
          type="button"
          onClick={() => scrollBy(-1)}
          aria-label="previous"
          className="absolute -left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md hover:bg-light md:flex"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          onClick={() => scrollBy(1)}
          aria-label="next"
          className="absolute -right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md hover:bg-light md:flex"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
}
