"use client";

import { useCallback, useEffect, useState, useMemo } from "react";
import { v4 as uuid } from "uuid";
import type {
  BuilderMode,
  EmailElement,
  EmailTemplate,
  ElementType,
} from "@/types/builder";
import { createDefaultElement } from "@/lib/element-defaults";
import { generateEmailHtml } from "@/lib/html-generator";
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
  const [mode, setMode] = useState<BuilderMode>("sketch");
  const { value: savedTemplate, setValue: saveTemplate, loaded } =
    useLocalStorage<EmailTemplate>("markuply-template", DEFAULT_TEMPLATE);
  const [template, setTemplate] = useState<EmailTemplate>(DEFAULT_TEMPLATE);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showGallery, setShowGallery] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [showFirstVisit, setShowFirstVisit] = useState(false);
  const [showPreviewPanel, setShowPreviewPanel] = useState(true);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");

  // Load saved template on mount (scheduled to avoid sync setState in effect)
  useEffect(() => {
    if (!loaded) return;
    const id = requestAnimationFrame(() => {
      if (savedTemplate.elements.length > 0) {
        setTemplate(savedTemplate);
        setMode("builder");
      } else {
        setShowFirstVisit(true);
      }
    });
    return () => cancelAnimationFrame(id);
  }, [loaded, savedTemplate]);

  // Auto-save on changes (debounced)
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

  const handleDeleteById = useCallback((id: string) => {
    setTemplate((prev) => ({
      ...prev,
      elements: prev.elements.filter((el) => el.id !== id),
    }));
    setSelectedId((prev) => (prev === id ? null : prev));
  }, []);

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

  const handleDuplicateById = useCallback((id: string) => {
    const source = template.elements.find((el) => el.id === id);
    if (!source) return;
    const copy = { ...source, id: uuid(), styles: { ...source.styles } };
    const idx = template.elements.findIndex((el) => el.id === id);
    setTemplate((prev) => {
      const newElements = [...prev.elements];
      newElements.splice(idx + 1, 0, copy as EmailElement);
      return { ...prev, elements: newElements };
    });
    setSelectedId(copy.id);
  }, [template.elements]);

  const handleMoveUp = useCallback(() => {
    if (!selectedId) return;
    const idx = template.elements.findIndex((el) => el.id === selectedId);
    if (idx <= 0) return;
    setTemplate((prev) => {
      const newElements = [...prev.elements];
      [newElements[idx - 1], newElements[idx]] = [newElements[idx], newElements[idx - 1]];
      return { ...prev, elements: newElements };
    });
  }, [selectedId, template.elements]);

  const handleMoveUpById = useCallback((id: string) => {
    const idx = template.elements.findIndex((el) => el.id === id);
    if (idx <= 0) return;
    setTemplate((prev) => {
      const newElements = [...prev.elements];
      [newElements[idx - 1], newElements[idx]] = [newElements[idx], newElements[idx - 1]];
      return { ...prev, elements: newElements };
    });
  }, [template.elements]);

  const handleMoveDown = useCallback(() => {
    if (!selectedId) return;
    const idx = template.elements.findIndex((el) => el.id === selectedId);
    if (idx >= template.elements.length - 1) return;
    setTemplate((prev) => {
      const newElements = [...prev.elements];
      [newElements[idx], newElements[idx + 1]] = [newElements[idx + 1], newElements[idx]];
      return { ...prev, elements: newElements };
    });
  }, [selectedId, template.elements]);

  const handleMoveDownById = useCallback((id: string) => {
    const idx = template.elements.findIndex((el) => el.id === id);
    if (idx >= template.elements.length - 1) return;
    setTemplate((prev) => {
      const newElements = [...prev.elements];
      [newElements[idx], newElements[idx + 1]] = [newElements[idx + 1], newElements[idx]];
      return { ...prev, elements: newElements };
    });
  }, [template.elements]);

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

  const handleTemplateChange = useCallback((t: EmailTemplate) => {
    setTemplate(t);
  }, []);

  const handleNewDesign = useCallback(() => {
    setTemplate({ ...DEFAULT_TEMPLATE, id: uuid() });
    setSelectedId(null);
    setMode("sketch");
    setToast("New design started");
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
  }, [selectedId, mode, handleDeleteElement, handleMoveUp, handleMoveDown, handleDuplicateElement]);

  // Generate live preview HTML
  const previewHtml = useMemo(() => generateEmailHtml(template), [template]);

  const modes: { mode: BuilderMode; label: string; icon: React.ReactNode }[] = [
    {
      mode: "sketch",
      label: "Sketch",
      icon: <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>,
    },
    {
      mode: "builder",
      label: "Builder",
      icon: <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
    },
    {
      mode: "preview",
      label: "Preview",
      icon: <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
    },
  ];

  return (
    <div className="flex h-screen flex-col bg-slate-50">
      {/* ── Top Header Bar ── */}
      <header className="flex items-center justify-between border-b border-slate-200/80 bg-white px-4 py-2 shadow-sm relative z-30">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-bold tracking-tight">
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">Markup</span>
            <span className="text-slate-800">ly</span>
          </h1>
          <div className="h-5 w-px bg-slate-200" />
          <input
            value={template.name}
            onChange={(e) => setTemplate((prev) => ({ ...prev, name: e.target.value }))}
            className="rounded-md border-0 bg-transparent px-2 py-1 text-sm font-medium text-slate-700 hover:bg-slate-100 focus:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500 max-w-[200px]"
          />
        </div>

        {/* Mode switcher */}
        <div className="absolute left-1/2 -translate-x-1/2 flex rounded-xl bg-slate-100 p-0.5">
          {modes.map(({ mode: m, label, icon }) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-medium transition-all ${
                mode === m
                  ? "bg-white text-violet-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {mode === "builder" && (
            <button
              onClick={() => setShowPreviewPanel(!showPreviewPanel)}
              className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all ${
                showPreviewPanel
                  ? "border-violet-200 bg-violet-50 text-violet-700"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
              title="Toggle live preview"
            >
              <svg className="h-3.5 w-3.5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" />
              </svg>
              Preview
            </button>
          )}
          <button
            onClick={() => setShowGallery(true)}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            Templates
          </button>
          <button
            onClick={handleNewDesign}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            New
          </button>
          <input
            value={template.subject}
            onChange={(e) => setTemplate((prev) => ({ ...prev, subject: e.target.value }))}
            placeholder="Email subject..."
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-700 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 w-40"
          />
        </div>
      </header>

      {/* ── Main content area ── */}
      <div className="flex flex-1 overflow-hidden">
        {mode === "sketch" && (
          <div className="flex-1 overflow-y-auto p-6">
            <div className="mx-auto max-w-[680px]">
              <div className="mb-6 text-center">
                <h2 className="text-xl font-bold text-slate-900">Smart Sketch Builder</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Draw rectangles to create sections. Click a section and use the AI prompt to describe what goes inside.
                </p>
              </div>
              <SmartSketchCanvas onConvert={handleSketchConvert} />
            </div>
          </div>
        )}

        {mode === "builder" && (
          <>
            <ElementSidebar onAddElement={handleAddElement} />
            <DragDropCanvas
              elements={template.elements}
              selectedId={selectedId}
              onSelectElement={setSelectedId}
              onUpdateElement={handleUpdateElement}
              onReorderElements={(elements) =>
                setTemplate((prev) => ({ ...prev, elements }))
              }
              onAddElement={handleAddElement}
              onDeleteElement={handleDeleteById}
              onDuplicateElement={handleDuplicateById}
              onMoveUp={handleMoveUpById}
              onMoveDown={handleMoveDownById}
            />

            {/* Live Preview Panel */}
            {showPreviewPanel && (
              <div className="w-[340px] shrink-0 border-l border-slate-200/80 bg-slate-50 flex flex-col overflow-hidden animate-slideInRight">
                <div className="flex items-center justify-between border-b border-slate-200/80 bg-white px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-700">Live Preview</span>
                    <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <div className="flex rounded-md bg-slate-100 p-0.5">
                    <button
                      onClick={() => setPreviewDevice("desktop")}
                      className={`rounded px-2 py-0.5 text-[10px] font-medium ${
                        previewDevice === "desktop" ? "bg-white text-slate-700 shadow-sm" : "text-slate-400"
                      }`}
                    >
                      Desktop
                    </button>
                    <button
                      onClick={() => setPreviewDevice("mobile")}
                      className={`rounded px-2 py-0.5 text-[10px] font-medium ${
                        previewDevice === "mobile" ? "bg-white text-slate-700 shadow-sm" : "text-slate-400"
                      }`}
                    >
                      Mobile
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-auto p-3">
                  <div
                    className="mx-auto bg-white rounded-lg shadow-sm overflow-hidden border border-slate-200"
                    style={{
                      width: previewDevice === "mobile" ? "320px" : "100%",
                      maxWidth: "100%",
                    }}
                  >
                    <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-3 py-1.5">
                      <div className="h-2 w-2 rounded-full bg-red-300" />
                      <div className="h-2 w-2 rounded-full bg-amber-300" />
                      <div className="h-2 w-2 rounded-full bg-emerald-300" />
                      <span className="ml-1.5 text-[9px] text-slate-400">
                        {previewDevice === "desktop" ? "600px" : "375px"}
                      </span>
                    </div>
                    <iframe
                      srcDoc={previewHtml}
                      className="w-full border-0"
                      style={{ height: "500px", pointerEvents: "none" }}
                      title="Live Preview"
                      sandbox="allow-same-origin"
                    />
                  </div>
                </div>
              </div>
            )}

            <PropertyPanel
              element={selectedElement}
              template={template}
              onChange={handleUpdateElement}
              onTemplateChange={handleTemplateChange}
              onDelete={handleDeleteElement}
              onDuplicate={handleDuplicateElement}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
            />
          </>
        )}

        {mode === "preview" && (
          <EmailPreview template={template} onToast={showToast} />
        )}
      </div>

      {/* ── Status bar ── */}
      <footer className="flex items-center justify-between border-t border-slate-200/80 bg-white px-4 py-1.5">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="text-[10px] text-slate-400">Auto-saved</span>
          </div>
          <span className="text-[10px] text-slate-300">|</span>
          <span className="text-[10px] text-slate-400">
            {template.elements.length} block{template.elements.length !== 1 && "s"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-slate-400">
            Del: delete · Ctrl+D: duplicate · Ctrl+↑↓: reorder · Esc: deselect
          </span>
        </div>
      </footer>

      {/* Template gallery modal */}
      {showGallery && (
        <TemplateGallery
          onSelect={handleTemplateSelect}
          onClose={() => setShowGallery(false)}
        />
      )}

      {/* First visit overlay */}
      {showFirstVisit && !showGallery && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl animate-scaleIn">
            <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100">
              <svg className="h-7 w-7 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900">Welcome to Markuply</h2>
            <p className="mt-2 text-sm text-slate-500">
              Create beautiful email designs by sketching on the canvas or use our drag-and-drop builder with pre-built templates.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={() => { setShowFirstVisit(false); setMode("sketch"); }}
                className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-200"
              >
                Start Sketching
              </button>
              <button
                onClick={() => { setShowFirstVisit(false); setShowGallery(true); }}
                className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Browse Templates
              </button>
              <button
                onClick={() => { setShowFirstVisit(false); setMode("builder"); }}
                className="text-sm text-slate-400 hover:text-slate-600"
              >
                Start from Scratch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast notifications */}
      <Toast
        message={toast || ""}
        visible={!!toast}
        onHide={() => setToast(null)}
      />
    </div>
  );
}
