interface PromoStripProps {
  text: string;
  highlight?: string;
  ctaLabel?: string;
}

/** Slim full-width promo bar (the orange strip). */
export default function PromoStrip({ text, highlight, ctaLabel }: PromoStripProps) {
  return (
    <div className="w-full bg-primary text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center text-xs sm:text-sm mt-2.5">
        <span className="font-semibold">{text}</span>
        {highlight && <span className="font-bold underline">{highlight}</span>}
        {ctaLabel && (
          <span className="ml-2 hidden rounded-full bg-white/20 px-3 py-0.5 font-semibold sm:inline">
            {ctaLabel}
          </span>
        )}
      </div>
    </div>
  );
}
