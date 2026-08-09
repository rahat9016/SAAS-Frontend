"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { mockArticlesListGrouped } from "../data/mockStyleData";
import { toast } from "react-toastify";

interface ArticlesTableProps {
  seasonId: string;
  departmentId: string;
  categoryId: string;
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

export default function ArticlesTable({
  seasonId,
  departmentId,
  categoryId,
}: ArticlesTableProps) {
  const seasonName = seasonNames[seasonId] || "2027 Main Collection";
  const deptName = deptNames[departmentId] || "Men";
  const categoryName = catNames[categoryId] || "T-Shirt";

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [modalAction, setModalAction] = useState<string | null>(null);

  const handleAction = (action: string) => {
    setIsDropdownOpen(false);
    setModalAction(action);
    toast.info(`Action triggered: ${action}`);
  };

  return (
    <div className="w-full space-y-4">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600 font-medium">
        <Link href="/admin/styles" className="hover:underline">Style</Link> &gt;{" "}
        <Link href={`/admin/styles/${seasonId}`} className="hover:underline">{seasonName}</Link> &gt;{" "}
        <Link href={`/admin/styles/${seasonId}/${departmentId}`} className="hover:underline">{deptName}</Link> &gt;{" "}
        <span className="text-gray-900">{categoryName}</span>
      </div>

      <div className="bg-white p-6 border border-gray-200 rounded-xl shadow-sm space-y-4">
        {/* Header & Dropdown Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900">Articles</h2>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              (ei tir chinno te click krle &quot;New From Style&quot; ar &quot;Move From&quot; ei dui ta option ashbe)
            </span>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-5 py-2.5 bg-orange-100 text-orange-800 border-2 border-orange-300 font-bold rounded-lg hover:bg-orange-200 transition-all shadow-sm text-base"
            >
              <Plus className="w-5 h-5 text-orange-700" />
              <span>New Article</span>
              <ChevronDown className="w-4 h-4 text-orange-700 ml-1" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-20 overflow-hidden">
                <button
                  onClick={() => handleAction("New From Style")}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-900 font-medium border-b border-gray-100 transition-colors"
                >
                  New From Style
                </button>
                <button
                  onClick={() => handleAction("Move From")}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-900 font-medium transition-colors"
                >
                  Move From
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Modal feedback notice if action selected */}
        {modalAction && (
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg flex items-center justify-between text-sm text-orange-800">
            <span>
              Opening workflow for: <strong>{modalAction}</strong>
            </span>
            <button
              onClick={() => setModalAction(null)}
              className="text-xs text-orange-600 underline font-semibold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Articles Table with Green Header & Month Groups */}
        <div className="overflow-x-auto border border-emerald-600 rounded-sm">
          <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
            <thead>
              <tr className="bg-[#60ab43] text-white font-bold border-b border-emerald-700">
                <th className="py-2.5 px-3 border-r border-emerald-500">Style</th>
                <th className="py-2.5 px-3 border-r border-emerald-500">Fit</th>
                <th className="py-2.5 px-3 border-r border-emerald-500">Image</th>
                <th className="py-2.5 px-3 border-r border-emerald-500">Month</th>
                <th className="py-2.5 px-3 border-r border-emerald-500">Retail Price</th>
                <th className="py-2.5 px-3 border-r border-emerald-500">FOB</th>
                <th className="py-2.5 px-3 border-r border-emerald-500">Active Color</th>
                <th className="py-2.5 px-3 border-r border-emerald-500">Size Range</th>
                <th className="py-2.5 px-3 border-r border-emerald-500">Fabric</th>
                <th className="py-2.5 px-3 border-r border-emerald-500">Fabric Description</th>
                <th className="py-2.5 px-3 border-r border-emerald-500">Composition</th>
                <th className="py-2.5 px-3 border-r border-emerald-500">Promote Status</th>
                <th className="py-2.5 px-3 border-r border-emerald-500">Assigned Branch</th>
                <th className="py-2.5 px-3 border-r border-emerald-500">Packing Code</th>
                <th className="py-2.5 px-3 border-r border-emerald-500">Transport Mode</th>
                <th className="py-2.5 px-3 border-r border-emerald-500">Supplier</th>
                <th className="py-2.5 px-3 border-r border-emerald-500">Ex Delivery</th>
                <th className="py-2.5 px-3">Sustainability</th>
              </tr>
              {/* Filter Row: All */}
              <tr className="bg-[#e4f5d9] font-medium text-emerald-950 border-b border-emerald-400">
                <td className="py-1.5 px-3 border-r border-emerald-300">All</td>
                <td className="py-1.5 px-3 border-r border-emerald-300">All</td>
                <td className="py-1.5 px-3 border-r border-emerald-300">All</td>
                <td className="py-1.5 px-3 border-r border-emerald-300">All</td>
                <td className="py-1.5 px-3 border-r border-emerald-300">All</td>
                <td className="py-1.5 px-3 border-r border-emerald-300">All</td>
                <td className="py-1.5 px-3 border-r border-emerald-300">All</td>
                <td className="py-1.5 px-3 border-r border-emerald-300">All</td>
                <td className="py-1.5 px-3 border-r border-emerald-300">All</td>
                <td className="py-1.5 px-3 border-r border-emerald-300">All</td>
                <td className="py-1.5 px-3 border-r border-emerald-300">All</td>
                <td className="py-1.5 px-3 border-r border-emerald-300">All</td>
                <td className="py-1.5 px-3 border-r border-emerald-300">All</td>
                <td className="py-1.5 px-3 border-r border-emerald-300">All</td>
                <td className="py-1.5 px-3 border-r border-emerald-300">All</td>
                <td className="py-1.5 px-3 border-r border-emerald-300">All</td>
                <td className="py-1.5 px-3 border-r border-emerald-300">All</td>
                <td className="py-1.5 px-3">All</td>
              </tr>
            </thead>
            <tbody>
              {mockArticlesListGrouped.map((group) => (
                <tr key={group.month} className="contents">
                  {/* Group Row Header */}
                  <tr className="bg-white font-bold border-b border-gray-300">
                    <td colSpan={18} className="py-2 px-3 text-sm text-gray-900 bg-gray-50/80">
                      <span className="text-orange-500 mr-1">➡️</span> {group.month} ({group.count.toString().padStart(2, "0")})
                    </td>
                  </tr>

                  {/* Group Items */}
                  {group.items.map((item) => (
                    <tr key={item.style} className="border-b border-gray-200 hover:bg-emerald-50/20">
                      <td className="py-2 px-3 border-r border-gray-200 font-bold text-gray-900">
                        <Link
                          href={`/admin/styles/${seasonId}/${departmentId}/${categoryId}/${item.style}`}
                          className="text-blue-700 hover:underline block"
                        >
                          {item.style}
                        </Link>
                      </td>
                      <td className="py-2 px-3 border-r border-gray-200">{item.fit}</td>
                      <td className="py-2 px-3 border-r border-gray-200">
                        <div className="relative w-8 h-8 rounded border overflow-hidden bg-gray-100">
                          <Image
                            src={item.image}
                            alt={`Style ${item.style}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </td>
                      <td className="py-2 px-3 border-r border-gray-200">{item.month}</td>
                      <td className="py-2 px-3 border-r border-gray-200">{item.retailPrice}</td>
                      <td className="py-2 px-3 border-r border-gray-200">{item.fob}</td>
                      <td className="py-2 px-3 border-r border-gray-200">{item.activeColor}</td>
                      <td className="py-2 px-3 border-r border-gray-200">{item.sizeRange}</td>
                      <td className="py-2 px-3 border-r border-gray-200">{item.fabric}</td>
                      <td className="py-2 px-3 border-r border-gray-200">{item.fabricDescription}</td>
                      <td className="py-2 px-3 border-r border-gray-200">{item.composition}</td>
                      <td className="py-2 px-3 border-r border-gray-200 font-semibold text-emerald-700">
                        {item.promoteStatus}
                      </td>
                      <td className="py-2 px-3 border-r border-gray-200">{item.assignedBranch}</td>
                      <td className="py-2 px-3 border-r border-gray-200">{item.packingCode}</td>
                      <td className="py-2 px-3 border-r border-gray-200">{item.transportMode}</td>
                      <td className="py-2 px-3 border-r border-gray-200">{item.supplier}</td>
                      <td className="py-2 px-3 border-r border-gray-200">{item.exDelivery}</td>
                      <td className="py-2 px-3">{item.sustainability}</td>
                    </tr>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
