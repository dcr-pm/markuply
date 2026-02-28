"use client";

import type { SketchTool } from "@/types/builder";

interface SmartToolbarProps {
  tool: SketchTool;
  color: string;
  strokeWidth: number;
  columns: number;
  onToolChange: (tool: SketchTool) => void;
  onColorChange: (color: string) => void;
  onStrokeWidthChange: (width: number) => void;
  onColumnsChange: (cols: number) => void;
  onClear: () => void;
  onConvert: () => void;
  canConvert: boolean;
  regionCount: number;
  elementCount: number;
}

const TOOLS: { tool: SketchTool; label: string; icon: string }[] = [
  { tool: "rectangle", label: "Region", icon: "▢" },
  { tool: "pen", label: "Pen", icon: "✎" },
  { tool: "marker", label: "Marker", icon: "▬" },
  { tool: "line", label: "Line", icon: "—" },
  { tool: "eraser", label: "Eraser", icon: "◻" },
];

const COLORS = [
  "#4F46E5", "#111827", "#dc2626", "#059669", "#ea580c",
  "#7c3aed", "#2563eb", "#ec4899",
];

export function SmartToolbar({
  tool,
  color,
  strokeWidth,
  columns,
  onToolChange,
  onColorChange,
  onStrokeWidthChange,
  onColumnsChange,
  onClear,
  onConvert,
  canConvert,
  regionCount,
  elementCount,
}: SmartToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
      {/* Tools */}
      <div className="flex gap-1">
        {TOOLS.map(({ tool: t, label, icon }) => (
          <button
            key={t}
            onClick={() => onToolChange(t)}
            className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              tool === t
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            title={label}
          >
            <span className="text-sm">{icon}</span>
            {label}
          </button>
        ))}
      </div>

      <div className="h-6 w-px bg-gray-200" />

      {/* Column preset (only when rectangle tool is active) */}
      {tool === "rectangle" && (
        <>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-medium text-gray-500 uppercase">Columns:</span>
            {[1, 2, 3, 4].map((n) => (
              <button
                key={n}
                onClick={() => onColumnsChange(n)}
                className={`flex h-7 w-7 items-center justify-center rounded-md text-xs font-bold transition-colors ${
                  columns === n
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          <div className="h-6 w-px bg-gray-200" />
        </>
      )}

      {/* Colors */}
      <div className="flex items-center gap-1">
        {COLORS.map((c) => (
          <button
            key={c}
            onClick={() => onColorChange(c)}
            className={`h-6 w-6 rounded-full border-2 transition-transform hover:scale-110 ${
              color === c ? "border-gray-800 scale-110" : "border-transparent"
            }`}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>

      <div className="h-6 w-px bg-gray-200" />

      {/* Stroke width */}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 5].map((w) => (
          <button
            key={w}
            onClick={() => onStrokeWidthChange(w)}
            className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
              strokeWidth === w
                ? "bg-indigo-100 text-indigo-700"
                : "bg-gray-50 text-gray-500 hover:bg-gray-100"
            }`}
          >
            <span
              className="rounded-full bg-current"
              style={{ width: w + 2, height: w + 2 }}
            />
          </button>
        ))}
      </div>

      <div className="flex-1" />

      {/* Status */}
      <span className="text-[10px] text-gray-400">
        {regionCount} section{regionCount !== 1 && "s"} · {elementCount} element{elementCount !== 1 && "s"}
      </span>

      {/* Actions */}
      <button
        onClick={onClear}
        className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
      >
        Clear All
      </button>
      <button
        onClick={onConvert}
        disabled={!canConvert}
        className="rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
      >
        Convert to Email
      </button>
    </div>
  );
}
