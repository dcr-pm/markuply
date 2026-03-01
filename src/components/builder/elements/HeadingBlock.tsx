"use client";

import type { HeadingElement } from "@/types/builder";

interface HeadingBlockProps {
  element: HeadingElement;
  selected: boolean;
  onSelect: () => void;
  onChange: (el: HeadingElement) => void;
}

export function HeadingBlock({ element, onSelect, onChange }: HeadingBlockProps) {
  const sizes: Record<number, string> = { 1: "32px", 2: "24px", 3: "20px" };

  return (
    <div onClick={onSelect} className="cursor-pointer rounded-lg">
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
    </div>
  );
}
