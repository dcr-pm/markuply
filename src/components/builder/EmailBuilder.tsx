"use client";

import { useCallback, useState } from "react";
import { v4 as uuid } from "uuid";
import type {
  BuilderMode,
  EmailElement,
  EmailTemplate,
  ElementType,
} from "@/types/builder";
import { createDefaultElement } from "@/lib/element-defaults";
import { SketchCanvas } from "@/components/canvas/SketchCanvas";
import { ElementSidebar } from "./ElementSidebar";
import { DragDropCanvas } from "./DragDropCanvas";
import { PropertyPanel } from "./PropertyPanel";
import { EmailPreview } from "@/components/preview/EmailPreview";

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
  const [template, setTemplate] = useState<EmailTemplate>(DEFAULT_TEMPLATE);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedElement =
    template.elements.find((el) => el.id === selectedId) || null;

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
  }, []);

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

        {/* Email settings */}
        <div className="flex items-center gap-3">
          <input
            value={template.subject}
            onChange={(e) =>
              setTemplate((prev) => ({ ...prev, subject: e.target.value }))
            }
            placeholder="Email subject..."
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-48"
          />
          <span className="text-xs text-gray-400">
            {template.elements.length} block{template.elements.length !== 1 && "s"}
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
                  Sketch Your Email
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Draw your email layout on the canvas below. Use rectangles for
                  images, wavy lines for text, small boxes for buttons, and
                  straight lines for dividers. Then hit &quot;Convert to Email&quot; to
                  generate your design.
                </p>
              </div>
              <SketchCanvas onConvert={handleSketchConvert} />
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

        {mode === "preview" && <EmailPreview template={template} />}
      </div>
    </div>
  );
}
