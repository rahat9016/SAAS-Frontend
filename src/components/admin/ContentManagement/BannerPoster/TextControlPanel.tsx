"use client";

import type { TemplateTextElement } from "./templates";
import {
  Type,
  Palette,
  RotateCw,
  Trash2,
  Bold,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

interface TextControlPanelProps {
  element: TemplateTextElement;
  onUpdate: (updates: Partial<TemplateTextElement>) => void;
  onDelete: () => void;
  onClose: () => void;
}

export default function TextControlPanel({
  element,
  onUpdate,
  onDelete,
  onClose,
}: TextControlPanelProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
          <Type className="h-4 w-4 text-primary" />
          Text Properties
        </h4>
        <button
          onClick={onClose}
          className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          Done
        </button>
      </div>

      {/* Content */}
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Content
        </label>
        <textarea
          value={element.content}
          onChange={(e) => onUpdate({ content: e.target.value })}
          rows={2}
          className="w-full mt-1 px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
        />
      </div>

      {/* Font Size */}
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Font Size: {element.fontSize}px
        </label>
        <div className="flex items-center gap-2 mt-1">
          <input
            type="range"
            min={8}
            max={120}
            value={element.fontSize}
            onChange={(e) =>
              onUpdate({ fontSize: parseInt(e.target.value) })
            }
            className="flex-1 h-1.5 appearance-none bg-gray-200 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer"
          />
          <div className="flex flex-col">
            <button
              onClick={() => onUpdate({ fontSize: element.fontSize + 1 })}
              className="p-0.5 hover:bg-gray-100 rounded cursor-pointer"
            >
              <ChevronUp className="h-3 w-3 text-gray-500" />
            </button>
            <button
              onClick={() =>
                onUpdate({
                  fontSize: Math.max(8, element.fontSize - 1),
                })
              }
              className="p-0.5 hover:bg-gray-100 rounded cursor-pointer"
            >
              <ChevronDown className="h-3 w-3 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Color */}
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Color
        </label>
        <div className="flex items-center gap-2 mt-1">
          <div className="relative">
            <input
              type="color"
              value={element.color}
              onChange={(e) => onUpdate({ color: e.target.value })}
              className="w-8 h-8 rounded-lg border border-gray-200 cursor-pointer appearance-none p-0"
            />
          </div>
          <input
            type="text"
            value={element.color}
            onChange={(e) => onUpdate({ color: e.target.value })}
            className="flex-1 px-3 py-1.5 text-xs font-mono border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        {/* Quick colors */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {[
            "#FFFFFF", "#000000", "#E94560", "#FFD700",
            "#2ECC71", "#3498DB", "#9B59B6", "#E67E22",
            "#1ABC9C", "#F39C12", "#C0392B", "#8E44AD",
            "#2C3E50", "#7F8C8D", "#D35400", "#27AE60",
          ].map((c) => (
            <button
              key={c}
              onClick={() => onUpdate({ color: c })}
              className={`w-5 h-5 rounded-full border cursor-pointer hover:scale-125 transition-transform ${
                element.color.toUpperCase() === c
                  ? "border-primary ring-2 ring-primary/30 scale-110"
                  : "border-gray-300"
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      {/* Font Weight */}
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Weight: {element.fontWeight}
        </label>
        <div className="flex gap-1 mt-1">
          {[300, 400, 500, 600, 700, 800, 900].map((w) => (
            <button
              key={w}
              onClick={() => onUpdate({ fontWeight: w })}
              className={`flex-1 py-1.5 text-[10px] rounded cursor-pointer transition-colors ${
                element.fontWeight === w
                  ? "bg-secondary text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      {/* Rotation */}
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1">
          <RotateCw className="h-3 w-3" />
          Rotation: {element.rotation}°
        </label>
        <input
          type="range"
          min={-180}
          max={180}
          value={element.rotation}
          onChange={(e) =>
            onUpdate({ rotation: parseInt(e.target.value) })
          }
          className="w-full mt-1 h-1.5 appearance-none bg-gray-200 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer"
        />
      </div>

      {/* Text Transform */}
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Transform
        </label>
        <div className="flex gap-1 mt-1">
          {(
            [
              { label: "None", value: "none" },
              { label: "ABC", value: "uppercase" },
              { label: "abc", value: "lowercase" },
              { label: "Abc", value: "capitalize" },
            ] as const
          ).map((t) => (
            <button
              key={t.value}
              onClick={() => onUpdate({ textTransform: t.value })}
              className={`flex-1 py-1.5 text-xs rounded cursor-pointer transition-colors ${
                (element.textTransform || "none") === t.value
                  ? "bg-secondary text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Letter Spacing */}
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Letter Spacing: {element.letterSpacing || 0}px
        </label>
        <input
          type="range"
          min={-5}
          max={20}
          value={element.letterSpacing || 0}
          onChange={(e) =>
            onUpdate({ letterSpacing: parseInt(e.target.value) })
          }
          className="w-full mt-1 h-1.5 appearance-none bg-gray-200 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer"
        />
      </div>

      {/* Delete */}
      <button
        onClick={onDelete}
        className="w-full flex items-center justify-center gap-2 py-2 bg-red-50 text-red-500 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors cursor-pointer"
      >
        <Trash2 className="h-4 w-4" />
        Delete Text
      </button>
    </div>
  );
}
