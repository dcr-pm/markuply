"use client";

import { useState } from "react";
import type { HtmlElement } from "@/types/builder";

interface HtmlBlockProps {
  element: HtmlElement;
  selected: boolean;
  onSelect: () => void;
  onChange: (el: HtmlElement) => void;
}

export function HtmlBlock({ element, selected, onSelect, onChange }: HtmlBlockProps) {
  const [editing, setEditing] = useState(false);
  const [code, setCode] = useState(element.rawHtml);

  const handleSave = () => {
    onChange({ ...element, rawHtml: code });
    setEditing(false);
  };

  return (
    <div
      onClick={onSelect}
      className={`group relative cursor-pointer rounded-lg transition-all ${
        selected ? "ring-2 ring-indigo-500 ring-offset-2" : "hover:ring-2 hover:ring-gray-300"
      }`}
    >
      {editing ? (
        <div className="p-2">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-gray-900 p-3 font-mono text-sm text-green-400 focus:border-indigo-500 focus:outline-none"
            rows={6}
          />
          <div className="mt-2 flex gap-2">
            <button
              onClick={handleSave}
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="rounded-lg bg-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div
          className="min-h-[40px]"
          dangerouslySetInnerHTML={{ __html: element.rawHtml }}
          onDoubleClick={() => selected && setEditing(true)}
        />
      )}
      {selected && (
        <div className="absolute -top-3 left-2 rounded bg-indigo-600 px-2 py-0.5 text-[10px] font-medium text-white">
          HTML {!editing && "· double-click to edit"}
        </div>
      )}
    </div>
  );
}
