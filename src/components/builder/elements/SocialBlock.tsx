"use client";

import type { SocialElement } from "@/types/builder";

interface SocialBlockProps {
  element: SocialElement;
  selected: boolean;
  onSelect: () => void;
  onChange: (el: SocialElement) => void;
}

export function SocialBlock({ element, onSelect }: SocialBlockProps) {
  const size = parseInt(element.iconSize || "32");

  return (
    <div onClick={onSelect} className="cursor-pointer rounded-lg">
      <div
        style={{
          textAlign: (element.styles.textAlign || "center") as React.CSSProperties["textAlign"],
          padding: element.styles.padding || "10px 0",
          backgroundColor: element.styles.backgroundColor || "transparent",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "6px" }}>
          {element.links.map((link) => (
            <span
              key={link.platform}
              className="inline-block"
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
      </div>
    </div>
  );
}
