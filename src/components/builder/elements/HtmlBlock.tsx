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
    <div onClick={onSelect} className="cursor-pointer rounded-lg">
      {editing ? (
        <div className="p-2">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full rounded-lg border border-mk-border bg-mk-sidebar-bg p-3 font-mono text-sm text-green-400 focus:border-mk-primary focus:outline-none"
            rows={6}
          />
          <div className="mt-2 flex gap-2">
            <button
              onClick={handleSave}
              className="rounded-lg bg-mk-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-mk-primary-hover"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="rounded-lg bg-mk-bg px-3 py-1.5 text-xs font-medium text-mk-text-secondary hover:bg-mk-border"
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
      {selected && !editing && (
        <div className="absolute bottom-1 right-2 text-[10px] text-mk-text-muted">
          double-click to edit code
        </div>
      )}
    </div>
  );
}
