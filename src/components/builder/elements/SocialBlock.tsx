"use client";

import type { SocialElement } from "@/types/builder";

interface SocialBlockProps {
  element: SocialElement;
  selected: boolean;
  onSelect: () => void;
  onChange: (el: SocialElement) => void;
}

export function SocialBlock({ element, selected, onSelect }: SocialBlockProps) {
  const size = parseInt(element.iconSize || "32");

  return (
    <div
      onClick={onSelect}
      className={`group relative cursor-pointer rounded-lg transition-all ${
        selected ? "ring-2 ring-indigo-500 ring-offset-2" : "hover:ring-2 hover:ring-gray-300"
      }`}
    >
      <div
        style={{
          textAlign: "center",
          padding: element.styles.padding || "10px 0",
        }}
      >
        {element.links.map((link) => (
          <span
            key={link.platform}
            className="inline-block mx-1.5"
            title={link.platform}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={link.icon}
              alt={link.platform}
              width={size}
              height={size}
              className="rounded"
              style={{ display: "block" }}
            />
          </span>
        ))}
      </div>
      {selected && (
        <div className="absolute -top-3 left-2 rounded bg-indigo-600 px-2 py-0.5 text-[10px] font-medium text-white">
          Social
        </div>
      )}
    </div>
  );
}
