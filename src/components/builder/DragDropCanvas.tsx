"use client";

import { useCallback, useState, useRef } from "react";
import type { EmailElement, ElementType } from "@/types/builder";
import { createDefaultElement } from "@/lib/element-defaults";
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
}

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

export function DragDropCanvas({
  elements,
  selectedId,
  onSelectElement,
  onUpdateElement,
  onReorderElements,
  onAddElement,
}: DragDropCanvasProps) {
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Use a ref for drag source index to avoid stale closure issues
  const dragSourceRef = useRef<number | null>(null);

  const handleDragOver = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.dropEffect = dragSourceRef.current !== null ? "move" : "copy";
      setDragOverIndex(index);
    },
    [],
  );

  const handleDragLeave = useCallback(
    (e: React.DragEvent) => {
      e.stopPropagation();
      // Only clear if we're leaving the drop zone entirely (not entering a child)
      const related = e.relatedTarget as HTMLElement;
      if (!e.currentTarget.contains(related)) {
        setDragOverIndex(null);
      }
    },
    [],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOverIndex(null);

      // Check if it's a reorder drag (from within the canvas)
      const reorderData = e.dataTransfer.getData("application/x-canvas-reorder");
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

      // Check if it's an element from the sidebar
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
      dragSourceRef.current = null;

      const elementType = e.dataTransfer.getData("elementType") as ElementType;
      if (elementType) {
        onAddElement(elementType);
      }
    },
    [onAddElement],
  );

  return (
    <div
      className="flex-1 overflow-y-auto bg-gray-100 p-6"
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = dragSourceRef.current !== null ? "move" : "copy";
      }}
      onDrop={handleCanvasDrop}
      onClick={() => onSelectElement(null)}
    >
      <div className="mx-auto max-w-[640px]">
        {/* Email container */}
        <div className="rounded-xl bg-white shadow-lg overflow-hidden">
          {/* Email header bar */}
          <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-50 px-4 py-2.5">
            <div className="h-3 w-3 rounded-full bg-red-400" />
            <div className="h-3 w-3 rounded-full bg-yellow-400" />
            <div className="h-3 w-3 rounded-full bg-green-400" />
            <span className="ml-2 text-xs text-gray-400">Email Preview — 600px</span>
          </div>

          <div className="p-6 min-h-[400px]">
            {elements.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50">
                  <span className="text-2xl">+</span>
                </div>
                <p className="text-sm font-medium text-gray-500">
                  Drag elements here or click to add
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  Start building your email by adding blocks from the sidebar
                </p>

                {/* Quick-add buttons */}
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {(["heading", "text", "image", "button"] as ElementType[]).map(
                    (type) => (
                      <button
                        key={type}
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddElement(type);
                        }}
                        className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                      >
                        + {type}
                      </button>
                    ),
                  )}
                </div>
              </div>
            ) : (
              <div>
                {elements.map((el, index) => (
                  <div key={el.id}>
                    {/* Drop zone above element — always has hit area */}
                    <div
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, index)}
                      className={`transition-all rounded-lg ${
                        dragOverIndex === index
                          ? "h-4 bg-indigo-100 border-2 border-dashed border-indigo-400 my-1"
                          : isDragging
                            ? "h-3 border-2 border-transparent my-0"
                            : "h-1"
                      }`}
                    />

                    {/* Element wrapper with drag handle */}
                    <div
                      className={`group relative ${
                        dragSourceRef.current === index ? "opacity-30" : ""
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Drag handle overlay — visible on hover */}
                      <div
                        draggable
                        onDragStart={(e) => {
                          dragSourceRef.current = index;
                          setIsDragging(true);
                          e.dataTransfer.setData("application/x-canvas-reorder", String(index));
                          e.dataTransfer.effectAllowed = "move";
                          // Set drag image
                          if (e.currentTarget.parentElement) {
                            e.dataTransfer.setDragImage(e.currentTarget.parentElement, 50, 20);
                          }
                        }}
                        onDragEnd={() => {
                          dragSourceRef.current = null;
                          setIsDragging(false);
                          setDragOverIndex(null);
                        }}
                        className="absolute -left-1 top-1/2 -translate-y-1/2 z-10 flex h-8 w-6 cursor-grab items-center justify-center rounded-md bg-white/90 border border-gray-200 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity active:cursor-grabbing hover:bg-indigo-50 hover:border-indigo-300"
                        title="Drag to reorder"
                      >
                        <svg width="10" height="14" viewBox="0 0 10 14" fill="currentColor" className="text-gray-400">
                          <circle cx="3" cy="2" r="1.2" />
                          <circle cx="7" cy="2" r="1.2" />
                          <circle cx="3" cy="7" r="1.2" />
                          <circle cx="7" cy="7" r="1.2" />
                          <circle cx="3" cy="12" r="1.2" />
                          <circle cx="7" cy="12" r="1.2" />
                        </svg>
                      </div>

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
                      ? "h-4 bg-indigo-100 border-2 border-dashed border-indigo-400 mt-1"
                      : isDragging
                        ? "h-6 border-2 border-transparent mt-0"
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
