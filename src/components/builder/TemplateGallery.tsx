"use client";

import type { EmailTemplate } from "@/types/builder";
import { STARTER_TEMPLATES } from "@/lib/email-templates";

interface TemplateGalleryProps {
  onSelect: (template: EmailTemplate) => void;
  onClose: () => void;
}

const TEMPLATE_COLORS: Record<string, string> = {
  "Product Launch": "bg-indigo-50 border-indigo-200",
  Newsletter: "bg-slate-50 border-slate-200",
  "Sale / Promo": "bg-amber-50 border-amber-200",
  "Welcome Email": "bg-purple-50 border-purple-200",
};

const TEMPLATE_ACCENTS: Record<string, string> = {
  "Product Launch": "bg-indigo-600",
  Newsletter: "bg-slate-800",
  "Sale / Promo": "bg-amber-500",
  "Welcome Email": "bg-purple-600",
};

export function TemplateGallery({ onSelect, onClose }: TemplateGalleryProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-3xl rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Start with a Template
            </h2>
            <p className="text-sm text-gray-500">
              Choose a pre-built design to customize, or start from scratch
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Templates grid */}
        <div className="grid grid-cols-2 gap-4 p-6">
          {STARTER_TEMPLATES.map((template) => (
            <button
              key={template.id}
              onClick={() => onSelect(template)}
              className={`group rounded-xl border-2 p-4 text-left transition-all hover:shadow-lg hover:scale-[1.02] ${
                TEMPLATE_COLORS[template.name] || "bg-gray-50 border-gray-200"
              }`}
            >
              {/* Mini preview bars */}
              <div className="mb-3 rounded-lg bg-white p-3 shadow-sm">
                <div
                  className={`h-2 w-12 rounded-full ${
                    TEMPLATE_ACCENTS[template.name] || "bg-gray-400"
                  } mb-2`}
                />
                <div className="h-1.5 w-full rounded-full bg-gray-200 mb-1.5" />
                <div className="h-1.5 w-3/4 rounded-full bg-gray-200 mb-1.5" />
                <div className="h-1.5 w-5/6 rounded-full bg-gray-200 mb-3" />
                <div className="h-6 w-20 rounded bg-gray-200" />
              </div>

              <h3 className="text-sm font-semibold text-gray-900">
                {template.name}
              </h3>
              <p className="mt-0.5 text-xs text-gray-500">
                {template.elements.length} blocks · {template.subject}
              </p>
            </button>
          ))}
        </div>

        {/* Blank start */}
        <div className="border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full rounded-xl border-2 border-dashed border-gray-300 px-4 py-3 text-center text-sm font-medium text-gray-500 transition-colors hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50"
          >
            Start from Scratch
          </button>
        </div>
      </div>
    </div>
  );
}
