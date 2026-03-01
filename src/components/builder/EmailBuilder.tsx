"use client";

import { useCallback, useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import type {
  BuilderMode,
  EmailElement,
  EmailTemplate,
  ElementType,
} from "@/types/builder";
import { createDefaultElement } from "@/lib/element-defaults";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { SmartSketchCanvas } from "@/components/canvas/SmartSketchCanvas";
import { ElementSidebar } from "./ElementSidebar";
import { DragDropCanvas } from "./DragDropCanvas";
import { PropertyPanel } from "./PropertyPanel";
import { EmailPreview } from "@/components/preview/EmailPreview";
import { TemplateGallery } from "./TemplateGallery";
import { Toast } from "@/components/ui/Toast";

const DEFAULT_TEMPLATE: EmailTemplate = {
  id: uuid(),
  name: "Untitled Email",
  subject: "Your Email Subject",
  preheader: "",
  bodyBackground: "#f4f4f7",
  contentBackground: "#ffffff",
  contentWidth: "600px",
  fontFamily: "Arial, sans-serif",
  elements: [],
};

export function EmailBuilder() {
  const [mode, setMode] = useState<BuilderMode>("builder");
  const { value: savedTemplate, setValue: saveTemplate, loaded } =
    useLocalStorage<EmailTemplate>("markuply-template", DEFAULT_TEMPLATE);
  const [template, setTemplate] = useState<EmailTemplate>(DEFAULT_TEMPLATE);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showGallery, setShowGallery] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [showFirstVisit, setShowFirstVisit] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showSplitPreview, setShowSplitPreview] = useState(false);

  useEffect(() => {
    if (loaded) {
      if (savedTemplate.elements.length > 0) {
        setTemplate(savedTemplate);
        setMode("builder");
      } else {
        setShowFirstVisit(true);
      }
    }
  }, [loaded, savedTemplate]);

  useEffect(() => {
    if (!loaded) return;
    const timer = setTimeout(() => {
      saveTemplate(template);
    }, 1000);
    return () => clearTimeout(timer);
  }, [template, loaded, saveTemplate]);

  const selectedElement =
    template.elements.find((el) => el.id === selectedId) || null;

  const showToast = useCallback((msg: string) => setToast(msg), []);

  const handleAddElement = useCallback(
    (type: ElementType, index?: number) => {
      const el = createDefaultElement(type);
      setTemplate((prev) => {
        const newElements = [...prev.elements];
        if (index !== undefined) {
          newElements.splice(index, 0, el);
        } else {
          newElements.push(el);
        }
        return { ...prev, elements: newElements };
      });
      setSelectedId(el.id);
    },
    [],
  );

  const handleUpdateElement = useCallback((updated: EmailElement) => {
    setTemplate((prev) => ({
      ...prev,
      elements: prev.elements.map((el) =>
        el.id === updated.id ? updated : el,
      ),
    }));
  }, []);

  const handleDeleteElement = useCallback(() => {
    if (!selectedId) return;
    setTemplate((prev) => ({
      ...prev,
      elements: prev.elements.filter((el) => el.id !== selectedId),
    }));
    setSelectedId(null);
  }, [selectedId]);

  const handleDuplicateElement = useCallback(() => {
    if (!selectedId) return;
    const source = template.elements.find((el) => el.id === selectedId);
    if (!source) return;
    const copy = { ...source, id: uuid(), styles: { ...source.styles } };
    const idx = template.elements.findIndex((el) => el.id === selectedId);
    setTemplate((prev) => {
      const newElements = [...prev.elements];
      newElements.splice(idx + 1, 0, copy as EmailElement);
      return { ...prev, elements: newElements };
    });
    setSelectedId(copy.id);
  }, [selectedId, template.elements]);

  const handleMoveUp = useCallback(() => {
    if (!selectedId) return;
    const idx = template.elements.findIndex((el) => el.id === selectedId);
    if (idx <= 0) return;
    setTemplate((prev) => {
      const newElements = [...prev.elements];
      [newElements[idx - 1], newElements[idx]] = [
        newElements[idx],
        newElements[idx - 1],
      ];
      return { ...prev, elements: newElements };
    });
  }, [selectedId, template.elements]);

  const handleMoveDown = useCallback(() => {
    if (!selectedId) return;
    const idx = template.elements.findIndex((el) => el.id === selectedId);
    if (idx >= template.elements.length - 1) return;
    setTemplate((prev) => {
      const newElements = [...prev.elements];
      [newElements[idx], newElements[idx + 1]] = [
        newElements[idx + 1],
        newElements[idx],
      ];
      return { ...prev, elements: newElements };
    });
  }, [selectedId, template.elements]);

  const handleSketchConvert = useCallback((t: EmailTemplate) => {
    setTemplate(t);
    setMode("builder");
    setToast("Sketch converted to email blocks!");
  }, []);

  const handleTemplateSelect = useCallback((t: EmailTemplate) => {
    setTemplate({ ...t, id: uuid() });
    setMode("builder");
    setShowGallery(false);
    setShowFirstVisit(false);
    setToast(`Loaded "${t.name}" template`);
  }, []);

  const handleNewDesign = useCallback(() => {
    setTemplate({ ...DEFAULT_TEMPLATE, id: uuid() });
    setSelectedId(null);
    setMode("builder");
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if ((e.target as HTMLElement).contentEditable === "true") return;

      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedId && mode === "builder") {
          e.preventDefault();
          handleDeleteElement();
        }
      }
      if (e.key === "ArrowUp" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleMoveUp();
      }
      if (e.key === "ArrowDown" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleMoveDown();
      }
      if (e.key === "d" && (e.metaKey || e.ctrlKey)) {
        if (selectedId && mode === "builder") {
          e.preventDefault();
          handleDuplicateElement();
        }
      }
      if (e.key === "Escape") {
        setSelectedId(null);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [
    selectedId,
    mode,
    handleDeleteElement,
    handleMoveUp,
    handleMoveDown,
    handleDuplicateElement,
  ]);

  const modes: { mode: BuilderMode; label: string }[] = [
    { mode: "builder", label: "Build" },
    { mode: "sketch", label: "Sketch" },
    { mode: "preview", label: "Preview" },
  ];

  return (
    <div className="flex h-screen flex-col bg-mk-bg">
      {/* ── Top Bar ── */}
      <header className="flex h-12 items-center justify-between border-b border-mk-border bg-mk-surface px-3 shrink-0">
        {/* Left: Logo + name */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-[var(--mk-primary)] to-[var(--mk-accent)] flex items-center justify-center">
              <span className="text-[10px] font-bold text-white">M</span>
            </div>
            <span className="text-sm font-bold text-mk-text tracking-tight">
              markuply
            </span>
          </div>
          <div className="h-5 w-px bg-mk-border" />
          <input
            value={template.name}
            onChange={(e) =>
              setTemplate((prev) => ({ ...prev, name: e.target.value }))
            }
            className="rounded-md border-0 bg-transparent px-1.5 py-0.5 text-sm font-medium text-mk-text hover:bg-mk-primary-50 focus:bg-mk-primary-50 focus:outline-none focus:ring-1 focus:ring-mk-primary w-40"
          />
        </div>

        {/* Center: Mode switcher */}
        <div className="flex items-center rounded-lg bg-mk-bg p-0.5">
          {modes.map(({ mode: m, label }) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-md px-4 py-1 text-xs font-semibold transition-all ${
                mode === m
                  ? "bg-mk-surface text-mk-primary shadow-sm ring-1 ring-mk-border"
                  : "text-mk-text-muted hover:text-mk-text"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {mode === "builder" && (
            <button
              onClick={() => setShowSplitPreview(!showSplitPreview)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all flex items-center gap-1 ${
                showSplitPreview
                  ? "bg-mk-primary text-white"
                  : "text-mk-text-secondary hover:bg-mk-primary-50 hover:text-mk-primary"
              }`}
              title="Toggle split preview"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M12 3v18" />
              </svg>
              Preview
            </button>
          )}
          <button
            onClick={() => setShowGallery(true)}
            className="rounded-md px-2.5 py-1 text-xs font-medium text-mk-text-secondary hover:bg-mk-primary-50 hover:text-mk-primary transition-all"
          >
            Templates
          </button>
          <button
            onClick={handleNewDesign}
            className="rounded-md px-2.5 py-1 text-xs font-medium text-mk-text-secondary hover:bg-mk-primary-50 hover:text-mk-primary transition-all"
          >
            + New
          </button>
          <div className="h-5 w-px bg-mk-border" />
          <input
            value={template.subject}
            onChange={(e) =>
              setTemplate((prev) => ({ ...prev, subject: e.target.value }))
            }
            placeholder="Subject line..."
            className="rounded-md border border-mk-border px-2.5 py-1 text-xs text-mk-text focus:border-mk-primary focus:outline-none focus:ring-1 focus:ring-mk-primary w-40"
          />
          <div className="rounded-full bg-mk-primary-50 px-2 py-0.5 text-[10px] font-semibold text-mk-primary tabular-nums">
            {template.elements.length}
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <div className="flex flex-1 overflow-hidden">
        {mode === "sketch" && (
          <div className="flex-1 overflow-y-auto p-6 mk-canvas-bg">
            <div className="mx-auto max-w-[680px]">
              <div className="mb-6 text-center">
                <h2 className="text-xl font-bold text-mk-text">
                  Smart Sketch Builder
                </h2>
                <p className="mt-1 text-sm text-mk-text-muted">
                  Draw rectangles to create sections. Click a section and use the AI
                  prompt to describe what goes inside — timers, banners, CTAs, text,
                  images, and more.
                </p>
              </div>
              <SmartSketchCanvas onConvert={handleSketchConvert} />
            </div>
          </div>
        )}

        {mode === "builder" && (
          <>
            <ElementSidebar
              onAddElement={handleAddElement}
              collapsed={sidebarCollapsed}
              onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            />

            <DragDropCanvas
              elements={template.elements}
              selectedId={selectedId}
              onSelectElement={setSelectedId}
              onUpdateElement={handleUpdateElement}
              onReorderElements={(elements) =>
                setTemplate((prev) => ({ ...prev, elements }))
              }
              onAddElement={handleAddElement}
              onDeleteElement={handleDeleteElement}
              onDuplicateElement={handleDuplicateElement}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
            />

            {showSplitPreview ? (
              <div className="w-[380px] shrink-0 border-l border-mk-border overflow-hidden">
                <EmailPreview template={template} onToast={showToast} />
              </div>
            ) : (
              <PropertyPanel
                element={selectedElement}
                onChange={handleUpdateElement}
                onDelete={handleDeleteElement}
                onDuplicate={handleDuplicateElement}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
              />
            )}
          </>
        )}

        {mode === "preview" && (
          <EmailPreview template={template} onToast={showToast} />
        )}
      </div>

      {/* ── Modals ── */}
      {showGallery && (
        <TemplateGallery
          onSelect={handleTemplateSelect}
          onClose={() => setShowGallery(false)}
        />
      )}

      {showFirstVisit && !showGallery && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-lg rounded-2xl bg-mk-surface p-8 text-center shadow-2xl">
            <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--mk-primary)] to-[var(--mk-accent)]">
              <span className="text-2xl font-bold text-white">M</span>
            </div>
            <h2 className="text-2xl font-bold text-mk-text">
              Welcome to Markuply
            </h2>
            <p className="mt-2 text-sm text-mk-text-muted max-w-sm mx-auto">
              Build beautiful email designs with our drag-and-drop builder. Start
              from a template, sketch your layout, or build from scratch.
            </p>
            <div className="mt-8 flex flex-col gap-3">
              <button
                onClick={() => {
                  setShowFirstVisit(false);
                  setShowGallery(true);
                }}
                className="rounded-xl bg-mk-primary px-6 py-3 text-sm font-semibold text-white hover:bg-mk-primary-hover transition-colors"
              >
                Browse Templates
              </button>
              <button
                onClick={() => {
                  setShowFirstVisit(false);
                  setMode("builder");
                }}
                className="rounded-xl border border-mk-border px-6 py-3 text-sm font-semibold text-mk-text hover:bg-mk-primary-50 transition-colors"
              >
                Start from Scratch
              </button>
              <button
                onClick={() => {
                  setShowFirstVisit(false);
                  setMode("sketch");
                }}
                className="text-sm text-mk-text-muted hover:text-mk-primary transition-colors"
              >
                Try the Sketch Canvas
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast
        message={toast || ""}
        visible={!!toast}
        onHide={() => setToast(null)}
      />
    </div>
  );
}
