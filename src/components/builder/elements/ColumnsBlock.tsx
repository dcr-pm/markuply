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
  allColumns,
  onMoveElementToColumn,
}: {
  column: ColumnConfig;
  columnIndex: number;
  onChange: (col: ColumnConfig) => void;
  allColumns: ColumnConfig[];
  onMoveElementToColumn: (elementId: string, fromCol: number, toCol: number, toIndex: number) => void;
}) {
  const [prompt, setPrompt] = useState("");
  const [showPrompt, setShowPrompt] = useState(false);
  const [dropIndex, setDropIndex] = useState<number | null>(null);

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

  const handleColumnDragOver = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
    setDropIndex(targetIdx);
  };

  const handleColumnDrop = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDropIndex(null);

    const data = e.dataTransfer.getData("application/x-column-element");
    if (!data) return;

    const { elementId, sourceColumnIndex } = JSON.parse(data);

    if (sourceColumnIndex === columnIndex) {
      // Reorder within same column
      const currentIdx = column.elements.findIndex((el) => el.id === elementId);
      if (currentIdx === -1 || currentIdx === targetIdx) return;
      const newElements = [...column.elements];
      const [moved] = newElements.splice(currentIdx, 1);
      newElements.splice(targetIdx > currentIdx ? targetIdx - 1 : targetIdx, 0, moved);
      onChange({ ...column, elements: newElements });
    } else {
      // Move between columns
      onMoveElementToColumn(elementId, sourceColumnIndex, columnIndex, targetIdx);
    }
  };

  return (
    <div
      className="flex flex-col gap-1.5 rounded-lg border-2 border-dashed border-mk-border bg-mk-bg/50 p-2 min-h-[80px]"
      style={{ width: column.width }}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = "move";
        if (dropIndex === null) setDropIndex(column.elements.length);
      }}
      onDragLeave={(e) => {
        e.stopPropagation();
        setDropIndex(null);
      }}
      onDrop={(e) => handleColumnDrop(e, column.elements.length)}
    >
      <div className="text-[10px] font-semibold text-mk-text-muted uppercase text-center">
        Col {columnIndex + 1}
      </div>

      {/* Existing elements in this column — with drag-and-drop */}
      {column.elements.map((el, idx) => (
        <div key={el.id}>
          {/* Drop zone above element */}
          <div
            onDragOver={(e) => handleColumnDragOver(e, idx)}
            onDrop={(e) => handleColumnDrop(e, idx)}
            className={`transition-all rounded ${
              dropIndex === idx
                ? "min-h-[6px] bg-mk-primary/20 border border-dashed border-mk-primary my-0.5"
                : "min-h-[3px]"
            }`}
          />
          <div
            className="group relative rounded-md border border-mk-border bg-white p-2 text-xs"
            draggable
            onDragStart={(e) => {
              e.stopPropagation();
              e.dataTransfer.setData("application/x-column-element", JSON.stringify({
                elementId: el.id,
                sourceColumnIndex: columnIndex,
              }));
              e.dataTransfer.effectAllowed = "move";
              (e.currentTarget as HTMLElement).style.opacity = "0.4";
            }}
            onDragEnd={(e) => {
              (e.currentTarget as HTMLElement).style.opacity = "1";
              setDropIndex(null);
            }}
          >
            <div className="flex items-center gap-1.5">
              {/* Drag handle */}
              <div className="cursor-grab active:cursor-grabbing text-mk-text-muted hover:text-mk-text-secondary shrink-0" title="Drag to reorder">
                <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="9" cy="5" r="1.5" /><circle cx="15" cy="5" r="1.5" />
                  <circle cx="9" cy="12" r="1.5" /><circle cx="15" cy="12" r="1.5" />
                  <circle cx="9" cy="19" r="1.5" /><circle cx="15" cy="19" r="1.5" />
                </svg>
              </div>
              <span className="rounded bg-mk-primary-50 px-1.5 py-0.5 text-[9px] font-bold text-mk-primary uppercase">
                {el.type}
              </span>
              <span className="flex-1 truncate text-mk-text-secondary">
                {getElementPreview(el)}
              </span>
              <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => { e.stopPropagation(); handleMoveElement(el.id, "up"); }}
                  disabled={idx === 0}
                  className="rounded p-0.5 text-mk-text-muted hover:text-mk-text disabled:opacity-30"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 15l-6-6-6 6" /></svg>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleMoveElement(el.id, "down"); }}
                  disabled={idx === column.elements.length - 1}
                  className="rounded p-0.5 text-mk-text-muted hover:text-mk-text disabled:opacity-30"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDeleteElement(el.id); }}
                  className="rounded p-0.5 text-mk-text-muted hover:text-mk-accent"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Final drop zone */}
      {column.elements.length > 0 && (
        <div
          onDragOver={(e) => handleColumnDragOver(e, column.elements.length)}
          onDrop={(e) => handleColumnDrop(e, column.elements.length)}
          className={`transition-all rounded ${
            dropIndex === column.elements.length
              ? "min-h-[6px] bg-mk-primary/20 border border-dashed border-mk-primary my-0.5"
              : "min-h-[3px]"
          }`}
        />
      )}

      {/* AI Prompt bar for this column */}
      {showPrompt ? (
        <div className="rounded-lg border border-mk-primary/30 bg-white p-2" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-1.5">
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleGenerate();
                if (e.key === "Escape") setShowPrompt(false);
              }}
              placeholder='e.g. "flash sale timer"'
              className="flex-1 border-0 bg-transparent text-xs text-mk-text placeholder-mk-text-muted focus:outline-none"
              autoFocus
            />
            {prompt.trim() && (
              <button
                onClick={handleGenerate}
                className="shrink-0 rounded bg-mk-primary px-2 py-1 text-[10px] font-medium text-white hover:bg-mk-primary-hover"
              >
                Add
              </button>
            )}
            <button
              onClick={() => setShowPrompt(false)}
              className="text-mk-text-muted hover:text-mk-text"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {PROMPT_SUGGESTIONS.slice(0, 8).map((s) => (
              <button
                key={s.label}
                onClick={() => handleSuggestion(s.prompt)}
                className="rounded-full border border-mk-border bg-mk-bg px-2 py-0.5 text-[9px] font-medium text-mk-text-secondary hover:border-mk-primary/40 hover:bg-mk-primary-50 hover:text-mk-primary transition-colors"
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
          className="flex items-center justify-center gap-1 rounded-md border border-dashed border-mk-border px-2 py-1.5 text-[10px] text-mk-text-muted hover:border-mk-primary hover:bg-mk-primary-50 hover:text-mk-primary transition-colors"
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
    case "footer":
      return `${el.variant} footer`;
    case "header":
      return `${el.variant} header`;
    default:
      return el.type;
  }
}

export function ColumnsBlock({ element, onSelect, onChange }: ColumnsBlockProps) {
  const handleColumnChange = (index: number, col: ColumnConfig) => {
    const newColumns = [...element.columns];
    newColumns[index] = col;
    onChange({ ...element, columns: newColumns });
  };

  const handleMoveElementToColumn = (
    elementId: string,
    fromCol: number,
    toCol: number,
    toIndex: number,
  ) => {
    const newColumns = element.columns.map((col) => ({
      ...col,
      elements: [...col.elements],
    }));

    // Find and remove from source column
    const sourceElements = newColumns[fromCol].elements;
    const elIdx = sourceElements.findIndex((el) => el.id === elementId);
    if (elIdx === -1) return;
    const [moved] = sourceElements.splice(elIdx, 1);

    // Insert into target column
    newColumns[toCol].elements.splice(toIndex, 0, moved);

    onChange({ ...element, columns: newColumns });
  };

  return (
    <div onClick={onSelect} className="cursor-pointer rounded-lg">
      <div
        className="flex gap-2 flex-wrap"
        style={{
          padding: element.styles.padding || "10px 0",
          backgroundColor: element.styles.backgroundColor || "transparent",
        }}
      >
        {element.columns.map((col, i) => (
          <ColumnEditor
            key={i}
            column={col}
            columnIndex={i}
            onChange={(updated) => handleColumnChange(i, updated)}
            allColumns={element.columns}
            onMoveElementToColumn={handleMoveElementToColumn}
          />
        ))}
      </div>
    </div>
  );
}
