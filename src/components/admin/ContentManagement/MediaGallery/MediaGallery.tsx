"use client";

import { Button } from "@/src/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import {
  Eye,
  FolderOpen,
  Search,
  Trash2,
  Upload,
  X
} from "lucide-react";
import { useState } from "react";
import ImageUploadModal from "./ImageUploadModal";


export interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: "product" | "category" | "other";
  dimensions: string;
  size: string;
  uploadedAt: string;
}

const MOCK_MEDIA: MediaItem[] = [
  {
    id: "1",
    name: "Summer Collection",
    url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop",
    type: "product",
    dimensions: "800×800",
    size: "245 KB",
    uploadedAt: "2026-03-15",
  },
  {
    id: "2",
    name: "Electronics Banner",
    url: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop",
    type: "category",
    dimensions: "1200×600",
    size: "380 KB",
    uploadedAt: "2026-03-14",
  },
  {
    id: "3",
    name: "Fashion Accessories",
    url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    type: "product",
    dimensions: "1000×1000",
    size: "312 KB",
    uploadedAt: "2026-03-13",
  },
  {
    id: "4",
    name: "Home & Living",
    url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
    type: "category",
    dimensions: "1920×1080",
    size: "520 KB",
    uploadedAt: "2026-03-12",
  },
  {
    id: "5",
    name: "Sport Shoes",
    url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    type: "product",
    dimensions: "800×800",
    size: "198 KB",
    uploadedAt: "2026-03-11",
  },
  {
    id: "6",
    name: "Beauty Products",
    url: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop",
    type: "category",
    dimensions: "1200×800",
    size: "445 KB",
    uploadedAt: "2026-03-10",
  },
  {
    id: "7",
    name: "Watch Collection",
    url: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop",
    type: "product",
    dimensions: "600×600",
    size: "178 KB",
    uploadedAt: "2026-03-09",
  },
  {
    id: "8",
    name: "Kitchen Appliances",
    url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop",
    type: "category",
    dimensions: "1400×900",
    size: "389 KB",
    uploadedAt: "2026-03-08",
  },
];

type FilterTab = "all" | "product" | "category";

export default function MediaGallery() {
  const [media, setMedia] = useState<MediaItem[]>(MOCK_MEDIA);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);

  const filteredMedia = media.filter((item) => {
    const matchesTab = activeTab === "all" || item.type === activeTab;
    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleDelete = (id: string) => {
    setMedia((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpload = (newItems: MediaItem[]) => {
    setMedia((prev) => [...newItems, ...prev]);
  };

  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: "all", label: "All", count: media.length },
    {
      key: "product",
      label: "Product",
      count: media.filter((m) => m.type === "product").length,
    },
    {
      key: "category",
      label: "Category",
      count: media.filter((m) => m.type === "category").length,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-dark">
            Media Gallery
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your product and category images
          </p>
        </div>
        <Button
          onClick={() => setIsUploadOpen(true)}
          className="bg-secondary hover:bg-secondary/90 text-white gap-2"
        >
          <Upload className="h-4 w-4" />
          Upload Images
        </Button>
      </div>

      {/* Tabs + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex gap-1 bg-gray-50 rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer ${
                activeTab === tab.key
                  ? "bg-secondary text-white shadow-sm"
                  : "text-gray-600 hover:text-secondary-dark hover:bg-gray-100"
              }`}
            >
              {tab.label}
              <span
                className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.key
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
            placeholder="Search media..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2.5 w-full sm:w-72 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Grid */}
      {filteredMedia.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-100">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FolderOpen className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700">
            No media found
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Try adjusting your filters or upload new images
          </p>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredMedia.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="group relative bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
              >
                {/* Image */}
                <div className="aspect-square relative overflow-hidden bg-gray-50">
                  <img
                    src={item.url}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => setPreviewItem(item)}
                      className="p-2 bg-white rounded-full shadow-lg hover:bg-primary hover:text-white transition-colors cursor-pointer"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 bg-white rounded-full shadow-lg hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Type Badge */}
                  <div className="absolute top-2 left-2">
                    <span
                      className={`text-[10px] font-semibold px-2 py-1 rounded-full uppercase tracking-wide ${
                        item.type === "product"
                          ? "bg-blue-500/90 text-white"
                          : "bg-emerald-500/90 text-white"
                      }`}
                    >
                      {item.type}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-3">
                  <h4 className="text-sm font-semibold text-gray-800 truncate">
                    {item.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1.5 text-[11px] text-gray-400">
                    <span>{item.dimensions}</span>
                    <span>•</span>
                    <span>{item.size}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Upload Modal */}
      <ImageUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUpload={handleUpload}
      />

      {/* Preview Modal */}
      <AnimatePresence>
        {previewItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={() => setPreviewItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl overflow-hidden max-w-2xl w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <img
                  src={previewItem.url}
                  alt={previewItem.name}
                  className="w-full max-h-[60vh] object-contain bg-gray-50"
                />
                <button
                  onClick={() => setPreviewItem(null)}
                  className="absolute top-3 right-3 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900">
                  {previewItem.name}
                </h3>
                <div className="flex gap-4 mt-2 text-sm text-gray-500">
                  <span>Type: <span className="font-medium text-gray-700 capitalize">{previewItem.type}</span></span>
                  <span>Size: <span className="font-medium text-gray-700">{previewItem.size}</span></span>
                  <span>Dimensions: <span className="font-medium text-gray-700">{previewItem.dimensions}</span></span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
