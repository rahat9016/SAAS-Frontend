"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/src/components/ui/button";
import {
  Upload,
  X,
  ImagePlus,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { MediaItem } from "./MediaGallery";

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (items: MediaItem[]) => void;
}

export default function ImageUploadModal({
  isOpen,
  onClose,
  onUpload,
}: ImageUploadModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<
    { file: File; preview: string; type: "product" | "category" }[]
  >([]);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const processFiles = useCallback((fileList: FileList) => {
    const newFiles = Array.from(fileList)
      .filter((f) => f.type.startsWith("image/"))
      .map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        type: "product" as const,
      }));
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files) {
        processFiles(e.dataTransfer.files);
      }
    },
    [processFiles]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  const handleTypeChange = (
    index: number,
    type: "product" | "category"
  ) => {
    setFiles((prev) =>
      prev.map((f, i) => (i === index ? { ...f, type } : f))
    );
  };

  const removeFile = (index: number) => {
    setFiles((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleUpload = async () => {
    setUploading(true);
    // Simulate upload delay
    await new Promise((r) => setTimeout(r, 1000));

    const newItems: MediaItem[] = files.map((f, i) => ({
      id: `upload-${Date.now()}-${i}`,
      name: f.file.name.replace(/\.[^.]+$/, ""),
      url: f.preview,
      type: f.type,
      dimensions: "Auto",
      size: `${(f.file.size / 1024).toFixed(0)} KB`,
      uploadedAt: new Date().toISOString().split("T")[0],
    }));

    onUpload(newItems);
    setFiles([]);
    setUploading(false);
    onClose();
  };

  const handleClose = () => {
    files.forEach((f) => URL.revokeObjectURL(f.preview));
    setFiles([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Upload Images
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Drag & drop or browse files
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
            {/* Drop Zone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
                dragActive
                  ? "border-primary bg-primary/5 scale-[1.02]"
                  : "border-gray-200 hover:border-primary/50 hover:bg-gray-50"
              }`}
            >
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="flex flex-col items-center gap-3">
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                    dragActive ? "bg-primary/10" : "bg-gray-100"
                  }`}
                >
                  <ImagePlus
                    className={`h-7 w-7 ${
                      dragActive ? "text-primary" : "text-gray-400"
                    }`}
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">
                    Drop images here or{" "}
                    <span className="text-primary">browse</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    PNG, JPG, WEBP up to 10MB
                  </p>
                </div>
              </div>
            </div>

            {/* Preview Files */}
            {files.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-700">
                  Selected Files ({files.length})
                </h4>
                {files.map((f, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100"
                  >
                    <img
                      src={f.preview}
                      alt=""
                      className="w-14 h-14 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {f.file.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {(f.file.size / 1024).toFixed(0)} KB
                      </p>
                    </div>

                    <select
                      value={f.type}
                      onChange={(e) =>
                        handleTypeChange(
                          index,
                          e.target.value as "product" | "category"
                        )
                      }
                      className="text-xs px-2 py-1.5 rounded-md border border-gray-200 bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      <option value="product">Product</option>
                      <option value="category">Category</option>
                    </select>

                    <button
                      onClick={() => removeFile(index)}
                      className="p-1.5 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                    >
                      <X className="h-4 w-4 text-gray-400 hover:text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {files.length > 0 && (
            <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-100 bg-gray-50/50">
              <Button
                variant="outline"
                onClick={handleClose}
                className="px-6"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                disabled={uploading}
                className="bg-secondary hover:bg-secondary/90 text-white gap-2 px-6"
              >
                {uploading ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Upload {files.length} file{files.length > 1 ? "s" : ""}
                  </>
                )}
              </Button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
