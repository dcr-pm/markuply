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
    </div>
  );
}
