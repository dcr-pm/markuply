"use client";

import type { SpacerElement } from "@/types/builder";

interface SpacerBlockProps {
  element: SpacerElement;
  selected: boolean;
  onSelect: () => void;
}

export function SpacerBlock({ element, selected, onSelect }: SpacerBlockProps) {
  return (
    <div
      onClick={onSelect}
      className={`group relative cursor-pointer rounded-lg transition-all ${
        selected ? "ring-2 ring-indigo-500 ring-offset-2" : "hover:ring-2 hover:ring-gray-300"
      }`}
    >
      <div
        className="flex items-center justify-center"
        style={{ height: element.height || "30px" }}
      >
        {selected && (
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="h-px flex-1 bg-gray-300" />
            <span>{element.height || "30px"}</span>
            <span className="h-px flex-1 bg-gray-300" />
          </div>
        )}
      </div>
      {selected && (
        <div className="absolute -top-3 left-2 rounded bg-indigo-600 px-2 py-0.5 text-[10px] font-medium text-white">
          Spacer
        </div>
      )}
    </div>
  );
}
