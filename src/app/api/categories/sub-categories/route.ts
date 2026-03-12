import { NextResponse } from "next/server";

const subCategories = [
  { id: "sc-1", name: "OPC Cement", description: "Ordinary Portland Cement", categoryId: "c-1", categoryName: "Portland Cement", createdAt: "2026-01-17" },
  { id: "sc-2", name: "PPC Cement", description: "Portland Pozzolana Cement", categoryId: "c-1", categoryName: "Portland Cement", createdAt: "2026-01-18" },
  { id: "sc-3", name: "10mm TMT Rod", categoryId: "c-3", categoryName: "TMT Steel Rod", createdAt: "2026-01-19" },
  { id: "sc-4", name: "12mm TMT Rod", categoryId: "c-3", categoryName: "TMT Steel Rod", createdAt: "2026-01-20" },
  { id: "sc-5", name: "Exterior Shield", description: "Weather resistant exterior paint", categoryId: "c-4", categoryName: "Weather Shield Paint", createdAt: "2026-01-22" },
];

export async function GET() {
  await new Promise((res) => setTimeout(res, 600));
  return NextResponse.json({ data: subCategories });
}
