"use client";

import { useCallback, useState } from "react";
import type { EmailElement, ElementType } from "@/types/builder";
import { TextBlock } from "./elements/TextBlock";
import { HeadingBlock } from "./elements/HeadingBlock";
import { ImageBlock } from "./elements/ImageBlock";
import { ButtonBlock } from "./elements/ButtonBlock";
import { DividerBlock } from "./elements/DividerBlock";
import { SpacerBlock } from "./elements/SpacerBlock";
import { VideoBlock } from "./elements/VideoBlock";
import { GifBlock } from "./elements/GifBlock";
import { TimerBlock } from "./elements/TimerBlock";
import { SocialBlock } from "./elements/SocialBlock";
import { ColumnsBlock } from "./elements/ColumnsBlock";
import { HtmlBlock } from "./elements/HtmlBlock";
import { FooterBlock } from "./elements/FooterBlock";
import { HeaderBlock } from "./elements/HeaderBlock";

interface DragDropCanvasProps {
  elements: EmailElement[];
  selectedId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (el: EmailElement) => void;
  onReorderElements: (elements: EmailElement[]) => void;
  onAddElement: (type: ElementType, index?: number) => void;
  onDeleteElement?: (id: string) => void;
  onDuplicateElement?: (id: string) => void;
  onMoveUp?: (id: string) => void;
  onMoveDown?: (id: string) => void;
}

const TYPE_LABELS: Record<string, string> = {
  text: "Text",
  heading: "Heading",
  image: "Image",
  button: "Button",
  divider: "Divider",
  spacer: "Spacer",
  video: "Video",
  gif: "GIF",
  timer: "Timer",
  social: "Social",
  columns: "Columns",
  html: "HTML",
  footer: "Footer",
  header: "Header",
};

const QUICK_ADD_TYPES: { type: ElementType; icon: string; label: string }[] = [
  { type: "heading", icon: "H", label: "Heading" },
  { type: "text", icon: "T", label: "Text" },
  { type: "image", icon: "◻", label: "Image" },
  { type: "button", icon: "▶", label: "Button" },
  { type: "divider", icon: "—", label: "Divider" },
  { type: "spacer", icon: "↕", label: "Spacer" },
];

function renderElement(
  el: EmailElement,
  selected: boolean,
  onSelect: () => void,
  onChange: (el: EmailElement) => void,
) {
  const props = { selected, onSelect };

  switch (el.type) {
    case "text":
      return <TextBlock element={el} onChange={onChange as (el: EmailElement) => void} {...props} />;
    case "heading":
      return <HeadingBlock element={el} onChange={onChange as (el: EmailElement) => void} {...props} />;
    case "image":
      return <ImageBlock element={el} onChange={onChange as (el: EmailElement) => void} {...props} />;
    case "button":
      return <ButtonBlock element={el} onChange={onChange as (el: EmailElement) => void} {...props} />;
    case "divider":
      return <DividerBlock element={el} {...props} />;
    case "spacer":
      return <SpacerBlock element={el} {...props} />;
    case "video":
      return <VideoBlock element={el} onChange={onChange as (el: EmailElement) => void} {...props} />;
    case "gif":
      return <GifBlock element={el} onChange={onChange as (el: EmailElement) => void} {...props} />;
    case "timer":
      return <TimerBlock element={el} onChange={onChange as (el: EmailElement) => void} {...props} />;
    case "social":
      return <SocialBlock element={el} onChange={onChange as (el: EmailElement) => void} {...props} />;
    case "columns":
      return <ColumnsBlock element={el} onChange={onChange as (el: EmailElement) => void} {...props} />;
    case "html":
      return <HtmlBlock element={el} onChange={onChange as (el: EmailElement) => void} {...props} />;
    case "footer":
      return <FooterBlock element={el} onChange={onChange as (el: EmailElement) => void} {...props} />;
    case "header":
      return <HeaderBlock element={el} onChange={onChange as (el: EmailElement) => void} {...props} />;
  }
}

