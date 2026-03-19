"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid,
  Sparkles,
  Search,
} from "lucide-react";
import { templates, PosterTemplate } from "./templates";
import TemplateCard from "./TemplateCard";
import DesignerCanvas from "./DesignerCanvas";

type ViewMode = "gallery" | "designer";
type CategoryFilter = "all" | "poster" | "banner";

export default function BannerPoster() {
  const [viewMode, setViewMode] = useState<ViewMode>("gallery");
  const [selectedTemplate, setSelectedTemplate] =
    useState<PosterTemplate | null>(null);
  const [categoryFilter, setCategoryFilter] =
    useState<CategoryFilter>("all");
  const [search, setSearch] = useState("");

  const filteredTemplates = templates.filter((t) => {
    const matchesCategory =
      categoryFilter === "all" || t.category === categoryFilter;
    const matchesSearch = t.name
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectTemplate = (template: PosterTemplate) => {
    setSelectedTemplate(template);
    setViewMode("designer");
  };

  const handleBackToGallery = () => {
    setViewMode("gallery");
    setSelectedTemplate(null);
  };

  const categoryTabs: {
    key: CategoryFilter;
    label: string;
    count: number;
  }[] = [
    { key: "all", label: "All Templates", count: templates.length },
    {
      key: "poster",
      label: "Posters",
      count: templates.filter((t) => t.category === "poster").length,
    },
    {
      key: "banner",
      label: "Banners",
      count: templates.filter((t) => t.category === "banner").length,
    },
  ];

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {viewMode === "gallery" ? (
          <motion.div
            key="gallery"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-secondary-dark flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-primary" />
                  Banner & Poster Designer
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Choose a template and customize your design
                </p>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
              <div className="flex gap-1 bg-gray-50 rounded-lg p-1">
                {categoryTabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setCategoryFilter(tab.key)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer ${
                      categoryFilter === tab.key
                        ? "bg-secondary text-white shadow-sm"
                        : "text-gray-600 hover:text-secondary-dark hover:bg-gray-100"
                    }`}
                  >
                    {tab.label}
                    <span
                      className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                        categoryFilter === tab.key
                          ? "bg-white/20 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2.5 w-full sm:w-72 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>
            </div>

            {/* Template Grid */}
            {filteredTemplates.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-100">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <LayoutGrid className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700">
                  No templates found
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Try adjusting your search or filter
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onSelect={handleSelectTemplate}
                  />
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="designer"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            {selectedTemplate && (
              <DesignerCanvas
                template={selectedTemplate}
                onBack={handleBackToGallery}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
