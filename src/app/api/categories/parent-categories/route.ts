import { NextResponse } from "next/server";

const parentCategories = [
  { id: "pc-1", name: "Building Materials", description: "Cement, steel, and construction essentials", icon: "/icons/Specialities.svg", createdAt: "2026-01-15" },
  { id: "pc-2", name: "Paints & Coatings", description: "Interior, exterior, and specialty paints", icon: "/icons/HealthPackages.svg", createdAt: "2026-01-20" },
  { id: "pc-3", name: "Chemicals", description: "Admixture and industrial chemicals", createdAt: "2026-02-05" },
  { id: "pc-4", name: "Hardware", description: "Tools, fittings, and accessories", createdAt: "2026-02-18" },
];

export async function GET() {
  await new Promise((res) => setTimeout(res, 600));
  return NextResponse.json({ data: parentCategories });
}
