"use client";

import type { EmailTemplate } from "@/types/builder";
import { STARTER_TEMPLATES } from "@/lib/email-templates";

interface TemplateGalleryProps {
  onSelect: (template: EmailTemplate) => void;
  onClose: () => void;
}

const TEMPLATE_ACCENTS: Record<string, string> = {
  "Product Launch": "from-[var(--mk-primary)] to-blue-500",
  Newsletter: "from-slate-700 to-slate-500",
  "Sale / Promo": "from-amber-500 to-orange-500",
  "Welcome Email": "from-purple-500 to-pink-500",
};

export function TemplateGallery({ onSelect, onClose }: TemplateGalleryProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-3xl rounded-2xl bg-mk-surface shadow-2xl ring-1 ring-mk-border">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-mk-border px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-mk-text">
              Start with a Template
            </h2>
            <p className="text-sm text-mk-text-muted">
              Choose a pre-built design to customize, or start blank
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-mk-text-muted hover:bg-mk-primary-50 hover:text-mk-primary transition-colors"
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
              className="group rounded-xl border border-mk-border bg-mk-surface p-4 text-left transition-all hover:shadow-lg hover:scale-[1.02] hover:border-mk-primary/40"
            >
              {/* Mini preview */}
              <div className="mb-3 rounded-lg bg-mk-bg p-3">
                <div
                  className={`h-2 w-14 rounded-full bg-gradient-to-r ${
                    TEMPLATE_ACCENTS[template.name] || "from-gray-400 to-gray-300"
                  } mb-2`}
                />
                <div className="h-1.5 w-full rounded-full bg-mk-border mb-1.5" />
                <div className="h-1.5 w-3/4 rounded-full bg-mk-border mb-1.5" />
                <div className="h-1.5 w-5/6 rounded-full bg-mk-border mb-3" />
                <div className="h-5 w-16 rounded bg-mk-border" />
              </div>

              <h3 className="text-sm font-semibold text-mk-text group-hover:text-mk-primary transition-colors">
                {template.name}
              </h3>
              <p className="mt-0.5 text-xs text-mk-text-muted">
                {template.elements.length} blocks · {template.subject}
              </p>
            </button>
          ))}
        </div>

        {/* Blank start */}
        <div className="border-t border-mk-border px-6 py-4">
          <button
            onClick={onClose}
            className="w-full rounded-xl border-2 border-dashed border-mk-border px-4 py-3 text-center text-sm font-medium text-mk-text-muted transition-all hover:border-mk-primary hover:text-mk-primary hover:bg-mk-primary-50"
          >
            Start from Scratch
          </button>
        </div>
      </div>
    </div>
  );
}
