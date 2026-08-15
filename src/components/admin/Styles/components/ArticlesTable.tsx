"use client";

import { mockColorsList } from "@/src/components/admin/Categories/data/mockColorData";
import { mockSizesList } from "@/src/components/admin/Categories/data/mockSizeData";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronDown, Plus, Search } from "lucide-react";
import { IArticleItem, mockArticlesListGrouped } from "../data/mockStyleData";
import CreateUpdateArticle from "../Form/CreateUpdateArticle";
import { ArticleFormValues } from "../Schema/articleSchema";
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

const colorLookup = new Map(mockColorsList.map((c) => [c.id, c]));
const sizeLookup = new Map(mockSizesList.map((s) => [s.id, s]));

const initialArticles: IArticleItem[] = mockArticlesListGrouped.flatMap(
  (group) => group.items
);

export default function ArticlesTable({
  seasonId,
  departmentId,
  categoryId,
}: ArticlesTableProps) {
  const seasonName = seasonNames[seasonId] || "2027 Main Collection";
  const deptName = deptNames[departmentId] || "Men";
  const categoryName = catNames[categoryId] || "T-Shirt";

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [articles, setArticles] = useState<IArticleItem[]>(initialArticles);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [monthFilter, setMonthFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  const monthFilterOptions = useMemo(
    () => Array.from(new Set(articles.map((a) => a.month))),
    [articles]
  );
  const statusFilterOptions = useMemo(
    () => Array.from(new Set(articles.map((a) => a.promoteStatus))),
    [articles]
  );
  const dateFilterOptions = useMemo(
    () => Array.from(new Set(articles.map((a) => a.exDelivery).filter(Boolean))),
    [articles]
  );

  const filteredArticles = useMemo(() => {
    const q = search.toLowerCase().trim();
    return articles.filter((item) => {
      const matchesSearch =
        !q ||
        [
          item.style,
          item.fit,
          item.fabric,
          item.supplier,
          item.assignedBranch,
        ]
          .join(" ")
          .toLowerCase()
          .includes(q);
      const matchesMonth = monthFilter === "all" || item.month === monthFilter;
      const matchesStatus =
        statusFilter === "all" || item.promoteStatus === statusFilter;
      const matchesDate = dateFilter === "all" || item.exDelivery === dateFilter;
      return matchesSearch && matchesMonth && matchesStatus && matchesDate;
    });
  }, [articles, search, monthFilter, statusFilter, dateFilter]);

  const groupedArticles = useMemo(() => {
    const order: string[] = [];
    const map = new Map<string, IArticleItem[]>();
    filteredArticles.forEach((item) => {
      if (!map.has(item.month)) {
        map.set(item.month, []);
        order.push(item.month);
      }
      map.get(item.month)!.push(item);
    });
    return order.map((month) => ({ month, items: map.get(month)! }));
  }, [filteredArticles]);

  const handleAction = (action: string) => {
    setIsDropdownOpen(false);
    if (action === "New From Style") {
      setIsModalOpen(true);
      return;
    }
    toast.info(`Action triggered: ${action}`);
  };

  const handleCreateArticle = (values: ArticleFormValues) => {
    const colorLabel = values.colorIds
      .map((id) => colorLookup.get(id)?.code ?? id)
      .join(", ");
    const sizeLabel = values.sizeIds
      .map((id) => sizeLookup.get(id)?.code ?? id)
      .join(", ");

    const newArticle: IArticleItem = {
      style: values.style,
      fit: values.fit,
      image:
        values.image ||
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=200&q=80",
      month: values.month,
      retailPrice: values.retailPrice,
      fob: values.fob,
      activeColor: colorLabel,
      sizeRange: sizeLabel,
      fabric: values.fabric,
      fabricDescription: values.fabricDescription,
      composition: values.composition,
      promoteStatus: values.promoteStatus,
      assignedBranch: values.assignedBranch,
      packingCode: values.packingCode,
      transportMode: values.transportMode,
      supplier: values.supplier,
      exDelivery: values.exDelivery,
      sustainability: values.sustainability,
      seasonId: values.seasonId,
      categoryId: values.categoryId,
      segmentId: values.segmentId,
      subCategoryId: values.subCategoryId,
      brandId: values.brandId,
      colorIds: values.colorIds,
      sizeIds: values.sizeIds,
    };

    setArticles((prev) => [...prev, newArticle]);
    setIsModalOpen(false);
    toast.success(`Article ${values.style} created`);
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
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900">Articles</h2>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              Use the column filter row below to narrow by Month, Promote Status or Ex Delivery — or search across all fields.
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles..."
                className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 w-56"
              />
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
        </div>

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
              {/* Column filter row */}
              <tr className="bg-[#e4f5d9] font-medium text-emerald-950 border-b border-emerald-400">
                <td className="py-1.5 px-3 border-r border-emerald-300">All</td>
                <td className="py-1.5 px-3 border-r border-emerald-300">All</td>
                <td className="py-1.5 px-3 border-r border-emerald-300">All</td>
                <td className="py-1 px-2 border-r border-emerald-300">
                  <select
                    value={monthFilter}
                    onChange={(e) => setMonthFilter(e.target.value)}
                    className="w-full bg-transparent text-emerald-950 font-medium focus:outline-none"
                  >
                    <option value="all">All</option>
                    {monthFilterOptions.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </td>
                <td className="py-1.5 px-3 border-r border-emerald-300">All</td>
                <td className="py-1.5 px-3 border-r border-emerald-300">All</td>
                <td className="py-1.5 px-3 border-r border-emerald-300">All</td>
                <td className="py-1.5 px-3 border-r border-emerald-300">All</td>
                <td className="py-1.5 px-3 border-r border-emerald-300">All</td>
                <td className="py-1.5 px-3 border-r border-emerald-300">All</td>
                <td className="py-1.5 px-3 border-r border-emerald-300">All</td>
                <td className="py-1 px-2 border-r border-emerald-300">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full bg-transparent text-emerald-950 font-medium focus:outline-none"
                  >
                    <option value="all">All</option>
                    {statusFilterOptions.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td className="py-1.5 px-3 border-r border-emerald-300">All</td>
                <td className="py-1.5 px-3 border-r border-emerald-300">All</td>
                <td className="py-1.5 px-3 border-r border-emerald-300">All</td>
                <td className="py-1.5 px-3 border-r border-emerald-300">All</td>
                <td className="py-1 px-2 border-r border-emerald-300">
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full bg-transparent text-emerald-950 font-medium focus:outline-none"
                  >
                    <option value="all">All</option>
                    {dateFilterOptions.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </td>
                <td className="py-1.5 px-3">All</td>
              </tr>
            </thead>
            <tbody>
              {groupedArticles.length === 0 && (
                <tr>
                  <td colSpan={18} className="py-6 px-3 text-center text-sm text-gray-400">
                    No articles match the current filters.
                  </td>
                </tr>
              )}
              {groupedArticles.map((group) => (
                <tr key={group.month} className="contents">
                  {/* Group Row Header */}
                  <tr className="bg-white font-bold border-b border-gray-300">
                    <td colSpan={18} className="py-2 px-3 text-sm text-gray-900 bg-gray-50/80">
                      <span className="text-orange-500 mr-1">➡️</span> {group.month} ({group.items.length.toString().padStart(2, "0")})
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

      <CreateUpdateArticle
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateArticle}
        defaultSeasonId={seasonId in seasonNames ? seasonId : undefined}
      />
    </div>
  );
}
