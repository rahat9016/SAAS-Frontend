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
              <div className="relative h-28 w-28 overflow-hidden rounded-full bg-light sm:h-32 sm:w-32">
                <Image
                  src={b.image}
                  alt={b.title}
                  fill
                  sizes="128px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <p className="mt-2 w-28 truncate text-xs font-semibold text-secondary sm:w-32">
                {b.title}
              </p>
            </Link>
          ))}
        </div>

        <button
          type="button"
          onClick={() => scrollBy(-1)}
          aria-label="previous"
          className="absolute -left-3 top-[30%] hidden h-9 w-9 items-center justify-center rounded-full bg-white shadow-md hover:bg-light md:flex"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          onClick={() => scrollBy(1)}
          aria-label="next"
          className="absolute -right-3 top-[30%] hidden h-9 w-9 items-center justify-center rounded-full bg-white shadow-md hover:bg-light md:flex"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
}