/* ── Add Block Button (appears between elements) ── */
function AddBlockButton({ onAdd }: { onAdd: (type: ElementType) => void }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative flex items-center justify-center py-0.5 group/add">
      {/* Line + button */}
      <div className="absolute inset-x-0 top-1/2 h-px bg-transparent group-hover/add:bg-violet-200 transition-colors" />
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-10 flex h-5 w-5 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-400 opacity-0 group-hover/add:opacity-100 hover:border-violet-400 hover:text-violet-600 hover:bg-violet-50 hover:shadow-sm transition-all text-xs"
      >
        +
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-1/2 -translate-x-1/2 z-30 mt-1 p-1.5 bg-white rounded-xl border border-slate-200 shadow-lg animate-scaleIn min-w-[180px]">
            <div className="grid grid-cols-3 gap-1">
              {QUICK_ADD_TYPES.map(({ type, icon, label }) => (
                <button
                  key={type}
                  onClick={() => {
                    onAdd(type);
                    setIsOpen(false);
                  }}
                  className="flex flex-col items-center gap-0.5 rounded-lg p-2 text-center hover:bg-violet-50 hover:text-violet-700"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 text-xs">{icon}</span>
                  <span className="text-[9px] font-medium text-slate-600">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ── Inline Floating Toolbar ── */
function InlineToolbar({
  element,
  index,
  total,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
}: {
  element: EmailElement;
  index: number;
  total: number;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  return (
    <div className="element-toolbar absolute -top-8 left-0 right-0 z-20 flex items-center justify-between px-1">
      {/* Type label */}
      <span className="rounded-md bg-violet-600 px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm">
        {TYPE_LABELS[element.type] || element.type}
      </span>

      {/* Action buttons */}
      <div className="flex items-center gap-0.5 rounded-lg bg-white border border-slate-200 shadow-md p-0.5">
        <button
          onClick={(e) => { e.stopPropagation(); onMoveUp(); }}
          disabled={index === 0}
          className="flex h-6 w-6 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
          title="Move up"
        >
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onMoveDown(); }}
          disabled={index === total - 1}
          className="flex h-6 w-6 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
          title="Move down"
        >
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </button>
        <div className="h-4 w-px bg-slate-200" />
        <button
          onClick={(e) => { e.stopPropagation(); onDuplicate(); }}
          className="flex h-6 w-6 items-center justify-center rounded-md text-slate-500 hover:bg-violet-50 hover:text-violet-600"
          title="Duplicate"
        >
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
        </button>
        <div className="h-4 w-px bg-slate-200" />
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="flex h-6 w-6 items-center justify-center rounded-md text-slate-500 hover:bg-red-50 hover:text-red-500"
          title="Delete"
        >
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>
      </div>
    </div>
  );
}

export function DragDropCanvas({
  elements,
  selectedId,
  onSelectElement,
  onUpdateElement,
  onReorderElements,
  onAddElement,
  onDeleteElement,
  onDuplicateElement,
  onMoveUp,
  onMoveDown,
}: DragDropCanvasProps) {
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragSourceIndex, setDragSourceIndex] = useState<number | null>(null);

  const handleDragOver = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.dropEffect = isDragging ? "move" : "copy";
      setDragOverIndex(index);
    },
    [isDragging],
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.stopPropagation();
    const related = e.relatedTarget as HTMLElement;
    if (!e.currentTarget.contains(related)) {
      setDragOverIndex(null);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOverIndex(null);

      const reorderData = e.dataTransfer.getData("application/x-canvas-reorder");
      if (reorderData) {
        const sourceIndex = parseInt(reorderData, 10);
        if (!isNaN(sourceIndex) && sourceIndex !== index) {
          const newElements = [...elements];
          const [moved] = newElements.splice(sourceIndex, 1);
          newElements.splice(index > sourceIndex ? index - 1 : index, 0, moved);
          onReorderElements(newElements);
        }
        setDragSourceIndex(null);
        setIsDragging(false);
        return;
      }

      const elementType = e.dataTransfer.getData("elementType") as ElementType;
      if (elementType) {
        onAddElement(elementType, index);
        return;
      }
    },
    [elements, onAddElement, onReorderElements],
  );

  const handleCanvasDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOverIndex(null);
      setIsDragging(false);
      setDragSourceIndex(null);

      const elementType = e.dataTransfer.getData("elementType") as ElementType;
      if (elementType) {
        onAddElement(elementType);
      }
    },
    [onAddElement],
  );

  return (
    <div
      className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-50 to-slate-100/80 p-6"
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = isDragging ? "move" : "copy";
      }}
      onDrop={handleCanvasDrop}
      onClick={() => onSelectElement(null)}
    >
      <div className="mx-auto max-w-[640px]">
        {/* Email container */}
        <div className="rounded-2xl bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden border border-slate-200/60">
          {/* Browser chrome bar */}
          <div className="flex items-center gap-2 border-b border-slate-200/80 bg-gradient-to-b from-slate-50 to-slate-100/50 px-4 py-2.5">
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
              <div className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
            </div>
            <div className="ml-2 flex-1 rounded-md bg-white/60 border border-slate-200/80 py-1 px-3">
              <span className="text-[10px] text-slate-400 font-mono">email-preview — 600px</span>
            </div>
          </div>

          <div className="p-6 min-h-[400px]">
            {elements.length === 0 ? (
              /* Empty state */
              <div className="flex flex-col items-center justify-center py-20 text-center animate-fadeInUp">
                <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100">
                  <svg className="h-8 w-8 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-slate-800">Start building your email</h3>
                <p className="mt-1.5 text-sm text-slate-500 max-w-[280px]">
                  Drag elements from the sidebar or click below to add your first block
                </p>

                {/* Quick-add grid */}
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {(["heading", "text", "image", "button", "columns", "header"] as ElementType[]).map(
                    (type) => (
                      <button
                        key={type}
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddElement(type);
                        }}
                        className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-600 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 hover:shadow-sm active:scale-95 transition-all"
                      >
                        + {TYPE_LABELS[type]}
                      </button>
                    ),
                  )}
                </div>

                {/* AI hint */}
                <div className="mt-6 rounded-xl bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-100 px-4 py-3 max-w-[320px]">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-violet-600 text-[9px] text-white font-bold">AI</span>
                    <span className="text-xs text-violet-800">Use the AI assistant in the sidebar to generate blocks from a description</span>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {elements.map((el, index) => (
                  <div key={el.id}>
                    {/* Drop zone above element */}
                    <div
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, index)}
                      className={`transition-all rounded-lg ${
                        dragOverIndex === index
                          ? "h-5 bg-violet-50 border-2 border-dashed border-violet-400 my-1"
                          : isDragging
                            ? "h-3 border-2 border-transparent my-0"
                            : "h-0"
                      }`}
                    />

                    {/* Add block button between elements */}
                    {!isDragging && index === 0 && (
                      <AddBlockButton onAdd={(type) => onAddElement(type, index)} />
                    )}

                    {/* Element wrapper with inline toolbar */}
                    <div
                      className={`element-wrapper group relative transition-all rounded-lg ${
                        selectedId === el.id
                          ? "selected-ring"
                          : "hover:ring-2 hover:ring-violet-200"
                      } ${dragSourceIndex === index ? "opacity-30" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectElement(el.id);
                      }}
                    >
                      {/* Inline toolbar */}
                      <InlineToolbar
                        element={el}
                        index={index}
                        total={elements.length}
                        onDelete={() => onDeleteElement?.(el.id)}
                        onDuplicate={() => onDuplicateElement?.(el.id)}
                        onMoveUp={() => onMoveUp?.(el.id)}
                        onMoveDown={() => onMoveDown?.(el.id)}
                      />

                      {/* Drag handle */}
                      <div
                        draggable
                        onDragStart={(e) => {
                          setDragSourceIndex(index);
                          setIsDragging(true);
                          e.dataTransfer.setData("application/x-canvas-reorder", String(index));
                          e.dataTransfer.effectAllowed = "move";
                          if (e.currentTarget.parentElement) {
                            e.dataTransfer.setDragImage(e.currentTarget.parentElement, 50, 20);
                          }
                        }}
                        onDragEnd={() => {
                          setDragSourceIndex(null);
                          setIsDragging(false);
                          setDragOverIndex(null);
                        }}
                        className="absolute -left-1 top-1/2 -translate-y-1/2 z-10 flex h-8 w-5 cursor-grab items-center justify-center rounded-md bg-white/90 border border-slate-200 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity active:cursor-grabbing hover:bg-violet-50 hover:border-violet-300"
                        title="Drag to reorder"
                      >
                        <svg width="8" height="14" viewBox="0 0 8 14" fill="currentColor" className="text-slate-400">
                          <circle cx="2" cy="2" r="1" />
                          <circle cx="6" cy="2" r="1" />
                          <circle cx="2" cy="7" r="1" />
                          <circle cx="6" cy="7" r="1" />
                          <circle cx="2" cy="12" r="1" />
                          <circle cx="6" cy="12" r="1" />
                        </svg>
                      </div>

                      {/* Render the actual element */}
                      {renderElement(
                        el,
                        selectedId === el.id,
                        () => onSelectElement(el.id),
                        onUpdateElement,
                      )}
                    </div>

                    {/* Add block button after this element */}
                    {!isDragging && (
                      <AddBlockButton onAdd={(type) => onAddElement(type, index + 1)} />
                    )}
                  </div>
                ))}

                {/* Final drop zone */}
                <div
                  onDragOver={(e) => handleDragOver(e, elements.length)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, elements.length)}
                  className={`transition-all rounded-lg ${
                    dragOverIndex === elements.length
                      ? "h-5 bg-violet-50 border-2 border-dashed border-violet-400 mt-1"
                      : isDragging
                        ? "h-6 border-2 border-transparent mt-0"
                        : "h-2"
                  }`}
                />
              </div>
            )}
          </div>
        </div>

        {/* Block count */}
        <div className="mt-3 flex items-center justify-center gap-2">
          <span className="text-[10px] text-slate-400">
            {elements.length} block{elements.length !== 1 && "s"}
          </span>
          {elements.length > 0 && (
            <>
              <span className="text-slate-300">·</span>
              <span className="text-[10px] text-slate-400">
                Click to select · Drag to reorder
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
