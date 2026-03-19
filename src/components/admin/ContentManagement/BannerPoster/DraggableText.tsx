"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type { TemplateTextElement } from "./templates";

interface DraggableTextProps {
  element: TemplateTextElement;
  isSelected: boolean;
  canvasScale: number;
  onSelect: () => void;
  onPositionChange: (x: number, y: number) => void;
  onDoubleClick: () => void;
}

export default function DraggableText({
  element,
  isSelected,
  canvasScale,
  onSelect,
  onPositionChange,
  onDoubleClick,
}: DraggableTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const startElement = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      onSelect();
      isDragging.current = true;
      startPos.current = { x: e.clientX, y: e.clientY };
      startElement.current = { x: element.x, y: element.y };

      const handleMouseMove = (moveE: MouseEvent) => {
        if (!isDragging.current) return;
        const parent = ref.current?.parentElement;
        if (!parent) return;

        const parentRect = parent.getBoundingClientRect();
        const dx = ((moveE.clientX - startPos.current.x) / parentRect.width) * 100;
        const dy = ((moveE.clientY - startPos.current.y) / parentRect.height) * 100;

        const newX = Math.max(0, Math.min(95, startElement.current.x + dx));
        const newY = Math.max(0, Math.min(95, startElement.current.y + dy));

        onPositionChange(newX, newY);
      };

      const handleMouseUp = () => {
        isDragging.current = false;
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    },
    [element.x, element.y, onSelect, onPositionChange]
  );

  const lines = element.content.split("\n");

  return (
    <div
      ref={ref}
      className="absolute select-none group/text"
      style={{
        left: `${element.x}%`,
        top: `${element.y}%`,
        cursor: "move",
        zIndex: isSelected ? 50 : 10,
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onDoubleClick();
      }}
    >
      {/* Selection indicator */}
      {isSelected && (
        <div
          className="absolute -inset-2 border-2 border-blue-500 rounded pointer-events-none"
          style={{ borderStyle: "dashed" }}
        >
          {/* Corner handles */}
          <div className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-blue-500 rounded-full" />
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full" />
          <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-blue-500 rounded-full" />
          <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full" />
        </div>
      )}

      <div
        style={{
          transform: `rotate(${element.rotation}deg)`,
          transformOrigin: "left top",
        }}
      >
        {lines.map((line, i) => (
          <div
            key={i}
            style={{
              fontSize: `${element.fontSize * canvasScale}px`,
              fontWeight: element.fontWeight,
              color: element.color,
              fontFamily: element.fontFamily || "'Inter', sans-serif",
              textTransform: element.textTransform || "none",
              letterSpacing: element.letterSpacing
                ? `${element.letterSpacing * canvasScale}px`
                : undefined,
              lineHeight: element.lineHeight || 1.2,
              whiteSpace: "nowrap",
              opacity: element.opacity ?? 1,
              WebkitTextStroke: element.textStroke || undefined,
            }}
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}
