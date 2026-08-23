"use client";

import { cn } from "@/src/lib/utils";
import {
  Camera,
  ChevronDown,
  ImageDown,
  ImagePlus,
  ImageUp,
  ImageMinus,
  RefreshCw,
  Tag,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";
import ColorwaysTab from "./ColorwaysTab";

interface ArticleDetailViewProps {
  seasonId: string;
  departmentId: string;
  categoryId: string;
  articleId: string;
}

const seasonNames: Record<string, string> = {
  "0000-dummy": "0000 Dummy",
  "786-summer": "786 NOOS/Summer",
  "786-winter": "786 NOOS/Winter",
  "2027-main": "2027 Main Collection",
  "2028-main": "2028 Main Collection",
};

const deptNames: Record<string, string> = {
  women: "Women",
  men: "Men",
  kids: "Kids",
  home: "Home",
  specials: "Specials",
  gifts: "Gifts",
};

const catNames: Record<string, string> = {
  "t-shirts": "T-Shirt",
  shirts: "Shirts",
  blouses: "Blouses",
  sweatshirts: "Sweatshirts",
};

const MAIN_TABS = ["Style", "Sourcing", "Specification"];
const SUB_TABS = [
  "Properties",
  "Colorways",
  "Samples",
  "SKUs",
  "Documents",
  "Issues",
];

const TOOLBAR_ICONS = [
  { icon: Camera, label: "Capture image" },
  { icon: ImagePlus, label: "Approve image" },
  { icon: ImageDown, label: "Import image" },
  { icon: ImageUp, label: "Export image" },
  { icon: ImageMinus, label: "Remove image" },
];

const ACTION_BUTTONS = [
  "Promote",
  "Demote",
  "Cancel",
  "Re-activate",
  "Transfer",
  "Approve",
];

interface MarketingRow {
  label: string;
  value: string;
  /** Render the value in the green "affirmative" style. */
  highlight?: boolean;
}

const FABRIC_ROWS: MarketingRow[] = [
  { label: "Fabric Description", value: "Single Jersey, 100% BCI" },
  { label: "Fabric Composition", value: "80% Cotton, 20% Polyester" },
  { label: "Handfeel", value: "Soft & Premium Touch" },
  { label: "Fabric Stability", value: "High Durability & Preshrunk" },
];

const CARE_INSTRUCTIONS = [
  "Iron at moderate temperature",
  "Do not Bleach",
  "Do not dry-Clean",
  "30° mild fine wash",
  "Mild Drying Processes",
  "Pull into shape after washing",
  "Wash and Iron inside out",
  "Wash with similar Colors",
];

const DETAIL_QUESTIONS = [
  "Why this design is created?",
  "Why you will buy this style?",
  "Where you can wear this T-shirt?",
  "How much comfortability will you experience during wear?",
  "what is the most interesting info of this style?",
];

const MARKETING_ROWS: MarketingRow[] = [
  { label: "Variations of this style", value: "212633, 212634, 212635, 212636" },
  { label: "Better Together", value: "212730, 212741, 212745, 212640" },
  { label: "Recommendations", value: "213232, 213234, 213235, 213236" },
  { label: "Custom-Teamwear", value: "Clubs & Organisations" },
  { label: "Rent-a-Dress", value: "Everyday, Vacations" },
  { label: "PPR", value: "0.10", highlight: true },
  { label: "Golden-Draw", value: "Yes" },
  { label: "Promotional Header", value: "Summer Deals" },
];

interface PropertyRow {
  label: string;
  value: string;
  /** Render the value in the green "affirmative" style. */
  highlight?: boolean;
}

export default function ArticleDetailView({
  seasonId,
  departmentId,
  categoryId,
  articleId,
}: ArticleDetailViewProps) {
  const seasonName = seasonNames[seasonId] || "2027 Main Collection";
  const deptName = deptNames[departmentId] || "Men";
  const categoryName = catNames[categoryId] || "T-Shirt";

  const [activeMainTab, setActiveMainTab] = useState("Style");
  const [activeSubTab, setActiveSubTab] = useState("Properties");
  const [selectedImage, setSelectedImage] = useState(0);

  const handleAction = (btn: string) => {
    toast.success(`Action executed: ${btn} for Style #${articleId}`);
  };

  const productImages = [
    {
      src: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80",
      label: "Technical Drawing - Front/Back (CW5978 / CW0120)",
    },
    {
      src: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=600&q=80",
      label: "White Mockup Flatlay",
    },
    {
      src: "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=600&q=80",
      label: "Navy & White Colorway Set",
    },
  ];

  // Left "Article" column of the property grid.
  const articleRows: PropertyRow[] = [
    { label: "Article", value: articleId },
    { label: "Promote Status", value: "Concept", highlight: true },
    { label: "Collection", value: seasonName },
    { label: "Promotional Month", value: "January" },
    { label: "Time schedule", value: "-" },
    { label: "Category", value: categoryName },
    { label: "Department", value: deptName },
    { label: "Fit", value: "Slim" },
    { label: "Special Comment", value: "-" },
    { label: "General Comment", value: "-" },
    { label: "Active colorways", value: "2" },
    { label: "Size Chart Template", value: "Standard Menswear" },
    { label: "Size Range", value: "Letter Size" },
    { label: "Sizes", value: "S, M, L, XL" },
    { label: "Proto Quantity", value: "10" },
    { label: "SMS Quantity", value: "5" },
  ];

  // Right "Assigned Branch" column of the property grid.
  const branchRows: PropertyRow[] = [
    { label: "Assigned Branch", value: "Dhaka" },
    { label: "Supplier", value: "Square" },
    { label: "Copied From", value: "-" },
    { label: "Active", value: "Yes", highlight: true },
    { label: "Cancellation Reason", value: "-" },
    { label: "Data Locked", value: "Yes", highlight: true },
    { label: "Auto Proto Request", value: "Yes", highlight: true },
    { label: "Auto SMS Request", value: "Yes", highlight: true },
    { label: "Auto FFP Request", value: "Yes", highlight: true },
    { label: "Packing Code", value: "EI" },
    { label: "Packing Comment", value: "-" },
    { label: "Transport Mode", value: "L" },
    { label: "Sustainability", value: "Re-cycled" },
    { label: "FOB", value: "150BDT" },
    { label: "Retail Price", value: "14.99€" },
    { label: "Virtual Trial", value: "Yes", highlight: true },
  ];

  const rowCount = Math.max(articleRows.length, branchRows.length);

  const renderCells = (row: PropertyRow | undefined, isLast: boolean) => {
    if (!row) {
      return (
        <>
          <td className="py-1.5 px-3 bg-emerald-50 border-r border-emerald-200" />
          <td className={cn("py-1.5 px-3", !isLast && "border-r border-emerald-200")} />
        </>
      );
    }
    return (
      <>
        <td className="py-1.5 px-3 font-bold text-emerald-900 bg-emerald-50 border-r border-emerald-200 w-1/4">
          {row.label}
        </td>
        <td
          className={cn(
            "py-1.5 px-3 w-1/4",
            !isLast && "border-r border-emerald-200",
            row.highlight && "font-semibold text-emerald-700"
          )}
        >
          {row.value}
        </td>
      </>
    );
  };

  return (
    <div className="w-full space-y-4">
      {/* Top Header Bar matching Image */}
      <div className="bg-[#ffeac7] p-2 border-[3px] border-[#fdc276] rounded-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="font-extrabold text-lg text-black tracking-wider flex items-center gap-1.5">
            <span className="text-xl">🦊</span> FAMILIE MUNSHI
          </div>
          <div className="flex items-center border border-gray-300 rounded-sm overflow-hidden bg-white shadow-sm">
            <span className="bg-[#8ee59d] text-gray-900 font-semibold px-2 py-1.5 text-sm flex items-center gap-1 border-r border-gray-300 cursor-pointer">
              Style ▼
            </span>
            <input
              type="text"
              defaultValue={articleId}
              className="px-3 py-1 text-sm font-semibold w-28 text-gray-800 outline-none"
            />
          </div>
        </div>

        <div className="text-sm font-medium text-gray-800 pr-2">
          Product Developement
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="text-sm text-gray-600 font-medium">
        <Link href="/admin/styles" className="hover:underline">Style</Link> &gt;{" "}
        <Link href={`/admin/styles/${seasonId}`} className="hover:underline">{seasonName}</Link> &gt;{" "}
        <Link href={`/admin/styles/${seasonId}/${departmentId}`} className="hover:underline">{deptName}</Link> &gt;{" "}
        <Link href={`/admin/styles/${seasonId}/${departmentId}/${categoryId}`} className="hover:underline">{categoryName}</Link> &gt;{" "}
        <span className="text-gray-900">{articleId}</span>
      </div>

      {/* Main Tabs (Style | Sourcing | Specification) */}
      <div className="flex gap-4 border-b border-[#ffeac7] pb-1">
        {MAIN_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveMainTab(tab)}
            className={cn(
              "text-base font-semibold text-[#2eb85c] transition-colors",
              activeMainTab === tab && "underline underline-offset-4"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Sub Tabs */}
      <div className="flex gap-4 text-sm font-semibold border-b border-[#ffeac7]">
        {SUB_TABS.map((subTab) => (
          <button
            key={subTab}
            onClick={() => setActiveSubTab(subTab)}
            className={cn(
              "pb-1 px-1 text-[#2eb85c] transition-colors",
              activeSubTab === subTab && "border-b-[3px] border-[#2eb85c]"
            )}
          >
            {subTab}
          </button>
        ))}
      </div>

      {/* Toolbar + workflow actions */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {TOOLBAR_ICONS.map(({ icon: Icon, label }) => (
            <button
              key={label}
              type="button"
              title={label}
              aria-label={label}
              onClick={() => handleAction(label)}
              className="h-9 w-9 flex items-center justify-center rounded border border-gray-300 bg-gray-50 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
            >
              <Icon className="h-4.5 w-4.5" />
            </button>
          ))}

          <button
            type="button"
            title="Tag"
            aria-label="Tag"
            onClick={() => handleAction("Tag")}
            className="h-9 flex items-center gap-1 px-2 rounded border border-gray-300 bg-gray-50 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
          >
            <Tag className="h-4.5 w-4.5" />
            <ChevronDown className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            title="Refresh"
            aria-label="Refresh"
            onClick={() => handleAction("Refresh")}
            className="h-9 w-9 flex items-center justify-center rounded border border-gray-300 bg-gray-50 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
          >
            <RefreshCw className="h-4.5 w-4.5" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {ACTION_BUTTONS.map((btn) => (
            <button
              key={btn}
              type="button"
              onClick={() => handleAction(btn)}
              className="h-9 px-3 rounded border border-orange-400 bg-white text-sm font-medium text-gray-800 transition-colors hover:bg-orange-50 cursor-pointer"
            >
              {btn}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area Conditional Rendering */}
      {activeSubTab === "Properties" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Technical Sketches & Preview */}
        <div className="lg:col-span-5 lg:self-start lg:sticky lg:top-4 bg-white p-3 border border-gray-200 rounded-xl shadow-sm space-y-3">
          <div className="relative w-full h-56 bg-gray-50 border border-gray-200 rounded-lg overflow-hidden flex items-center justify-center p-2">
            <Image
              src={productImages[selectedImage].src}
              alt={productImages[selectedImage].label}
              fill
              className="object-contain p-2"
            />
            <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded backdrop-blur-xs font-mono">
              CW5978 / CW0120
            </div>
          </div>

          {/* Thumbnails */}
          <div className="grid grid-cols-3 gap-2">
            {productImages.map((img, idx) => (
              <button
                key={img.src}
                onClick={() => setSelectedImage(idx)}
                className={cn(
                  "relative h-16 rounded border-2 overflow-hidden transition-all",
                  selectedImage === idx
                    ? "border-emerald-600 shadow-md"
                    : "border-gray-200 hover:border-gray-400"
                )}
              >
                <Image src={img.src} alt={img.label} fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Properties & Marketing Info */}
        <div className="lg:col-span-7 space-y-6">
          {/* Article / Assigned Branch property grid */}
          <div className="bg-white border border-emerald-600 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-xs text-left border-collapse">
              <tbody>
                {Array.from({ length: rowCount }).map((_, idx) => (
                  <tr
                    key={articleRows[idx]?.label ?? branchRows[idx]?.label ?? idx}
                    className={cn(idx < rowCount - 1 && "border-b border-emerald-200")}
                  >
                    {renderCells(articleRows[idx], false)}
                    {renderCells(branchRows[idx], true)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Marketing Info */}
          <div className="bg-white border-2 border-orange-400 rounded-sm overflow-hidden shadow-sm">
            <h3 className="bg-[#fdf7dc] border-b-2 border-orange-400 px-3 py-2 text-lg font-bold text-gray-900">
              Marketing Info
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 text-xs">
              {/* Left Column: fabric facts, care instructions, details */}
              <div className="border-b border-orange-300 md:border-b-0 md:border-r-2 md:border-orange-400">
                {FABRIC_ROWS.map((row) => (
                  <div
                    key={row.label}
                    className="flex min-h-11 border-b border-orange-300"
                  >
                    <span className="w-1/2 flex items-center px-3 py-2 font-bold text-gray-900 border-r border-orange-300">
                      {row.label}
                    </span>
                    <span className="w-1/2 flex items-center px-3 py-2 text-gray-700">
                      {row.value}
                    </span>
                  </div>
                ))}

                <div className="border-b border-orange-300 px-3 py-2">
                  <p className="font-bold text-gray-900">Care Instructions:</p>
                  <ul className="mt-1 space-y-0.5 pl-6 text-gray-600">
                    {CARE_INSTRUCTIONS.map((care) => (
                      <li key={care}>&gt; {care}</li>
                    ))}
                  </ul>
                </div>

                <div className="px-3 py-2">
                  <p className="text-sm font-bold text-gray-900">Details:</p>
                  <ol className="mt-1 list-decimal space-y-1 pl-5 text-gray-700">
                    {DETAIL_QUESTIONS.map((question) => (
                      <li key={question}>{question}</li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Right Column: linked styles, pricing signals, care label print */}
              <div>
                {MARKETING_ROWS.map((row) => (
                  <div
                    key={row.label}
                    className="flex min-h-11 border-b border-orange-300"
                  >
                    <span className="w-1/2 flex items-center px-3 py-2 font-bold text-gray-900 border-r border-orange-300">
                      {row.label}
                    </span>
                    <span
                      className={cn(
                        "w-1/2 flex items-center px-3 py-2 text-gray-700",
                        row.highlight && "font-bold text-emerald-600"
                      )}
                    >
                      {row.value}
                    </span>
                  </div>
                ))}

                <div className="px-3 py-2">
                  <p className="font-bold text-gray-900">Print on Care Label</p>
                  <div className="mt-2 space-y-3 pl-3">
                    <div className="flex">
                      <span className="w-24 shrink-0 font-semibold text-gray-900">
                        Designed in
                      </span>
                      <span className="text-gray-700">Germany</span>
                    </div>
                    <div className="flex">
                      <span className="w-24 shrink-0 font-semibold text-gray-900">
                        Address
                      </span>
                      <div className="space-y-0.5 text-gray-700">
                        <p>Familie Munshi</p>
                        <p className="pt-2">Familie Munshi UG</p>
                        <p>Robert Dißmann str.10</p>
                        <p>65936, Frankfurt, Germany</p>
                        <p>info@familiemunshi.de</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      )}

      {activeSubTab === "Colorways" && <ColorwaysTab />}
    </div>
  );
}
