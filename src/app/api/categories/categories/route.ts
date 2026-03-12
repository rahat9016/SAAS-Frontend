import { NextResponse } from "next/server";

const categories = [
  { id: "c-1", name: "Portland Cement", parentCategoryId: "pc-1", parentCategoryName: "Building Materials", createdAt: "2026-01-16" },
  { id: "c-2", name: "Composite Cement", parentCategoryId: "pc-1", parentCategoryName: "Building Materials", createdAt: "2026-01-17" },
  { id: "c-3", name: "TMT Steel Rod", parentCategoryId: "pc-1", parentCategoryName: "Building Materials", createdAt: "2026-01-18" },
  { id: "c-4", name: "Weather Shield Paint", parentCategoryId: "pc-2", parentCategoryName: "Paints & Coatings", createdAt: "2026-01-21" },
  { id: "c-5", name: "Interior Emulsion", parentCategoryId: "pc-2", parentCategoryName: "Paints & Coatings", createdAt: "2026-01-22" },
  { id: "c-6", name: "Super Admixture", parentCategoryId: "pc-3", parentCategoryName: "Chemicals", createdAt: "2026-02-06" },
];

export async function GET() {
  await new Promise((res) => setTimeout(res, 600));
  return NextResponse.json({ data: categories });
}
