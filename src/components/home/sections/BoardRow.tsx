"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import SectionHeader from "../common/SectionHeader";
import { BoardItem } from "../common/homeTypes";

interface BoardRowProps {
  title: string;
  subtitle?: string;
  boards: BoardItem[];
}

/** "Explore boards" — round inspiration cards in a horizontal slider. */
export default function BoardRow({ title, subtitle, boards }: BoardRowProps) {
  const ref = useRef<HTMLDivElement>(null);
  const scrollBy = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * 600, behavior: "smooth" });

  return (
    <section>
      <SectionHeader title={title} subtitle={subtitle} />
      <div className="relative">
        <div
          ref={ref}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x"
        >
          {boards.map((b) => (
            <Link
              key={b.id}
              href={b.href ?? "#"}
              className="group shrink-0 snap-start text-center"
            >
              <div className="relative h-52 w-40 overflow-hidden rounded-3xl bg-light sm:h-64 sm:w-52">
                <Image
                  src={b.image}
                  alt={b.title}
                  fill
                  sizes="208px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <p className="mt-2 w-40 truncate text-sm font-semibold text-secondary sm:w-52">
                {b.title}
              </p>
            </Link>
          ))}
        </div>

        <button
          type="button"
          onClick={() => scrollBy(-1)}
          aria-label="previous"
          className="absolute -left-3 top-26 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md hover:bg-light sm:top-32 md:flex"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          onClick={() => scrollBy(1)}
          aria-label="next"
          className="absolute -right-3 top-26 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md hover:bg-light sm:top-32 md:flex"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
}
