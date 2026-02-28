"use client";

import { useState } from "react";
import type { EmailElement, ElementStyles } from "@/types/builder";

interface RegionElementEditorProps {
  element: EmailElement;
  onChange: (updated: EmailElement) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
  regionId: string;
  index: number;
}

const FONT_OPTIONS = [
  "Arial, sans-serif",
  "Georgia, serif",
  "Verdana, sans-serif",
  "'Courier New', monospace",
  "Tahoma, sans-serif",
  "'Trebuchet MS', sans-serif",
];

const QUICK_COLORS = [
  "#111827", "#374151", "#6b7280", "#dc2626", "#ea580c",
  "#eab308", "#059669", "#2563eb", "#7c3aed", "#ec4899",
  "#ffffff", "#4F46E5",
];

export function RegionElementEditor({
  element,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  regionId,
  index,
}: RegionElementEditorProps) {
  const [expanded, setExpanded] = useState(false);

  const updateStyle = (key: keyof ElementStyles, value: string) => {
    onChange({ ...element, styles: { ...element.styles, [key]: value } });
  };

  const updateProp = (key: string, value: unknown) => {
    onChange({ ...element, [key]: value } as EmailElement);
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("application/x-region-element", JSON.stringify({
      elementId: element.id,
      sourceRegionId: regionId,
      sourceIndex: index,
    }));
    e.dataTransfer.effectAllowed = "move";
    (e.currentTarget as HTMLElement).style.opacity = "0.4";
  };

  const handleDragEnd = (e: React.DragEvent) => {
    (e.currentTarget as HTMLElement).style.opacity = "1";
  };

  const typeLabel: Record<string, string> = {
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
    html: "HTML",
    footer: "Footer",
    header: "Header",
  };

  return (
    <div
      className="rounded-lg border border-indigo-200 bg-white shadow-sm"
      onClick={(e) => e.stopPropagation()}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {/* Header bar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
        {/* Drag handle */}
        <div className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 shrink-0" title="Drag to move">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="9" cy="5" r="1.5" /><circle cx="15" cy="5" r="1.5" />
            <circle cx="9" cy="12" r="1.5" /><circle cx="15" cy="12" r="1.5" />
            <circle cx="9" cy="19" r="1.5" /><circle cx="15" cy="19" r="1.5" />
          </svg>
        </div>
        <span className="rounded bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 uppercase">
          {typeLabel[element.type] || element.type}
        </span>
        <div className="flex-1" />
        <button
          onClick={onMoveUp}
          disabled={isFirst}
          className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-30"
          title="Move up"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 15l-6-6-6 6" />
          </svg>
        </button>
        <button
          onClick={onMoveDown}
          disabled={isLast}
          className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-30"
          title="Move down"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
        <button
          onClick={() => setExpanded(!expanded)}
          className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          title="Edit"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
        <button
          onClick={onDelete}
          className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
          title="Delete"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Expanded edit panel */}
      {expanded && (
        <div className="space-y-3 p-3">
          {/* Content fields by type */}
          {(element.type === "text" || element.type === "heading") && (
            <div>
              <label className="block text-[10px] font-medium text-gray-500 mb-1 uppercase">Content</label>
              {element.type === "text" ? (
                <textarea
                  value={element.content}
                  onChange={(e) => updateProp("content", e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              ) : (
                <input
                  value={element.content}
                  onChange={(e) => updateProp("content", e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              )}
            </div>
          )}

          {element.type === "heading" && (
            <div>
              <label className="block text-[10px] font-medium text-gray-500 mb-1 uppercase">Level</label>
              <div className="flex gap-1">
                {([1, 2, 3] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => updateProp("level", l)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                      element.level === l
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    H{l}
                  </button>
                ))}
              </div>
            </div>
          )}

          {element.type === "button" && (
            <>
              <div>
                <label className="block text-[10px] font-medium text-gray-500 mb-1 uppercase">Button Text</label>
                <input
                  value={element.text}
                  onChange={(e) => updateProp("text", e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-500 mb-1 uppercase">Link URL</label>
                <input
                  value={element.link}
                  onChange={(e) => updateProp("link", e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-500 mb-1 uppercase">Button Color</label>
                <div className="flex flex-wrap gap-1">
                  {QUICK_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => updateProp("buttonColor", c)}
                      className={`h-6 w-6 rounded-md border-2 transition-transform hover:scale-110 ${
                        element.buttonColor === c ? "border-indigo-500 scale-110" : "border-gray-200"
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {element.type === "image" && (
            <>
              <div>
                <label className="block text-[10px] font-medium text-gray-500 mb-1 uppercase">Image URL</label>
                <input
                  value={element.src}
                  onChange={(e) => updateProp("src", e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-500 mb-1 uppercase">Alt Text</label>
                <input
                  value={element.alt}
                  onChange={(e) => updateProp("alt", e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </>
          )}

          {element.type === "timer" && (
            <>
              <div>
                <label className="block text-[10px] font-medium text-gray-500 mb-1 uppercase">Label</label>
                <input
                  value={element.label}
                  onChange={(e) => updateProp("label", e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-500 mb-1 uppercase">Target Date</label>
                <input
                  type="datetime-local"
                  value={element.targetDate.slice(0, 16)}
                  onChange={(e) => updateProp("targetDate", new Date(e.target.value).toISOString())}
                  className="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-500 mb-1 uppercase">Timer Color</label>
                <div className="flex flex-wrap gap-1">
                  {QUICK_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => updateProp("timerColor", c)}
                      className={`h-6 w-6 rounded-md border-2 transition-transform hover:scale-110 ${
                        element.timerColor === c ? "border-indigo-500 scale-110" : "border-gray-200"
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {element.type === "spacer" && (
            <div>
              <label className="block text-[10px] font-medium text-gray-500 mb-1 uppercase">Height</label>
              <input
                value={element.height}
                onChange={(e) => updateProp("height", e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs focus:border-indigo-500 focus:outline-none"
              />
            </div>
          )}

          {/* Common style controls */}
          <div className="border-t border-gray-100 pt-3">
            <p className="text-[10px] font-medium text-gray-400 mb-2 uppercase">Style</p>

            {/* Text color */}
            {(element.type === "text" || element.type === "heading") && (
              <div className="mb-2">
                <label className="block text-[10px] font-medium text-gray-500 mb-1">Text Color</label>
                <div className="flex flex-wrap gap-1">
                  {QUICK_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => updateStyle("color", c)}
                      className={`h-6 w-6 rounded-md border-2 transition-transform hover:scale-110 ${
                        element.styles.color === c ? "border-indigo-500 scale-110" : "border-gray-200"
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Font size */}
            <div className="mb-2">
              <label className="block text-[10px] font-medium text-gray-500 mb-1">Font Size</label>
              <input
                value={element.styles.fontSize || "16px"}
                onChange={(e) => updateStyle("fontSize", e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Font family */}
            <div className="mb-2">
              <label className="block text-[10px] font-medium text-gray-500 mb-1">Font</label>
              <select
                value={element.styles.fontFamily || "Arial, sans-serif"}
                onChange={(e) => updateStyle("fontFamily", e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs focus:border-indigo-500 focus:outline-none"
              >
                {FONT_OPTIONS.map((f) => (
                  <option key={f} value={f}>
                    {f.split(",")[0].replace(/'/g, "")}
                  </option>
                ))}
              </select>
            </div>

            {/* Alignment */}
            <div className="mb-2">
              <label className="block text-[10px] font-medium text-gray-500 mb-1">Align</label>
              <div className="flex gap-1">
                {(["left", "center", "right"] as const).map((a) => (
                  <button
                    key={a}
                    onClick={() => updateStyle("textAlign", a)}
                    className={`rounded-lg px-3 py-1 text-[10px] font-medium transition-colors ${
                      element.styles.textAlign === a
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {a.charAt(0).toUpperCase() + a.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Background color */}
            <div className="mb-2">
              <label className="block text-[10px] font-medium text-gray-500 mb-1">Background</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={element.styles.backgroundColor || "#ffffff"}
                  onChange={(e) => updateStyle("backgroundColor", e.target.value)}
                  className="h-7 w-7 rounded border border-gray-200 cursor-pointer"
                />
                <input
                  value={element.styles.backgroundColor || ""}
                  onChange={(e) => updateStyle("backgroundColor", e.target.value)}
                  placeholder="transparent"
                  className="flex-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-mono focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Padding */}
            <div>
              <label className="block text-[10px] font-medium text-gray-500 mb-1">Padding</label>
              <input
                value={element.styles.padding || ""}
                onChange={(e) => updateStyle("padding", e.target.value)}
                placeholder="e.g. 10px 20px"
                className="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
