import { Heart, ShoppingBag, Sparkles, Zap } from "lucide-react";

interface AppPromoProps {
  title: string;
  subtitle?: string;
  ctaLabel?: string;
}

/** "Try our app yet?" — banner with feature icons. */
export default function AppPromo({ title, subtitle, ctaLabel }: AppPromoProps) {
  const icons = [Zap, Heart, ShoppingBag, Sparkles];
  return (
    <section className="overflow-hidden rounded-2xl bg-light">
      <div className="flex flex-col items-center gap-6 p-8 md:flex-row md:justify-between md:p-10">
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-bold text-secondary">{title}</h3>
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
          {ctaLabel && (
            <button className="mt-4 rounded-full bg-secondary px-6 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105">
              {ctaLabel}
            </button>
          )}
        </div>
        <div className="flex items-center gap-4">
          {icons.map((Icon, i) => (
            <div
              key={i}
              className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm"
            >
              <Icon className="text-primary" size={22} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
