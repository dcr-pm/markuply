"use client";

import type { DividerElement } from "@/types/builder";

interface DividerBlockProps {
  element: DividerElement;
  selected: boolean;
  onSelect: () => void;
}

export function DividerBlock({ element, onSelect }: DividerBlockProps) {
  return (
    <div onClick={onSelect} className="cursor-pointer rounded-lg">
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
    </div>
  );
}
