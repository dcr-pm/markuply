"use client";

import type { GifElement } from "@/types/builder";

interface GifBlockProps {
  element: GifElement;
  selected: boolean;
  onSelect: () => void;
  onChange: (el: GifElement) => void;
}

export function GifBlock({ element, selected, onSelect }: GifBlockProps) {
  return (
    <div
      onClick={onSelect}
      className={`group relative cursor-pointer rounded-lg transition-all ${
        selected ? "ring-2 ring-indigo-500 ring-offset-2" : "hover:ring-2 hover:ring-gray-300"
      }`}
    >
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
      {selected && (
        <div className="absolute -top-3 left-2 rounded bg-indigo-600 px-2 py-0.5 text-[10px] font-medium text-white">
          GIF
        </div>
      )}
    </div>
  );
}
