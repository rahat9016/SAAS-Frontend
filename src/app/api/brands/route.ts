import { NextResponse } from "next/server";

const brands = [
  {
    id: "br-1",
    title: "TecGen Cement",
    description: "Premium quality construction cement",
    isActive: true,
    logo: "/icons/Specialities.svg",
    createdAt: "2026-01-10",
  },
  {
    id: "br-2",
    title: "AquaShield Paints",
    description: "Weather-resistant exterior and interior paints",
    isActive: true,
    logo: "/icons/HealthPackages.svg",
    createdAt: "2026-01-25",
  },
  {
    id: "br-3",
    title: "SteelPro Rods",
    description: "High-tensile steel rods for construction",
    isActive: false,
    createdAt: "2026-02-08",
  },
  {
    id: "br-4",
    title: "ChemBond Admixture",
    description: "Advanced concrete admixture solutions",
    isActive: true,
    createdAt: "2026-02-20",
  },
];

export async function GET() {
  await new Promise((res) => setTimeout(res, 600));
  return NextResponse.json({ data: brands });
}
