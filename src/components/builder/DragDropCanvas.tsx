"use client";

import { useCallback, useState } from "react";
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
  const [dragSourceIndex, setDragSourceIndex] = useState<number | null>(null);

  const handleDragOver = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = dragSourceIndex !== null ? "move" : "copy";
      setDragOverIndex(index);
    },
    [dragSourceIndex],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault();
      setDragOverIndex(null);

      // Check if it's an element from the sidebar
      const elementType = e.dataTransfer.getData("elementType") as ElementType;
      if (elementType) {
        onAddElement(elementType, index);
        return;
      }

      // Reorder within the canvas
      if (dragSourceIndex !== null && dragSourceIndex !== index) {
        const newElements = [...elements];
        const [moved] = newElements.splice(dragSourceIndex, 1);
        newElements.splice(
          index > dragSourceIndex ? index - 1 : index,
          0,
          moved,
        );
        onReorderElements(newElements);
      }
      setDragSourceIndex(null);
    },
    [dragSourceIndex, elements, onAddElement, onReorderElements],
  );

  const handleCanvasDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOverIndex(null);
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
        e.dataTransfer.dropEffect = "copy";
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
              <div className="space-y-1">
                {elements.map((el, index) => (
                  <div key={el.id}>
                    {/* Drop zone above */}
                    <div
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDrop={(e) => handleDrop(e, index)}
                      className={`transition-all ${
                        dragOverIndex === index
                          ? "h-3 bg-indigo-100 border-2 border-dashed border-indigo-400 rounded-lg my-1"
                          : "h-0"
                      }`}
                    />

                    {/* Element wrapper for drag-to-reorder */}
                    <div
                      draggable
                      onDragStart={(e) => {
                        e.stopPropagation();
                        setDragSourceIndex(index);
                        e.dataTransfer.effectAllowed = "move";
                      }}
                      onDragEnd={() => {
                        setDragSourceIndex(null);
                        setDragOverIndex(null);
                      }}
                      className={`relative transition-opacity ${
                        dragSourceIndex === index ? "opacity-30" : ""
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
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
                  onDrop={(e) => handleDrop(e, elements.length)}
                  className={`transition-all ${
                    dragOverIndex === elements.length
                      ? "h-3 bg-indigo-100 border-2 border-dashed border-indigo-400 rounded-lg mt-1"
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
