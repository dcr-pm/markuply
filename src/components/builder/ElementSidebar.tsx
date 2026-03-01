"use client";

import { useState } from "react";
import { ELEMENT_PALETTE } from "@/lib/element-defaults";
import type { ElementType } from "@/types/builder";

interface ElementSidebarProps {
  onAddElement: (type: ElementType) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

const CATEGORIES: { label: string; types: ElementType[] }[] = [
  {
    label: "Structure",
    types: ["header", "columns", "divider", "spacer", "footer"],
  },
  {
    label: "Content",
    types: ["heading", "text", "image", "button", "html"],
  },
  {
    label: "Media & Interactive",
    types: ["video", "gif", "timer", "social"],
  },
];

export function ElementSidebar({
  onAddElement,
  collapsed = false,
  onToggleCollapse,
}: ElementSidebarProps) {
  const [search, setSearch] = useState("");

  const handleDragStart = (e: React.DragEvent, type: ElementType) => {
    e.dataTransfer.setData("elementType", type);
    e.dataTransfer.effectAllowed = "copy";
  };

  const filteredPalette = search
    ? ELEMENT_PALETTE.filter((p) =>
        p.label.toLowerCase().includes(search.toLowerCase()),
      )
    : null;

  if (collapsed) {
    return (
      <div className="w-12 shrink-0 border-r border-mk-border bg-mk-sidebar-bg flex flex-col items-center py-3 gap-1">
        <button
          onClick={onToggleCollapse}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-mk-sidebar-text hover:bg-white/10 hover:text-white transition-colors mb-2"
          title="Expand sidebar"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
        {ELEMENT_PALETTE.slice(0, 8).map((item) => (
          <button
            key={item.type}
            draggable
            onDragStart={(e) => handleDragStart(e, item.type)}
            onClick={() => onAddElement(item.type)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-sm text-mk-sidebar-text hover:bg-white/10 hover:text-white transition-colors cursor-grab active:cursor-grabbing"
            title={item.label}
          >
            {item.icon}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="w-56 shrink-0 overflow-y-auto border-r border-mk-border bg-mk-sidebar-bg flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <h3 className="text-xs font-semibold text-mk-sidebar-text uppercase tracking-wider">
          Blocks
        </h3>
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="flex h-6 w-6 items-center justify-center rounded text-mk-sidebar-text hover:bg-white/10 hover:text-white transition-colors"
            title="Collapse sidebar"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}
      </div>

      {/* Search */}
      <div className="px-3 pb-3">
        <div className="relative">
          <svg
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-mk-text-muted"
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search blocks..."
            className="w-full rounded-lg border-0 bg-white/8 pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-mk-text-muted focus:bg-white/12 focus:outline-none focus:ring-1 focus:ring-mk-primary"
          />
        </div>
      </div>

      {/* Categorized elements */}
      <div className="flex-1 overflow-y-auto px-3 pb-4">
        {search ? (
          /* Search results */
          <div className="grid grid-cols-2 gap-1.5">
            {(filteredPalette || []).map((item) => (
              <ElementButton
                key={item.type}
                icon={item.icon}
                label={item.label}
                type={item.type}
                onDragStart={handleDragStart}
                onClick={() => onAddElement(item.type)}
              />
            ))}
            {filteredPalette?.length === 0 && (
              <p className="col-span-2 py-4 text-center text-xs text-mk-text-muted">
                No blocks found
              </p>
            )}
          </div>
        ) : (
          /* Categories */
          CATEGORIES.map((cat) => (
            <div key={cat.label} className="mb-3">
              <p className="mb-1.5 px-1 text-[10px] font-semibold uppercase tracking-widest text-mk-text-muted">
                {cat.label}
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {cat.types.map((type) => {
                  const item = ELEMENT_PALETTE.find((p) => p.type === type);
                  if (!item) return null;
                  return (
                    <ElementButton
                      key={item.type}
                      icon={item.icon}
                      label={item.label}
                      type={item.type}
                      onDragStart={handleDragStart}
                      onClick={() => onAddElement(item.type)}
                    />
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="border-t border-white/8 px-4 py-3">
        <div className="space-y-1 text-[10px] text-mk-text-muted">
          <p>
            <kbd className="rounded bg-white/10 px-1 py-0.5 font-mono text-[9px]">Del</kbd> Delete
          </p>
          <p>
            <kbd className="rounded bg-white/10 px-1 py-0.5 font-mono text-[9px]">Ctrl+D</kbd> Duplicate
          </p>
          <p>
            <kbd className="rounded bg-white/10 px-1 py-0.5 font-mono text-[9px]">Ctrl+↑↓</kbd> Reorder
          </p>
        </div>
      </div>
    </div>
  );
}

function ElementButton({
  icon,
  label,
  type,
  onDragStart,
  onClick,
}: {
  icon: string;
  label: string;
  type: ElementType;
  onDragStart: (e: React.DragEvent, type: ElementType) => void;
  onClick: () => void;
}) {
  return (
    <button
      draggable
      onDragStart={(e) => onDragStart(e, type)}
      onClick={onClick}
      className="group flex flex-col items-center gap-1 rounded-lg bg-white/6 p-2.5 text-center transition-all hover:bg-mk-primary/20 active:scale-95 cursor-grab active:cursor-grabbing"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-white/8 text-sm transition-colors group-hover:bg-mk-primary/30 text-mk-sidebar-text group-hover:text-white">
        {icon}
      </span>
      <span className="text-[10px] font-medium text-mk-sidebar-text group-hover:text-white leading-tight">
        {label}
      </span>
    </button>
  );
}
