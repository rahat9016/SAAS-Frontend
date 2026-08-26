"use client";

import { Input } from "@/src/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Plus, Search, Shirt } from "lucide-react";
import { IArticleItem, mockArticlesListGrouped } from "../data/mockStyleData";
import CreateUpdateSeason from "../Form/CreateUpdateSeason";
import { SeasonFormValues } from "../Schema/seasonSchema";
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

const promoteStatusStyles: Record<string, string> = {
  Concept: "bg-blue-100 text-blue-800",
  Development: "bg-amber-100 text-amber-800",
  Approved: "bg-emerald-100 text-emerald-800",
};

const initialArticles: IArticleItem[] = mockArticlesListGrouped.flatMap(
  (group) => group.items
);

const columnClass = "py-3 px-4 border-r border-light-dark last:border-r-0";

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
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

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

  const toggleGroup = (month: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(month)) next.delete(month);
      else next.add(month);
      return next;
    });
  };

  const handleAction = (action: string) => {
    setIsDropdownOpen(false);
    if (action === "New From Style") {
      setIsModalOpen(true);
      return;
    }
    toast.info(`Action triggered: ${action}`);
  };

  const handleCreateArticle = (values: SeasonFormValues) => {
    const newArticle: IArticleItem = {
      style: values.season,
      fit: "",
      image:
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=200&q=80",
      month: values.deliveryMonth,
      retailPrice: "",
      fob: "",
      activeColor: "",
      sizeRange: "",
      fabric: "",
      fabricDescription: "",
      composition: "",
      promoteStatus: "Concept",
      assignedBranch: "",
      packingCode: "",
      transportMode: "",
      supplier: "",
      exDelivery: "",
      sustainability: "",
      seasonId,
      categoryId: values.styleMainClass,
      segmentId: values.styleClass,
      subCategoryId: values.styleSubClass,
    };

    setArticles((prev) => [...prev, newArticle]);
    setIsModalOpen(false);
    toast.success(`Style ${values.season} created`);
  };

  const columns: { header: string; width?: string }[] = [
    { header: "Style" },
    { header: "Fit" },
    { header: "Image" },
    { header: "Month" },
    { header: "Retail Price" },
    { header: "FOB" },
    { header: "Active Color" },
    { header: "Size Range" },
    { header: "Fabric" },
    { header: "Fabric Description" },
    { header: "Composition" },
    { header: "Promote Status" },
    { header: "Assigned Branch" },
    { header: "Packing Code" },
    { header: "Transport Mode" },
    { header: "Supplier" },
    { header: "Ex Delivery" },
    { header: "Sustainability" },
  ];

  return (
    <div className="w-full space-y-4">
      {/* Breadcrumb */}
      <div className="text-xs md:text-sm text-secondary-gary font-medium">
        <Link href="/admin/styles" className="hover:text-primary hover:underline">Style</Link> {" > "}
        <Link href={`/admin/styles/${seasonId}`} className="hover:text-primary hover:underline">{seasonName}</Link> {" > "}
        <Link href={`/admin/styles/${seasonId}/${departmentId}`} className="hover:text-primary hover:underline">{deptName}</Link> {" > "}
        <span className="text-secondary-dark font-semibold">{categoryName}</span>
      </div>

      {/* Header card */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 bg-white border border-light-dark rounded-lg px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-11 rounded-lg bg-primary/10 text-primary shrink-0">
            <Shirt className="size-5" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl text-secondary-dark font-bold tracking-tight">
              Articles
            </h1>
            <p className="text-xs text-secondary-gary mt-0.5">
              Use the column filter row below to narrow by Month, Promote Status or Ex Delivery — or search across all fields.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 lg:ml-auto">
          <div className="flex items-center border border-light-dark px-3 rounded-[6px] h-11 w-full max-w-60">
            <Search className="text-[#BDBDBD] size-4 shrink-0" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles..."
              className="border-none shadow-none focus-visible:ring-0 h-auto placeholder:text-[#BDBDBD] bg-transparent"
            />
          </div>

          <div className="relative shrink-0">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1.5 h-11 px-6 bg-primary text-white text-sm font-medium rounded-lg shadow-sm hover:bg-primary/90 transition-colors whitespace-nowrap shrink-0"
            >
              <Plus className="size-4" />
              New Article
              <ChevronDown className="size-4 ml-1" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-light-dark rounded-lg shadow-lg z-20 overflow-hidden">
                <button
                  onClick={() => handleAction("New From Style")}
                  className="w-full text-left px-4 py-2.5 text-sm text-secondary-dark hover:bg-primary/5 hover:text-primary font-medium border-b border-light-dark transition-colors"
                >
                  New From Style
                </button>
                <button
                  onClick={() => handleAction("Move From")}
                  className="w-full text-left px-4 py-2.5 text-sm text-secondary-dark hover:bg-primary/5 hover:text-primary font-medium transition-colors"
                >
                  Move From
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Articles table */}
      <div className="bg-white border border-light-dark rounded-lg overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
            <thead>
              <tr className="bg-[#5098D5]">
                {columns.map((col) => (
                  <th
                    key={col.header}
                    className="py-3 px-4 border-r border-white/30 last:border-r-0 font-semibold text-white text-xs uppercase tracking-wide"
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
              {/* Column filter row */}
              <tr className="bg-primary/5 border-b border-light-dark">
                <td className={`${columnClass} text-secondary-gary`}>All</td>
                <td className={`${columnClass} text-secondary-gary`}>All</td>
                <td className={`${columnClass} text-secondary-gary`}>All</td>
                <td className={columnClass}>
                  <select
                    value={monthFilter}
                    onChange={(e) => setMonthFilter(e.target.value)}
                    className="w-full bg-transparent text-secondary-dark font-medium focus:outline-none"
                  >
                    <option value="all">All</option>
                    {monthFilterOptions.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </td>
                <td className={`${columnClass} text-secondary-gary`}>All</td>
                <td className={`${columnClass} text-secondary-gary`}>All</td>
                <td className={`${columnClass} text-secondary-gary`}>All</td>
                <td className={`${columnClass} text-secondary-gary`}>All</td>
                <td className={`${columnClass} text-secondary-gary`}>All</td>
                <td className={`${columnClass} text-secondary-gary`}>All</td>
                <td className={`${columnClass} text-secondary-gary`}>All</td>
                <td className={columnClass}>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full bg-transparent text-secondary-dark font-medium focus:outline-none"
                  >
                    <option value="all">All</option>
                    {statusFilterOptions.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td className={`${columnClass} text-secondary-gary`}>All</td>
                <td className={`${columnClass} text-secondary-gary`}>All</td>
                <td className={`${columnClass} text-secondary-gary`}>All</td>
                <td className={`${columnClass} text-secondary-gary`}>All</td>
                <td className={columnClass}>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full bg-transparent text-secondary-dark font-medium focus:outline-none"
                  >
                    <option value="all">All</option>
                    {dateFilterOptions.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </td>
                <td className={`py-3 px-4 text-secondary-gary`}>All</td>
              </tr>
            </thead>

            {groupedArticles.length === 0 && (
              <tbody>
                <tr>
                  <td colSpan={columns.length} className="py-10 px-3 text-center text-sm text-secondary-gary">
                    No articles match the current filters.
                  </td>
                </tr>
              </tbody>
            )}

            {groupedArticles.map((group) => {
              const isCollapsed = collapsedGroups.has(group.month);
              return (
                <tbody key={group.month}>
                  <tr className="bg-light border-b border-light-dark">
                    <td colSpan={columns.length} className="p-0">
                      <button
                        onClick={() => toggleGroup(group.month)}
                        className="w-full flex items-center gap-2 py-2.5 px-4 text-sm font-semibold text-secondary-dark hover:bg-light-dark/40 transition-colors"
                      >
                        {isCollapsed ? (
                          <ChevronRight className="size-4 text-primary" />
                        ) : (
                          <ChevronDown className="size-4 text-primary" />
                        )}
                        {group.month}
                        <span className="text-secondary-gary font-normal">
                          ({group.items.length.toString().padStart(2, "0")})
                        </span>
                      </button>
                    </td>
                  </tr>

                  {!isCollapsed &&
                    group.items.map((item) => (
                      <tr
                        key={item.style}
                        className="border-b border-light-dark even:bg-light/30 hover:bg-primary/5 transition-colors"
                      >
                        <td className={columnClass}>
                          <Link
                            href={`/admin/styles/${seasonId}/${departmentId}/${categoryId}/${item.style}`}
                            className="text-primary font-semibold hover:underline"
                          >
                            {item.style}
                          </Link>
                        </td>
                        <td className={`${columnClass} text-secondary-dark`}>{item.fit}</td>
                        <td className={columnClass}>
                          <div className="relative w-8 h-8 rounded-md border border-light-dark overflow-hidden bg-light">
                            <Image
                              src={item.image}
                              alt={`Style ${item.style}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </td>
                        <td className={`${columnClass} text-secondary-dark`}>{item.month}</td>
                        <td className={`${columnClass} text-secondary-dark`}>{item.retailPrice}</td>
                        <td className={`${columnClass} text-secondary-dark`}>{item.fob}</td>
                        <td className={`${columnClass} text-secondary-dark`}>{item.activeColor}</td>
                        <td className={`${columnClass} text-secondary-dark`}>{item.sizeRange}</td>
                        <td className={`${columnClass} text-secondary-dark`}>{item.fabric}</td>
                        <td className={`${columnClass} text-secondary-gary`}>{item.fabricDescription}</td>
                        <td className={`${columnClass} text-secondary-gary`}>{item.composition}</td>
                        <td className={columnClass}>
                          <span
                            className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded ${
                              promoteStatusStyles[item.promoteStatus] ??
                              "bg-purple-100 text-purple-800"
                            }`}
                          >
                            {item.promoteStatus}
                          </span>
                        </td>
                        <td className={`${columnClass} text-secondary-dark`}>{item.assignedBranch}</td>
                        <td className={`${columnClass} text-secondary-gary`}>{item.packingCode}</td>
                        <td className={`${columnClass} text-secondary-gary`}>{item.transportMode}</td>
                        <td className={`${columnClass} text-secondary-gary`}>{item.supplier}</td>
                        <td className={`${columnClass} text-secondary-gary`}>{item.exDelivery}</td>
                        <td className="py-3 px-4 text-secondary-gary">{item.sustainability}</td>
                      </tr>
                    ))}
                </tbody>
              );
            })}
          </table>
        </div>
      </div>

      <CreateUpdateSeason
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateArticle}
      />
    </div>
  );
}
