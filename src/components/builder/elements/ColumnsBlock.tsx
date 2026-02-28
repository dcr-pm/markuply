"use client";

import { useState } from "react";
import type { ColumnsElement, EmailElement, ColumnConfig } from "@/types/builder";
import { promptToElements, PROMPT_SUGGESTIONS } from "@/lib/prompt-to-elements";

interface ColumnsBlockProps {
  element: ColumnsElement;
  selected: boolean;
  onSelect: () => void;
  onChange: (el: ColumnsElement) => void;
}

function ColumnEditor({
  column,
  columnIndex,
  onChange,
}: {
  column: ColumnConfig;
  columnIndex: number;
  onChange: (col: ColumnConfig) => void;
}) {
  const [prompt, setPrompt] = useState("");
  const [showPrompt, setShowPrompt] = useState(false);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    const elements = promptToElements(prompt.trim());
    onChange({ ...column, elements: [...column.elements, ...elements] });
    setPrompt("");
  };

  const handleSuggestion = (suggestionPrompt: string) => {
    const elements = promptToElements(suggestionPrompt);
    onChange({ ...column, elements: [...column.elements, ...elements] });
  };

  const handleDeleteElement = (id: string) => {
    onChange({ ...column, elements: column.elements.filter((el) => el.id !== id) });
  };

  const handleMoveElement = (id: string, direction: "up" | "down") => {
    const idx = column.elements.findIndex((el) => el.id === id);
    if (idx === -1) return;
    if (direction === "up" && idx === 0) return;
    if (direction === "down" && idx === column.elements.length - 1) return;
    const newElements = [...column.elements];
    const swap = direction === "up" ? idx - 1 : idx + 1;
    [newElements[idx], newElements[swap]] = [newElements[swap], newElements[idx]];
    onChange({ ...column, elements: newElements });
  };

  return (
    <div className="flex flex-col gap-1.5 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50/50 p-2 min-h-[80px]"
      style={{ width: column.width }}
    >
      <div className="text-[10px] font-semibold text-gray-400 uppercase text-center">
        Col {columnIndex + 1}
      </div>

      {/* Existing elements in this column */}
      {column.elements.map((el, idx) => (
        <div
          key={el.id}
          className="group relative rounded-md border border-gray-200 bg-white p-2 text-xs"
        >
          <div className="flex items-center gap-1.5">
            <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-[9px] font-bold text-indigo-600 uppercase">
              {el.type}
            </span>
            <span className="flex-1 truncate text-gray-600">
              {getElementPreview(el)}
            </span>
            <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => { e.stopPropagation(); handleMoveElement(el.id, "up"); }}
                disabled={idx === 0}
                className="rounded p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-30"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 15l-6-6-6 6" /></svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleMoveElement(el.id, "down"); }}
                disabled={idx === column.elements.length - 1}
                className="rounded p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-30"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleDeleteElement(el.id); }}
                className="rounded p-0.5 text-gray-400 hover:text-red-500"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* AI Prompt bar for this column */}
      {showPrompt ? (
        <div className="rounded-lg border border-indigo-200 bg-white p-2" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-1.5">
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleGenerate();
                if (e.key === "Escape") setShowPrompt(false);
              }}
              placeholder='e.g. "flash sale timer"'
              className="flex-1 border-0 bg-transparent text-xs text-gray-800 placeholder-gray-400 focus:outline-none"
              autoFocus
            />
            {prompt.trim() && (
              <button
                onClick={handleGenerate}
                className="shrink-0 rounded bg-indigo-600 px-2 py-1 text-[10px] font-medium text-white hover:bg-indigo-700"
              >
                Add
              </button>
            )}
            <button
              onClick={() => setShowPrompt(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {PROMPT_SUGGESTIONS.slice(0, 8).map((s) => (
              <button
                key={s.label}
                onClick={() => handleSuggestion(s.prompt)}
                className="rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-[9px] font-medium text-gray-500 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
              >
                {s.icon} {s.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowPrompt(true);
          }}
          className="flex items-center justify-center gap-1 rounded-md border border-dashed border-gray-300 px-2 py-1.5 text-[10px] text-gray-400 hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 3v3m6.366-.366-2.12 2.12M21 12h-3m.366 6.366-2.12-2.12M12 21v-3m-6.366.366 2.12-2.12M3 12h3m-.366-6.366 2.12 2.12" />
          </svg>
          AI Prompt
        </button>
      )}
    </div>
  );
}

function getElementPreview(el: EmailElement): string {
  switch (el.type) {
    case "text":
      return el.content.slice(0, 40);
    case "heading":
      return el.content.slice(0, 40);
    case "button":
      return el.text;
    case "image":
      return el.alt || "Image";
    case "timer":
      return el.label;
    case "divider":
      return "———";
    case "spacer":
      return el.height;
    case "social":
      return `${el.links.length} links`;
    case "video":
      return el.alt || "Video";
    case "gif":
      return el.alt || "GIF";
    default:
      return el.type;
  }
}

export function ColumnsBlock({ element, selected, onSelect, onChange }: ColumnsBlockProps) {
  const handleColumnChange = (index: number, col: ColumnConfig) => {
    const newColumns = [...element.columns];
    newColumns[index] = col;
    onChange({ ...element, columns: newColumns });
  };

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
          <ColumnEditor
            key={i}
            column={col}
            columnIndex={i}
            onChange={(updated) => handleColumnChange(i, updated)}
          />
        ))}
      </div>
      {selected && (
        <div className="absolute -top-3 left-2 rounded bg-indigo-600 px-2 py-0.5 text-[10px] font-medium text-white">
          {element.columns.length}-Column Layout · AI Prompt in each column
        </div>
      )}
    </div>
  );
}
