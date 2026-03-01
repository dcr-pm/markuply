"use client";

import type { GifElement } from "@/types/builder";

interface GifBlockProps {
  element: GifElement;
  selected: boolean;
  onSelect: () => void;
  onChange: (el: GifElement) => void;
}

export function GifBlock({ element, onSelect }: GifBlockProps) {
  return (
    <div onClick={onSelect} className="cursor-pointer rounded-lg">
      <div style={{ padding: element.styles.padding || "10px 0" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={element.src}
          alt={element.alt}
          className="block w-full h-auto"
          style={{
            borderRadius: element.styles.borderRadius || "0",
          }}
        />
      </div>
    </div>
  );
}
