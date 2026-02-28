"use client";

import type { HeadingElement } from "@/types/builder";

interface HeadingBlockProps {
  element: HeadingElement;
  selected: boolean;
  onSelect: () => void;
  onChange: (el: HeadingElement) => void;
}

export function HeadingBlock({ element, selected, onSelect, onChange }: HeadingBlockProps) {
  const sizes: Record<number, string> = { 1: "32px", 2: "24px", 3: "20px" };

  return (
    <div
      onClick={onSelect}
      className={`group relative cursor-pointer rounded-lg transition-all ${
        selected ? "ring-2 ring-indigo-500 ring-offset-2" : "hover:ring-2 hover:ring-gray-300"
      }`}
    >
      <div
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) =>
          onChange({ ...element, content: e.currentTarget.textContent || "" })
        }
        className="outline-none px-2 py-1"
        style={{
          fontSize: element.styles.fontSize || sizes[element.level],
          fontFamily: element.styles.fontFamily || "Arial, sans-serif",
          fontWeight: element.styles.fontWeight || "bold",
          color: element.styles.color || "#111111",
          textAlign: element.styles.textAlign || "left",
          backgroundColor: element.styles.backgroundColor,
          padding: element.styles.padding || "10px 0",
        }}
      >
        {element.content}
      </div>
      {selected && (
        <div className="absolute -top-3 left-2 rounded bg-indigo-600 px-2 py-0.5 text-[10px] font-medium text-white">
          H{element.level}
        </div>
      )}
    </div>
  );
}
