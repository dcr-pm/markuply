"use client";

import { ELEMENT_PALETTE } from "@/lib/element-defaults";
import type { ElementType } from "@/types/builder";

interface ElementSidebarProps {
  onAddElement: (type: ElementType) => void;
}

export function ElementSidebar({ onAddElement }: ElementSidebarProps) {
  const handleDragStart = (e: React.DragEvent, type: ElementType) => {
    e.dataTransfer.setData("elementType", type);
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div className="w-64 shrink-0 overflow-y-auto border-r border-gray-200 bg-white">
      <div className="p-4">
        <h3 className="mb-1 text-sm font-semibold text-gray-900">Elements</h3>
        <p className="mb-4 text-xs text-gray-500">
          Drag or click to add blocks
        </p>

        <div className="grid grid-cols-2 gap-2">
          {ELEMENT_PALETTE.map((item) => (
            <button
              key={item.type}
              draggable
              onDragStart={(e) => handleDragStart(e, item.type)}
              onClick={() => onAddElement(item.type)}
              className="group flex flex-col items-center gap-1.5 rounded-xl border border-gray-200 bg-white p-3 text-center transition-all hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-sm active:scale-95 cursor-grab active:cursor-grabbing"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-lg transition-colors group-hover:bg-indigo-100">
                {item.icon}
              </span>
              <span className="text-xs font-medium text-gray-700 group-hover:text-indigo-700">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-200 p-4">
        <h4 className="mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Tips
        </h4>
        <ul className="space-y-1.5 text-xs text-gray-500">
          <li>• Drag elements to the canvas</li>
          <li>• Click an element to select it</li>
          <li>• Drag to reorder blocks</li>
          <li>• Use the property panel to style</li>
        </ul>
      </div>
    </div>
  );
}
