"use client";

import type { DividerElement } from "@/types/builder";

interface DividerBlockProps {
  element: DividerElement;
  selected: boolean;
  onSelect: () => void;
}

export function DividerBlock({ element, selected, onSelect }: DividerBlockProps) {
  return (
    <div
      onClick={onSelect}
      className={`group relative cursor-pointer rounded-lg transition-all ${
        selected ? "ring-2 ring-indigo-500 ring-offset-2" : "hover:ring-2 hover:ring-gray-300"
      }`}
    >
      <div style={{ padding: element.styles.padding || "10px 0" }}>
        <hr
          style={{
            border: "0",
            borderTop: `${element.thickness || "1px"} solid ${element.dividerColor || "#e5e7eb"}`,
            width: element.dividerWidth || "100%",
            margin: "0 auto",
          }}
        />
      </div>
      {selected && (
        <div className="absolute -top-3 left-2 rounded bg-indigo-600 px-2 py-0.5 text-[10px] font-medium text-white">
          Divider
        </div>
      )}
    </div>
  );
}
