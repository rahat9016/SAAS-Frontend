"use client";

import FilterDropdown from "./FilterDropdown";

const FILTERS: { label: string; options: string[] }[] = [
  { label: "Sort by", options: ["Recommended", "Newest", "Price: low to high", "Price: high to low", "Top rated"] },
  { label: "Size", options: ["XS", "S", "M", "L", "XL", "XXL"] },
  { label: "Campaigns", options: ["Sale", "New in", "Sustainable", "Exclusive"] },
  { label: "Price", options: ["Under €25", "€25 – €50", "€50 – €100", "€100+"] },
  { label: "Colour", options: ["Black", "White", "Blue", "Red", "Green", "Beige"] },
  { label: "Specialty sizes", options: ["Petite", "Tall", "Plus size", "Maternity"] },
  { label: "Multipack", options: ["Single", "2-pack", "3-pack", "5-pack"] },
  { label: "Fit", options: ["Regular", "Slim", "Relaxed", "Oversized"] },
];

/** Horizontal wrap of filter pills + "Show all filters". */
export default function FilterBar() {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {FILTERS.map((f) => (
        <FilterDropdown key={f.label} label={f.label} options={f.options} />
      ))}
    </div>
  );
}
