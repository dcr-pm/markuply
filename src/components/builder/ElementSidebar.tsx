"use client";

import { useState, useCallback } from "react";
import { ELEMENT_PALETTE } from "@/lib/element-defaults";
import type { ElementType } from "@/types/builder";

interface ElementSidebarProps {
  onAddElement: (type: ElementType) => void;
  onAIGenerate?: (prompt: string) => void;
}

const CATEGORIES: { label: string; icon: string; types: ElementType[] }[] = [
  { label: "Content", icon: "Aa", types: ["heading", "text", "button", "html"] },
  { label: "Media", icon: "◻", types: ["image", "video", "gif"] },
  { label: "Layout", icon: "⊞", types: ["columns", "divider", "spacer"] },
  { label: "Components", icon: "★", types: ["header", "footer", "timer", "social"] },
];

const AI_SUGGESTIONS = [
  "Hero banner with CTA",
  "Product showcase grid",
  "Newsletter header",
  "Promotional countdown",
  "Social proof section",
  "Feature highlights",
];

export function ElementSidebar({ onAddElement, onAIGenerate }: ElementSidebarProps) {
  const [search, setSearch] = useState("");
  const [aiPrompt, setAIPrompt] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(CATEGORIES.map((c) => c.label)),
  );

  const handleDragStart = (e: React.DragEvent, type: ElementType) => {
    e.dataTransfer.setData("elementType", type);
    e.dataTransfer.effectAllowed = "copy";
  };

  const toggleCategory = useCallback((label: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  }, []);

  const handleAISubmit = () => {
    if (!aiPrompt.trim()) return;
    onAIGenerate?.(aiPrompt.trim());
    setAIPrompt("");
  };

  const filteredPalette = search
    ? ELEMENT_PALETTE.filter(
        (item) =>
          item.label.toLowerCase().includes(search.toLowerCase()) ||
          item.type.toLowerCase().includes(search.toLowerCase()),
      )
    : null;

  return (
    <div className="w-[260px] shrink-0 overflow-y-auto border-r border-slate-200/80 bg-white flex flex-col">
      {/* AI Prompt Section */}
      <div className="p-3 border-b border-slate-100">
        <div className="rounded-xl bg-gradient-to-br from-violet-50 to-indigo-50 p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-violet-600 text-[10px] text-white font-bold">AI</span>
            <span className="text-xs font-semibold text-violet-900">AI Assistant</span>
          </div>
          <div className="flex gap-1.5">
            <input
              value={aiPrompt}
              onChange={(e) => setAIPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAISubmit()}
              placeholder="Describe a block..."
              className="flex-1 rounded-lg border border-violet-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 placeholder-slate-400 focus:border-violet-400 focus:outline-none focus:ring-1 focus:ring-violet-400"
            />
            <button
              onClick={handleAISubmit}
              className="rounded-lg bg-violet-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-violet-700 active:scale-95"
            >
              Go
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {AI_SUGGESTIONS.slice(0, 3).map((s) => (
              <button
                key={s}
                onClick={() => {
                  setAIPrompt(s);
                  onAIGenerate?.(s);
                }}
                className="rounded-md bg-white/70 px-2 py-0.5 text-[10px] text-violet-700 hover:bg-white hover:text-violet-900 border border-violet-100"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 pt-3 pb-1">
        <div className="relative">
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search elements..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-xs text-slate-700 placeholder-slate-400 focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-violet-400"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Filtered results */}
      {filteredPalette ? (
        <div className="flex-1 p-3">
          <p className="mb-2 text-[10px] font-medium text-slate-400 uppercase tracking-wider">
            {filteredPalette.length} result{filteredPalette.length !== 1 && "s"}
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {filteredPalette.map((item) => (
              <button
                key={item.type}
                draggable
                onDragStart={(e) => handleDragStart(e, item.type)}
                onClick={() => onAddElement(item.type)}
                className="group flex flex-col items-center gap-1 rounded-lg border border-slate-200 bg-white p-2.5 text-center hover:border-violet-300 hover:bg-violet-50 hover:shadow-sm active:scale-95 cursor-grab active:cursor-grabbing"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-sm group-hover:bg-violet-100">
                  {item.icon}
                </span>
                <span className="text-[10px] font-medium text-slate-600 group-hover:text-violet-700">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Categorized elements */
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {CATEGORIES.map((cat) => {
            const isExpanded = expandedCategories.has(cat.label);
            const items = ELEMENT_PALETTE.filter((p) =>
              cat.types.includes(p.type),
            );

            return (
              <div key={cat.label}>
                <button
                  onClick={() => toggleCategory(cat.label)}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-slate-100 text-[10px] text-slate-500">
                    {cat.icon}
                  </span>
                  <span className="flex-1 text-left">{cat.label}</span>
                  <svg
                    className={`h-3 w-3 text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isExpanded && (
                  <div className="grid grid-cols-2 gap-1.5 pt-1 pb-2 animate-fadeIn">
                    {items.map((item) => (
                      <button
                        key={item.type}
                        draggable
                        onDragStart={(e) => handleDragStart(e, item.type)}
                        onClick={() => onAddElement(item.type)}
                        className="group flex flex-col items-center gap-1 rounded-lg border border-slate-200 bg-white p-2.5 text-center hover:border-violet-300 hover:bg-violet-50 hover:shadow-sm active:scale-95 cursor-grab active:cursor-grabbing"
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-sm group-hover:bg-violet-100">
                          {item.icon}
                        </span>
                        <span className="text-[10px] font-medium text-slate-600 group-hover:text-violet-700">
                          {item.label}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Keyboard shortcuts hint */}
      <div className="border-t border-slate-100 p-3">
        <div className="rounded-lg bg-slate-50 p-2.5 space-y-1">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Shortcuts</p>
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>Delete element</span>
            <kbd className="rounded bg-slate-200 px-1.5 py-0.5 text-[9px] font-mono text-slate-600">Del</kbd>
          </div>
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>Duplicate</span>
            <kbd className="rounded bg-slate-200 px-1.5 py-0.5 text-[9px] font-mono text-slate-600">Ctrl+D</kbd>
          </div>
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>Move up/down</span>
            <kbd className="rounded bg-slate-200 px-1.5 py-0.5 text-[9px] font-mono text-slate-600">Ctrl+↑↓</kbd>
          </div>
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>Deselect</span>
            <kbd className="rounded bg-slate-200 px-1.5 py-0.5 text-[9px] font-mono text-slate-600">Esc</kbd>
          </div>
        </div>
      </div>
    </div>
  );
}
