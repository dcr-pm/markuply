"use client";

import type { ColumnsElement } from "@/types/builder";

interface ColumnsBlockProps {
  element: ColumnsElement;
  selected: boolean;
  onSelect: () => void;
  onChange: (el: ColumnsElement) => void;
}

export function ColumnsBlock({ element, selected, onSelect }: ColumnsBlockProps) {
  return (
    <div
      onClick={onSelect}
      className={`group relative cursor-pointer rounded-lg transition-all ${
        selected ? "ring-2 ring-indigo-500 ring-offset-2" : "hover:ring-2 hover:ring-gray-300"
      }`}
    >
      <div
        className="flex gap-2"
        style={{ padding: element.styles.padding || "10px 0" }}
      >
        {element.columns.map((col, i) => (
          <div
            key={i}
            className="flex-1 min-h-[60px] rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center"
            style={{ width: col.width }}
          >
            {col.elements.length === 0 ? (
              <span className="text-xs text-gray-400">
                Column {i + 1}
              </span>
            ) : (
              <span className="text-xs text-gray-500">
                {col.elements.length} element{col.elements.length !== 1 && "s"}
              </span>
            )}
          </div>
        ))}
      </div>
      {selected && (
        <div className="absolute -top-3 left-2 rounded bg-indigo-600 px-2 py-0.5 text-[10px] font-medium text-white">
          Columns
        </div>
      )}
    </div>
  );
}
