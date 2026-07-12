import Image from "next/image";
import Link from "next/link";
import SectionCta from "../common/SectionCta";
import SectionHeader from "../common/SectionHeader";
import { BoardItem } from "../common/homeTypes";

interface OutfitInspirationProps {
  title: string;
  subtitle?: string;
  looks: BoardItem[];
}

/** "Snap their style" — tall lifestyle look cards. */
export default function OutfitInspiration({ title, subtitle, looks }: OutfitInspirationProps) {
  return (
    <section>
      <SectionHeader title={title} subtitle={subtitle} />
      <SectionCta label="View all" />
      <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x">
        {looks.map((l) => (
          <Link
            key={l.id}
            href={l.href ?? "#"}
            className="group relative aspect-[9/16] w-[200px] shrink-0 snap-start overflow-hidden rounded-xl bg-light sm:w-[240px]"
          >
            <Image
              src={l.image}
              alt={l.title}
              fill
              sizes="240px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <p className="absolute bottom-3 left-3 text-sm font-semibold text-white">
              {l.title}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
