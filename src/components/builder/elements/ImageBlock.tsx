"use client";

import type { ImageElement } from "@/types/builder";

interface ImageBlockProps {
  element: ImageElement;
  selected: boolean;
  onSelect: () => void;
  onChange: (el: ImageElement) => void;
}

export function ImageBlock({ element, selected, onSelect, onChange }: ImageBlockProps) {
  return (
    <div onClick={onSelect} className="group cursor-pointer rounded-lg">
      <div style={{ padding: element.styles.padding || "10px 0" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={element.src}
          alt={element.alt}
          className="block w-full h-auto"
          style={{
            borderRadius: element.styles.borderRadius || "0",
            maxWidth: element.styles.maxWidth || "100%",
          }}
        />
      </div>

      {selected && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
          <label className="cursor-pointer rounded-lg bg-white px-3 py-2 text-sm font-medium text-mk-text shadow-md hover:bg-mk-primary-50">
            Change Image URL
            <input
              type="text"
              className="sr-only"
              onFocus={(e) => {
                const url = prompt("Enter image URL:", element.src);
                if (url) onChange({ ...element, src: url });
                e.target.blur();
              }}
            />
          </label>
        </div>
      )}
    </div>
  );
}
