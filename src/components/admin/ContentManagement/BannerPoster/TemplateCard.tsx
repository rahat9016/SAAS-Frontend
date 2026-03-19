"use client";

import type { PosterTemplate } from "./templates";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";

interface TemplateCardProps {
  template: PosterTemplate;
  onSelect: (template: PosterTemplate) => void;
}

function renderMiniShapes(template: PosterTemplate, width: number, height: number) {
  return template.shapes.map((shape, i) => {
    const sx = (shape.x / 100) * width;
    const sy = (shape.y / 100) * height;
    const sw = (shape.width / 100) * width;
    const sh = (shape.height / 100) * height;

    if (shape.type === "circle") {
      return (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: sx,
            top: sy,
            width: sw,
            height: sh,
            backgroundColor: shape.color,
            opacity: shape.opacity ?? 1,
            border: shape.border || undefined,
          }}
        />
      );
    }
    if (shape.type === "rect") {
      return (
        <div
          key={i}
          className="absolute"
          style={{
            left: sx,
            top: sy,
            width: sw,
            height: sh,
            backgroundColor: shape.color,
            opacity: shape.opacity ?? 1,
            borderRadius: shape.borderRadius || 0,
            transform: shape.rotation ? `rotate(${shape.rotation}deg)` : undefined,
            border: shape.border || undefined,
          }}
        />
      );
    }
    if (shape.type === "dots") {
      return (
        <div
          key={i}
          className="absolute grid grid-cols-4 gap-0.5"
          style={{
            left: sx,
            top: sy,
            width: sw,
            height: sh,
            opacity: shape.opacity ?? 1,
          }}
        >
          {Array.from({ length: 16 }).map((_, j) => (
            <div
              key={j}
              className="rounded-full"
              style={{ backgroundColor: shape.color, width: 2, height: 2 }}
            />
          ))}
        </div>
      );
    }
    return null;
  });
}

function renderMiniTexts(template: PosterTemplate, scale: number) {
  return template.textElements.slice(0, 4).map((el, i) => (
    <div
      key={i}
      className="absolute pointer-events-none"
      style={{
        left: `${el.x}%`,
        top: `${el.y}%`,
        transform: `rotate(${el.rotation}deg)`,
        transformOrigin: "left top",
      }}
    >
      {el.content.split("\n").map((line, li) => (
        <div
          key={li}
          style={{
            fontSize: `${Math.max(el.fontSize * scale * 0.5, 3)}px`,
            fontWeight: el.fontWeight,
            color: el.color,
            textTransform: el.textTransform || "none",
            lineHeight: el.lineHeight || 1.2,
            letterSpacing: el.letterSpacing ? `${el.letterSpacing * scale * 0.5}px` : undefined,
            whiteSpace: "nowrap",
            opacity: el.opacity ?? 1,
          }}
        >
          {line}
        </div>
      ))}
    </div>
  ));
}

export default function TemplateCard({
  template,
  onSelect,
}: TemplateCardProps) {
  const isLandscape = template.canvasWidth > template.canvasHeight;
  const previewW = isLandscape ? 280 : 180;
  const previewH = isLandscape
    ? (280 / template.canvasWidth) * template.canvasHeight
    : (180 / template.canvasWidth) * template.canvasHeight;
  const scale = previewW / template.canvasWidth;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="group cursor-pointer"
      onClick={() => onSelect(template)}
    >
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
        {/* Preview */}
        <div className="flex items-center justify-center p-4 bg-gray-50">
          <div
            className="relative overflow-hidden rounded-lg shadow-md"
            style={{
              width: previewW,
              height: previewH,
              background: template.backgroundGradient || template.backgroundColor,
            }}
          >
            {renderMiniShapes(template, previewW, previewH)}
            {/* Image zone placeholder */}
            {template.imageZones.map((zone) => (
              <div
                key={zone.id}
                className="absolute bg-black/10 border border-dashed border-gray-400/30 flex items-center justify-center"
                style={{
                  left: `${zone.x}%`,
                  top: `${zone.y}%`,
                  width: `${zone.width}%`,
                  height: `${zone.height}%`,
                }}
              >
                <div className="w-4 h-4 text-gray-400/50">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="m21 15-5-5L5 21" />
                  </svg>
                </div>
              </div>
            ))}
            {renderMiniTexts(template, scale)}

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white rounded-full p-2.5 shadow-lg">
                <Eye className="h-5 w-5 text-secondary" />
              </div>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-3 border-t border-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-gray-800">
                {template.name}
              </h4>
              <p className="text-[11px] text-gray-400 mt-0.5 capitalize">
                {template.category} • {template.canvasWidth}×{template.canvasHeight}
              </p>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                template.category === "poster"
                  ? "bg-purple-50 text-purple-600"
                  : "bg-blue-50 text-blue-600"
              }`}
            >
              {template.category}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
