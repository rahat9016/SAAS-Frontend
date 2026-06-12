"use client";

import { GENDERS, useGender } from "./GenderContext";

/** Women / Men / Kids parent-category pills (drive the category nav). */
export default function GenderTabs() {
  const { gender, setGender } = useGender();
  return (
    <div className="flex items-center gap-1.5">
      {GENDERS.map((tab) => {
        const on = gender === tab;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => setGender(tab)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors cursor-pointer ${
              on ? "bg-secondary text-white" : "text-secondary hover:bg-gray-100"
            }`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
