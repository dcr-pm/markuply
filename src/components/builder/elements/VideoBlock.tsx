"use client";

import type { VideoElement } from "@/types/builder";

interface VideoBlockProps {
  element: VideoElement;
  selected: boolean;
  onSelect: () => void;
  onChange: (el: VideoElement) => void;
}

export function VideoBlock({ element, onSelect }: VideoBlockProps) {
  return (
    <div onClick={onSelect} className="cursor-pointer rounded-lg">
      <div className="relative" style={{ padding: element.styles.padding || "10px 0" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={element.thumbnailSrc}
          alt={element.alt}
          className="block w-full h-auto"
          style={{
            borderRadius: element.styles.borderRadius || "0",
          }}
        />
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ padding: element.styles.padding || "10px 0" }}>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm">
            <div className="ml-1 h-0 w-0 border-y-[10px] border-l-[18px] border-y-transparent border-l-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
