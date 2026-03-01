"use client";

import type { TextElement } from "@/types/builder";

interface TextBlockProps {
  element: TextElement;
  selected: boolean;
  onSelect: () => void;
  onChange: (el: TextElement) => void;
}

export function TextBlock({ element, onSelect, onChange }: TextBlockProps) {
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
          fontSize: element.styles.fontSize || "16px",
          fontFamily: element.styles.fontFamily || "Arial, sans-serif",
          fontWeight: element.styles.fontWeight || "normal",
          color: element.styles.color || "#333333",
          textAlign: element.styles.textAlign || "left",
          lineHeight: element.styles.lineHeight || "1.6",
          backgroundColor: element.styles.backgroundColor,
          padding: element.styles.padding || "10px 0",
        }}
      >
        {element.content}
      </div>
    </div>
  );
}
