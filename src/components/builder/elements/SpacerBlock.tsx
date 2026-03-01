"use client";

import type { SpacerElement } from "@/types/builder";

interface SpacerBlockProps {
  element: SpacerElement;
  selected: boolean;
  onSelect: () => void;
}

export function SpacerBlock({ element, selected, onSelect }: SpacerBlockProps) {
  return (
    <div onClick={onSelect} className="cursor-pointer rounded-lg">
      <div
        className="flex items-center justify-center"
        style={{ height: element.height || "30px" }}
      >
        {selected && (
          <div className="flex items-center gap-2 text-xs text-mk-text-muted">
            <span className="h-px flex-1 bg-mk-border" />
            <span>{element.height || "30px"}</span>
            <span className="h-px flex-1 bg-mk-border" />
          </div>
        )}
      </div>
    </div>
  );
}
