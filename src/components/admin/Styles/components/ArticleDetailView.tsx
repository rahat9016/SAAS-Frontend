"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";

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

  return (
    <div className="w-full space-y-4">
      {/* Top Header Bar matching Image 5 */}
      <div className="bg-white p-3 border-2 border-orange-400 rounded-lg flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="font-extrabold text-lg text-amber-800 tracking-wider flex items-center gap-1.5">
            <span className="text-xl">🦊</span> FAMILIE MUNSHI
          </div>
          <div className="flex items-center border border-orange-400 rounded overflow-hidden">
            <span className="bg-emerald-500 text-white font-bold px-3 py-1 text-sm flex items-center gap-1">
              Style ▼
            </span>
            <input
              type="text"
              defaultValue={articleId}
              className="px-3 py-1 text-sm font-semibold w-28 text-gray-800 outline-none"
            />
          </div>
        </div>

        <div className="text-sm font-bold text-gray-600 tracking-wide bg-gray-100 px-3 py-1 rounded">
          Product Development
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
      <div className="flex gap-4 border-b border-gray-200">
        {["Style", "Sourcing", "Specification"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveMainTab(tab)}
            className={`pb-2 px-2 text-base font-semibold transition-colors ${
              activeMainTab === tab
                ? "text-emerald-600 border-b-2 border-emerald-600"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Sub Tabs + Action Buttons Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2 border border-gray-200 rounded-lg shadow-sm">
        <div className="flex gap-4 text-sm font-medium">
          {["Properties", "Colorways", "Samples", "SKUs", "Documents", "Issues"].map((subTab) => (
            <button
              key={subTab}
              onClick={() => setActiveSubTab(subTab)}
              className={`${
                activeSubTab === subTab
                  ? "text-emerald-600 font-bold underline"
                  : "text-emerald-800 hover:text-emerald-950"
              }`}
            >
              {subTab}
            </button>
          ))}
        </div>

        {/* Action Buttons (Promote | Demote | Cancel | Re-activate | Transfer | Approve) */}
        <div className="flex flex-wrap items-center gap-1.5">
          {["Promote", "Demote", "Cancel", "Re-activate", "Transfer", "Approve"].map((btn) => (
            <button
              key={btn}
              onClick={() => handleAction(btn)}
              className="px-3 py-1 text-xs font-bold border border-orange-400 text-orange-900 bg-orange-50 hover:bg-orange-100 rounded transition-colors shadow-xs"
            >
              {btn}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Layout: Left (Images) & Right (Properties + Marketing Info) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Technical Sketches & Preview */}
        <div className="lg:col-span-5 bg-white p-4 border border-gray-200 rounded-xl shadow-sm space-y-4">
          <div className="relative w-full h-80 bg-gray-50 border border-gray-200 rounded-lg overflow-hidden flex items-center justify-center p-2">
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
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`relative h-20 rounded border-2 overflow-hidden transition-all ${
                  selectedImage === idx ? "border-emerald-600 shadow-md" : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <Image src={img.src} alt={img.label} fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Properties & Marketing Info */}
        <div className="lg:col-span-7 space-y-6">
          {/* Article Property Grid matching Image 5 green/white table */}
          <div className="bg-white border border-emerald-600 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-xs text-left border-collapse">
              <tbody>
                <tr className="border-b border-emerald-200">
                  <td className="py-1.5 px-3 font-bold text-emerald-900 bg-emerald-50 border-r border-emerald-200 w-1/3">Article</td>
                  <td className="py-1.5 px-3 border-r border-emerald-200 w-1/6 font-semibold">{articleId}</td>
                  <td className="py-1.5 px-3 font-bold text-emerald-900 bg-emerald-50 border-r border-emerald-200 w-1/3">Assigned Branch</td>
                  <td className="py-1.5 px-3">Dhaka</td>
                </tr>
                <tr className="border-b border-emerald-200">
                  <td className="py-1.5 px-3 font-bold text-emerald-900 bg-emerald-50 border-r border-emerald-200">Promote Status</td>
                  <td className="py-1.5 px-3 border-r border-emerald-200 text-emerald-700 font-bold">Concept</td>
                  <td className="py-1.5 px-3 font-bold text-emerald-900 bg-emerald-50 border-r border-emerald-200">Supplier</td>
                  <td className="py-1.5 px-3">Square</td>
                </tr>
                <tr className="border-b border-emerald-200">
                  <td className="py-1.5 px-3 font-bold text-emerald-900 bg-emerald-50 border-r border-emerald-200">Collection</td>
                  <td className="py-1.5 px-3 border-r border-emerald-200">{seasonName}</td>
                  <td className="py-1.5 px-3 font-bold text-emerald-900 bg-emerald-50 border-r border-emerald-200">Copied From</td>
                  <td className="py-1.5 px-3">-</td>
                </tr>
                <tr className="border-b border-emerald-200">
                  <td className="py-1.5 px-3 font-bold text-emerald-900 bg-emerald-50 border-r border-emerald-200">Promotional Month</td>
                  <td className="py-1.5 px-3 border-r border-emerald-200">January</td>
                  <td className="py-1.5 px-3 font-bold text-emerald-900 bg-emerald-50 border-r border-emerald-200">Active</td>
                  <td className="py-1.5 px-3 font-semibold text-emerald-700">Yes</td>
                </tr>
                <tr className="border-b border-emerald-200">
                  <td className="py-1.5 px-3 font-bold text-emerald-900 bg-emerald-50 border-r border-emerald-200">Time schedule</td>
                  <td className="py-1.5 px-3 border-r border-emerald-200">-</td>
                  <td className="py-1.5 px-3 font-bold text-emerald-900 bg-emerald-50 border-r border-emerald-200">Cancellation Reason</td>
                  <td className="py-1.5 px-3">-</td>
                </tr>
                <tr className="border-b border-emerald-200">
                  <td className="py-1.5 px-3 font-bold text-emerald-900 bg-emerald-50 border-r border-emerald-200">Category</td>
                  <td className="py-1.5 px-3 border-r border-emerald-200">{categoryName}</td>
                  <td className="py-1.5 px-3 font-bold text-emerald-900 bg-emerald-50 border-r border-emerald-200">Data Locked</td>
                  <td className="py-1.5 px-3 font-semibold text-emerald-700">Yes</td>
                </tr>
                <tr className="border-b border-emerald-200">
                  <td className="py-1.5 px-3 font-bold text-emerald-900 bg-emerald-50 border-r border-emerald-200">Department</td>
                  <td className="py-1.5 px-3 border-r border-emerald-200">{deptName}</td>
                  <td className="py-1.5 px-3 font-bold text-emerald-900 bg-emerald-50 border-r border-emerald-200">Auto Proto Request</td>
                  <td className="py-1.5 px-3 text-emerald-700 font-semibold">Yes</td>
                </tr>
                <tr className="border-b border-emerald-200">
                  <td className="py-1.5 px-3 font-bold text-emerald-900 bg-emerald-50 border-r border-emerald-200">Fit</td>
                  <td className="py-1.5 px-3 border-r border-emerald-200">Slim</td>
                  <td className="py-1.5 px-3 font-bold text-emerald-900 bg-emerald-50 border-r border-emerald-200">Auto SMS Request</td>
                  <td className="py-1.5 px-3 text-emerald-700 font-semibold">Yes</td>
                </tr>
                <tr className="border-b border-emerald-200">
                  <td className="py-1.5 px-3 font-bold text-emerald-900 bg-emerald-50 border-r border-emerald-200">Special Comment</td>
                  <td className="py-1.5 px-3 border-r border-emerald-200">-</td>
                  <td className="py-1.5 px-3 font-bold text-emerald-900 bg-emerald-50 border-r border-emerald-200">Auto FFP Request</td>
                  <td className="py-1.5 px-3 text-emerald-700 font-semibold">Yes</td>
                </tr>
                <tr className="border-b border-emerald-200">
                  <td className="py-1.5 px-3 font-bold text-emerald-900 bg-emerald-50 border-r border-emerald-200">General Comment</td>
                  <td className="py-1.5 px-3 border-r border-emerald-200">-</td>
                  <td className="py-1.5 px-3 font-bold text-emerald-900 bg-emerald-50 border-r border-emerald-200">Packing Code</td>
                  <td className="py-1.5 px-3">EI</td>
                </tr>
                <tr className="border-b border-emerald-200">
                  <td className="py-1.5 px-3 font-bold text-emerald-900 bg-emerald-50 border-r border-emerald-200">Active colorways</td>
                  <td className="py-1.5 px-3 border-r border-emerald-200">2</td>
                  <td className="py-1.5 px-3 font-bold text-emerald-900 bg-emerald-50 border-r border-emerald-200">Transport Mode</td>
                  <td className="py-1.5 px-3">L</td>
                </tr>
                <tr className="border-b border-emerald-200">
                  <td className="py-1.5 px-3 font-bold text-emerald-900 bg-emerald-50 border-r border-emerald-200">Size Chart Template</td>
                  <td className="py-1.5 px-3 border-r border-emerald-200">Standard Menswear</td>
                  <td className="py-1.5 px-3 font-bold text-emerald-900 bg-emerald-50 border-r border-emerald-200">Sustainability</td>
                  <td className="py-1.5 px-3">Re-cycled</td>
                </tr>
                <tr className="border-b border-emerald-200">
                  <td className="py-1.5 px-3 font-bold text-emerald-900 bg-emerald-50 border-r border-emerald-200">Size Range</td>
                  <td className="py-1.5 px-3 border-r border-emerald-200">Letter Size</td>
                  <td className="py-1.5 px-3 font-bold text-emerald-900 bg-emerald-50 border-r border-emerald-200">FOB</td>
                  <td className="py-1.5 px-3 font-semibold">150BDT</td>
                </tr>
                <tr className="border-b border-emerald-200">
                  <td className="py-1.5 px-3 font-bold text-emerald-900 bg-emerald-50 border-r border-emerald-200">Sizes</td>
                  <td className="py-1.5 px-3 border-r border-emerald-200">S, M, L, XL</td>
                  <td className="py-1.5 px-3 font-bold text-emerald-900 bg-emerald-50 border-r border-emerald-200">Retail Price</td>
                  <td className="py-1.5 px-3 font-semibold">14.99€</td>
                </tr>
                <tr>
                  <td className="py-1.5 px-3 font-bold text-emerald-900 bg-emerald-50 border-r border-emerald-200">Proto Quantity / SMS</td>
                  <td className="py-1.5 px-3 border-r border-emerald-200">10 / 5</td>
                  <td className="py-1.5 px-3 font-bold text-emerald-900 bg-emerald-50 border-r border-emerald-200">Virtual Trial</td>
                  <td className="py-1.5 px-3 text-emerald-700 font-semibold">Yes</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Marketing Info Block matching Image 5 orange container */}
          <div className="bg-white border-2 border-orange-400 rounded-xl overflow-hidden shadow-sm p-4 space-y-4">
            <h3 className="text-base font-bold text-gray-900 border-b border-orange-200 pb-2">
              Marketing Info
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Left Column */}
              <div className="space-y-3">
                <div className="flex border-b border-gray-100 pb-1.5">
                  <span className="font-bold text-gray-800 w-1/2">Fabric Description</span>
                  <span className="text-gray-700 w-1/2">Single Jersey, 100% BCI</span>
                </div>
                <div className="flex border-b border-gray-100 pb-1.5">
                  <span className="font-bold text-gray-800 w-1/2">Fabric Composition</span>
                  <span className="text-gray-700 w-1/2">80% Cotton, 20% Polyester</span>
                </div>
                <div className="flex border-b border-gray-100 pb-1.5">
                  <span className="font-bold text-gray-800 w-1/2">Handfeel</span>
                  <span className="text-gray-700 w-1/2">Soft & Premium Touch</span>
                </div>
                <div className="flex border-b border-gray-100 pb-1.5">
                  <span className="font-bold text-gray-800 w-1/2">Fabric Stability</span>
                  <span className="text-gray-700 w-1/2">High Durability & Preshrunk</span>
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-gray-800 block">Care Instructions:</span>
                  <ul className="list-none space-y-0.5 text-gray-600 pl-1">
                    <li>&gt; Iron at moderate temperature</li>
                    <li>&gt; Do not Bleach</li>
                    <li>&gt; Do not dry-Clean</li>
                    <li>&gt; 30° mild fine wash</li>
                    <li>&gt; Mild Drying Processes</li>
                    <li>&gt; Pull into shape after washing</li>
                    <li>&gt; Wash and Iron inside out</li>
                    <li>&gt; Wash with similar Colors</li>
                  </ul>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-3">
                <div className="flex border-b border-gray-100 pb-1.5">
                  <span className="font-bold text-gray-800 w-1/2">Variations of this style</span>
                  <span className="text-blue-700 w-1/2 font-mono">212633, 212634, 212635, 212636</span>
                </div>
                <div className="flex border-b border-gray-100 pb-1.5">
                  <span className="font-bold text-gray-800 w-1/2">Better Together</span>
                  <span className="text-blue-700 w-1/2 font-mono">212730, 212741, 212745, 212640</span>
                </div>
                <div className="flex border-b border-gray-100 pb-1.5">
                  <span className="font-bold text-gray-800 w-1/2">Recommendations</span>
                  <span className="text-blue-700 w-1/2 font-mono">213232, 213234, 213235, 213236</span>
                </div>
                <div className="flex border-b border-gray-100 pb-1.5">
                  <span className="font-bold text-gray-800 w-1/2">Custom-Teamwear</span>
                  <span className="text-gray-700 w-1/2">Clubs &amp; Organisations</span>
                </div>
                <div className="flex border-b border-gray-100 pb-1.5">
                  <span className="font-bold text-gray-800 w-1/2">Rent-a-Dress</span>
                  <span className="text-gray-700 w-1/2">Everyday, Vacations</span>
                </div>
                <div className="flex border-b border-gray-100 pb-1.5">
                  <span className="font-bold text-gray-800 w-1/2">PPR</span>
                  <span className="text-emerald-700 font-bold w-1/2">0.10</span>
                </div>
                <div className="flex border-b border-gray-100 pb-1.5">
                  <span className="font-bold text-gray-800 w-1/2">Golden-Draw</span>
                  <span className="text-gray-700 w-1/2">Yes</span>
                </div>
                <div className="flex border-b border-gray-100 pb-1.5">
                  <span className="font-bold text-gray-800 w-1/2">Promotional Header</span>
                  <span className="text-gray-700 w-1/2">Summer Deals</span>
                </div>

                <div className="pt-2 border-t border-gray-200">
                  <span className="font-bold text-gray-900 block mb-1">Print on Care Label</span>
                  <div className="space-y-1 text-gray-600">
                    <p><span className="font-semibold text-gray-800">Designed in:</span> Germany</p>
                    <p><span className="font-semibold text-gray-800">Address:</span> Familie Munshi</p>
                    <p className="pl-14 text-xs text-gray-500">Familie Munshi UG<br />Robert Dißmann str.10</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
