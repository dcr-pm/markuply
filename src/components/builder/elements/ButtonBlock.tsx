"use client";

import type { ButtonElement } from "@/types/builder";

interface ButtonBlockProps {
  element: ButtonElement;
  selected: boolean;
  onSelect: () => void;
  onChange: (el: ButtonElement) => void;
}

export function ButtonBlock({ element, onSelect, onChange }: ButtonBlockProps) {
  return (
    <div onClick={onSelect} className="cursor-pointer rounded-lg">
      <div style={{ padding: element.styles.padding || "10px 0", textAlign: "center" }}>
        <span
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) =>
            onChange({ ...element, text: e.currentTarget.textContent || "" })
          }
          className="inline-block outline-none cursor-text"
          style={{
            display: "inline-block",
            fontFamily: element.styles.fontFamily || "Arial, sans-serif",
            fontSize: element.styles.fontSize || "16px",
            fontWeight: "bold",
            color: element.textColor || "#ffffff",
            textDecoration: "none",
            padding: "14px 32px",
            borderRadius: element.borderRadius || "6px",
            backgroundColor: element.buttonColor || "#4F46E5",
          }}
        >
          {element.text}
        </span>
      </div>
    </div>
  );
}
