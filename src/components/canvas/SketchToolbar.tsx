"use client";

import type { SketchTool } from "@/types/builder";

interface SketchToolbarProps {
  currentTool: SketchTool;
  currentColor: string;
  strokeWidth: number;
  onToolChange: (tool: SketchTool) => void;
  onColorChange: (color: string) => void;
  onStrokeWidthChange: (width: number) => void;
  onUndo: () => void;
  onClear: () => void;
  onConvert: () => void;
  hasStrokes: boolean;
}

const TOOLS: { tool: SketchTool; label: string; icon: string }[] = [
  { tool: "pen", label: "Pen", icon: "✏️" },
  { tool: "marker", label: "Marker", icon: "🖍️" },
  { tool: "rectangle", label: "Rectangle", icon: "⬜" },
  { tool: "line", label: "Line", icon: "📏" },
  { tool: "eraser", label: "Eraser", icon: "🧹" },
];

const COLORS = [
  "#000000",
  "#EF4444",
  "#F59E0B",
  "#10B981",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#6B7280",
];

const WIDTHS = [2, 4, 6, 10];

export function SketchToolbar({
  currentTool,
  currentColor,
  strokeWidth,
  onToolChange,
  onColorChange,
  onStrokeWidthChange,
  onUndo,
  onClear,
  onConvert,
  hasStrokes,
}: SketchToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl bg-white p-3 shadow-lg border border-gray-200">
      {/* Tools */}
      <div className="flex items-center gap-1">
        {TOOLS.map(({ tool, label, icon }) => (
          <button
            key={tool}
            onClick={() => onToolChange(tool)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
              currentTool === tool
                ? "bg-indigo-100 text-indigo-700 shadow-sm"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            title={label}
          >
            <span className="text-base">{icon}</span>
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      <div className="h-8 w-px bg-gray-200" />

      {/* Colors */}
      <div className="flex items-center gap-1.5">
        {COLORS.map((color) => (
          <button
            key={color}
            onClick={() => onColorChange(color)}
            className={`h-7 w-7 rounded-full border-2 transition-transform ${
              currentColor === color
                ? "border-indigo-500 scale-110"
                : "border-gray-300 hover:scale-105"
            }`}
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>

      <div className="h-8 w-px bg-gray-200" />

      {/* Stroke Width */}
      <div className="flex items-center gap-1.5">
        {WIDTHS.map((w) => (
          <button
            key={w}
            onClick={() => onStrokeWidthChange(w)}
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
              strokeWidth === w
                ? "bg-indigo-100 text-indigo-700"
                : "text-gray-500 hover:bg-gray-100"
            }`}
            title={`${w}px`}
          >
            <div
              className="rounded-full bg-current"
              style={{ width: w + 2, height: w + 2 }}
            />
          </button>
        ))}
      </div>

      <div className="h-8 w-px bg-gray-200" />

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onUndo}
          className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
        >
          Undo
        </button>
        <button
          onClick={onClear}
          className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          Clear
        </button>
      </div>

      <div className="flex-1" />

      {/* Convert Button */}
      <button
        onClick={onConvert}
        disabled={!hasStrokes}
        className={`rounded-xl px-6 py-2.5 text-sm font-semibold transition-all ${
          hasStrokes
            ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        Convert to Email →
      </button>
    </div>
  );
}
