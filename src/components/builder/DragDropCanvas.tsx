"use client";

import { useCallback, useState, useRef } from "react";
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
  onDeleteElement?: () => void;
  onDuplicateElement?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
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

function renderElement(
  el: EmailElement,
  selected: boolean,
  onSelect: () => void,
  onChange: (el: EmailElement) => void,
) {
  const props = { selected, onSelect };
  const changeFn = onChange as (el: EmailElement) => void;

  switch (el.type) {
    case "text":
      return <TextBlock element={el} onChange={changeFn} {...props} />;
    case "heading":
      return <HeadingBlock element={el} onChange={changeFn} {...props} />;
    case "image":
      return <ImageBlock element={el} onChange={changeFn} {...props} />;
    case "button":
      return <ButtonBlock element={el} onChange={changeFn} {...props} />;
    case "divider":
      return <DividerBlock element={el} {...props} />;
    case "spacer":
      return <SpacerBlock element={el} {...props} />;
    case "video":
      return <VideoBlock element={el} onChange={changeFn} {...props} />;
    case "gif":
      return <GifBlock element={el} onChange={changeFn} {...props} />;
    case "timer":
      return <TimerBlock element={el} onChange={changeFn} {...props} />;
    case "social":
      return <SocialBlock element={el} onChange={changeFn} {...props} />;
    case "columns":
      return <ColumnsBlock element={el} onChange={changeFn} {...props} />;
    case "html":
      return <HtmlBlock element={el} onChange={changeFn} {...props} />;
    case "footer":
      return <FooterBlock element={el} onChange={changeFn} {...props} />;
    case "header":
      return <HeaderBlock element={el} onChange={changeFn} {...props} />;
  }
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
  const dragSourceRef = useRef<number | null>(null);

  const handleDragOver = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.dropEffect =
        dragSourceRef.current !== null ? "move" : "copy";
      setDragOverIndex(index);
    },
    [],
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

      const reorderData = e.dataTransfer.getData(
        "application/x-canvas-reorder",
      );
      if (reorderData) {
        const sourceIndex = parseInt(reorderData, 10);
        if (!isNaN(sourceIndex) && sourceIndex !== index) {
          const newElements = [...elements];
          const [moved] = newElements.splice(sourceIndex, 1);
          newElements.splice(
            index > sourceIndex ? index - 1 : index,
            0,
            moved,
          );
          onReorderElements(newElements);
        }
        dragSourceRef.current = null;
        setIsDragging(false);
        return;
      }

      const elementType = e.dataTransfer.getData("elementType") as ElementType;
      if (elementType) {
        onAddElement(elementType, index);
      }
    },
    [elements, onAddElement, onReorderElements],
  );

  const handleCanvasDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOverIndex(null);
      setIsDragging(false);
      dragSourceRef.current = null;

      const elementType = e.dataTransfer.getData("elementType") as ElementType;
      if (elementType) {
        onAddElement(elementType);
      }
    },
    [onAddElement],
  );

  const selectedElement = selectedId
    ? elements.find((el) => el.id === selectedId)
    : null;

  return (
    <div
      className="flex-1 overflow-y-auto mk-canvas-bg p-8"
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect =
          dragSourceRef.current !== null ? "move" : "copy";
      }}
      onDrop={handleCanvasDrop}
      onClick={() => onSelectElement(null)}
    >
      <div className="mx-auto max-w-[640px]">
        {/* Email container */}
        <div className="rounded-2xl bg-mk-surface shadow-xl overflow-hidden ring-1 ring-mk-border">
          {/* Browser chrome */}
          <div className="flex items-center gap-2 border-b border-mk-border bg-gradient-to-r from-gray-50 to-mk-primary-50/30 px-4 py-2">
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-[#FF605C]" />
              <div className="h-2.5 w-2.5 rounded-full bg-[#FFBD44]" />
              <div className="h-2.5 w-2.5 rounded-full bg-[#00CA4E]" />
            </div>
            <div className="ml-3 flex-1 rounded-md bg-white/60 px-3 py-0.5 text-center">
              <span className="text-[10px] text-mk-text-muted font-mono">
                email-preview — 600px
              </span>
            </div>
          </div>

          <div className="p-6 min-h-[500px]">
            {elements.length === 0 ? (
              /* Empty state */
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="mb-5 relative">
                  <div className="h-20 w-20 rounded-2xl bg-mk-primary-50 flex items-center justify-center">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--mk-primary)" strokeWidth="1.5">
                      <path d="M12 5v14m-7-7h14" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-mk-accent flex items-center justify-center">
                    <span className="text-[8px] text-white font-bold">!</span>
                  </div>
                </div>
                <p className="text-sm font-semibold text-mk-text">
                  Drop blocks here to start
                </p>
                <p className="mt-1.5 text-xs text-mk-text-muted max-w-xs">
                  Drag blocks from the sidebar, or click the quick-add buttons below
                </p>

                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {(
                    [
                      "header",
                      "heading",
                      "text",
                      "image",
                      "button",
                      "footer",
                    ] as ElementType[]
                  ).map((type) => (
                    <button
                      key={type}
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddElement(type);
                      }}
                      className="rounded-lg border border-mk-border bg-white px-3 py-1.5 text-xs font-medium text-mk-text-secondary hover:border-mk-primary hover:bg-mk-primary-50 hover:text-mk-primary transition-all"
                    >
                      + {TYPE_LABELS[type]}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                {elements.map((el, index) => (
                  <div key={el.id}>
                    {/* Drop zone */}
                    <div
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, index)}
                      className={`transition-all rounded-lg ${
                        dragOverIndex === index
                          ? "h-4 bg-mk-primary-100 border-2 border-dashed border-mk-primary my-1 mk-drop-zone-active"
                          : isDragging
                            ? "h-3 border-2 border-transparent my-0"
                            : "h-0.5"
                      }`}
                    />

                    {/* Element wrapper */}
                    <div
                      className={`group relative mk-element rounded-lg transition-all ${
                        selectedId === el.id ? "mk-element-selected" : ""
                      } ${dragSourceRef.current === index ? "mk-dragging" : ""}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Drag handle */}
                      <div
                        draggable
                        onDragStart={(e) => {
                          dragSourceRef.current = index;
                          setIsDragging(true);
                          e.dataTransfer.setData(
                            "application/x-canvas-reorder",
                            String(index),
                          );
                          e.dataTransfer.effectAllowed = "move";
                          if (e.currentTarget.parentElement) {
                            e.dataTransfer.setDragImage(
                              e.currentTarget.parentElement,
                              50,
                              20,
                            );
                          }
                        }}
                        onDragEnd={() => {
                          dragSourceRef.current = null;
                          setIsDragging(false);
                          setDragOverIndex(null);
                        }}
                        className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 flex h-8 w-5 cursor-grab items-center justify-center rounded-md bg-mk-sidebar-bg/90 shadow-md opacity-0 group-hover:opacity-100 transition-opacity active:cursor-grabbing"
                        title="Drag to reorder"
                      >
                        <svg
                          width="8"
                          height="14"
                          viewBox="0 0 10 14"
                          fill="white"
                          opacity="0.7"
                        >
                          <circle cx="3" cy="2" r="1.2" />
                          <circle cx="7" cy="2" r="1.2" />
                          <circle cx="3" cy="7" r="1.2" />
                          <circle cx="7" cy="7" r="1.2" />
                          <circle cx="3" cy="12" r="1.2" />
                          <circle cx="7" cy="12" r="1.2" />
                        </svg>
                      </div>

                      {/* Inline floating toolbar — visible when selected */}
                      {selectedId === el.id && selectedElement && (
                        <div className="mk-inline-toolbar">
                          <span className="px-2 text-[10px] font-semibold text-mk-primary uppercase tracking-wider">
                            {TYPE_LABELS[el.type]}
                          </span>
                          <div className="mk-tb-divider" />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onMoveUp?.();
                            }}
                            title="Move up (Ctrl+↑)"
                          >
                            ↑
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onMoveDown?.();
                            }}
                            title="Move down (Ctrl+↓)"
                          >
                            ↓
                          </button>
                          <div className="mk-tb-divider" />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDuplicateElement?.();
                            }}
                            title="Duplicate (Ctrl+D)"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="9" y="9" width="13" height="13" rx="2" />
                              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                            </svg>
                          </button>
                          <button
                            className="mk-tb-danger"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteElement?.();
                            }}
                            title="Delete (Del)"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14" />
                            </svg>
                          </button>
                        </div>
                      )}

                      {renderElement(
                        el,
                        selectedId === el.id,
                        () => onSelectElement(el.id),
                        onUpdateElement,
                      )}
                    </div>
                  </div>
                ))}

                {/* Final drop zone */}
                <div
                  onDragOver={(e) => handleDragOver(e, elements.length)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, elements.length)}
                  className={`transition-all rounded-lg ${
                    dragOverIndex === elements.length
                      ? "h-4 bg-mk-primary-100 border-2 border-dashed border-mk-primary mt-1 mk-drop-zone-active"
                      : isDragging
                        ? "h-8 border-2 border-dashed border-mk-border mt-1 rounded-lg"
                        : "h-4"
                  }`}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
