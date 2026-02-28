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
  const [mode, setMode] = useState<BuilderMode>("sketch");
  const { value: savedTemplate, setValue: saveTemplate, loaded } =
    useLocalStorage<EmailTemplate>("markuply-template", DEFAULT_TEMPLATE);
  const [template, setTemplate] = useState<EmailTemplate>(DEFAULT_TEMPLATE);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showGallery, setShowGallery] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [showFirstVisit, setShowFirstVisit] = useState(false);

  // Load saved template on mount
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
  }, [
    selectedId,
    mode,
    handleDeleteElement,
    handleMoveUp,
    handleMoveDown,
    handleDuplicateElement,
  ]);

  const modes: { mode: BuilderMode; label: string; icon: string }[] = [
    { mode: "sketch", label: "Sketch", icon: "✎" },
    { mode: "builder", label: "Builder", icon: "⊞" },
    { mode: "preview", label: "Preview", icon: "◉" },
  ];

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* Top bar */}
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-2.5 shadow-sm">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-bold text-gray-900 tracking-tight">
            <span className="text-indigo-600">Markup</span>ly
          </h1>
          <div className="h-6 w-px bg-gray-200" />
          <input
            value={template.name}
            onChange={(e) =>
              setTemplate((prev) => ({ ...prev, name: e.target.value }))
            }
            className="rounded-lg border-0 bg-transparent px-2 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Mode switcher */}
        <div className="flex rounded-lg border border-gray-200 p-0.5">
          {modes.map(({ mode: m, label, icon }) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex items-center gap-1.5 rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                mode === m
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span>{icon}</span>
              {label}
            </button>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowGallery(true)}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Templates
          </button>
          <button
            onClick={handleNewDesign}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            New
          </button>
          <input
            value={template.subject}
            onChange={(e) =>
              setTemplate((prev) => ({ ...prev, subject: e.target.value }))
            }
            placeholder="Email subject..."
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-44"
          />
          <span className="text-xs text-gray-400">
            {template.elements.length} block
            {template.elements.length !== 1 && "s"}
          </span>
        </div>
      </header>

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {mode === "sketch" && (
          <div className="flex-1 overflow-y-auto p-6">
            <div className="mx-auto max-w-[680px]">
              <div className="mb-6 text-center">
                <h2 className="text-xl font-bold text-gray-900">
                  Smart Sketch Builder
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Draw rectangles to create sections (set column count first for
                  multi-column layouts). Click a section and use the AI prompt
                  to describe what goes inside — timers, banners, CTAs, text,
                  images, and more. Every section and column has its own prompt bar.
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
            />
            <PropertyPanel
              element={selectedElement}
              onChange={handleUpdateElement}
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
          <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50">
              <span className="text-3xl">✎</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Welcome to Markuply
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Create beautiful email designs by sketching on the canvas or use
              our drag-and-drop builder with pre-built templates.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={() => {
                  setShowFirstVisit(false);
                  setMode("sketch");
                }}
                className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
              >
                Start Sketching
              </button>
              <button
                onClick={() => {
                  setShowFirstVisit(false);
                  setShowGallery(true);
                }}
                className="rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Browse Templates
              </button>
              <button
                onClick={() => {
                  setShowFirstVisit(false);
                  setMode("builder");
                }}
                className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
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
