"use client";

import { useState } from "react";
import type { EmailTemplate } from "@/types/builder";
import { generateEmailHtml } from "@/lib/html-generator";

interface EmailPreviewProps {
  template: EmailTemplate;
  onToast?: (msg: string) => void;
}

type ViewMode = "desktop" | "mobile";

export function EmailPreview({ template, onToast }: EmailPreviewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("desktop");
  const [showCode, setShowCode] = useState(false);

  const html = generateEmailHtml(template);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(html);
    onToast?.("HTML copied to clipboard!");
  };

  const handleDownload = () => {
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${template.name.toLowerCase().replace(/\s+/g, "-")}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex items-center gap-2 border-b border-mk-border bg-mk-surface px-4 py-2">
        <div className="flex rounded-lg bg-mk-bg p-0.5">
          <button
            onClick={() => setViewMode("desktop")}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition-all ${
              viewMode === "desktop"
                ? "bg-mk-surface text-mk-primary shadow-sm ring-1 ring-mk-border"
                : "text-mk-text-muted hover:text-mk-text"
            }`}
          >
            Desktop
          </button>
          <button
            onClick={() => setViewMode("mobile")}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition-all ${
              viewMode === "mobile"
                ? "bg-mk-surface text-mk-primary shadow-sm ring-1 ring-mk-border"
                : "text-mk-text-muted hover:text-mk-text"
            }`}
          >
            Mobile
          </button>
        </div>

        <div className="flex rounded-lg bg-mk-bg p-0.5">
          <button
            onClick={() => setShowCode(false)}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition-all ${
              !showCode
                ? "bg-mk-surface text-mk-primary shadow-sm ring-1 ring-mk-border"
                : "text-mk-text-muted hover:text-mk-text"
            }`}
          >
            Preview
          </button>
          <button
            onClick={() => setShowCode(true)}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition-all ${
              showCode
                ? "bg-mk-surface text-mk-primary shadow-sm ring-1 ring-mk-border"
                : "text-mk-text-muted hover:text-mk-text"
            }`}
          >
            HTML
          </button>
        </div>

        <div className="flex-1" />

        <button
          onClick={handleCopy}
          className="rounded-md border border-mk-border px-3 py-1 text-xs font-medium text-mk-text-secondary hover:bg-mk-primary-50 hover:text-mk-primary hover:border-mk-primary transition-all"
        >
          Copy HTML
        </button>
        <button
          onClick={handleDownload}
          className="rounded-md bg-mk-primary px-4 py-1 text-xs font-semibold text-white hover:bg-mk-primary-hover transition-colors"
        >
          Download .html
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto mk-canvas-bg p-6">
        {showCode ? (
          <div className="mx-auto max-w-4xl">
            <pre className="overflow-x-auto rounded-xl bg-mk-sidebar-bg p-6 text-sm text-green-400 leading-relaxed ring-1 ring-white/10">
              <code>{html}</code>
            </pre>
          </div>
        ) : (
          <div className="flex justify-center">
            <div
              className="transition-all duration-300 bg-mk-surface rounded-2xl shadow-xl overflow-hidden ring-1 ring-mk-border"
              style={{
                width: viewMode === "desktop" ? "100%" : "375px",
                maxWidth: viewMode === "desktop" ? "700px" : "375px",
              }}
            >
              <div className="flex items-center gap-2 border-b border-mk-border bg-gradient-to-r from-gray-50 to-mk-primary-50/30 px-4 py-2">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#FF605C]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#FFBD44]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#00CA4E]" />
                </div>
                <div className="ml-3 flex-1 rounded-md bg-white/60 px-3 py-0.5 text-center">
                  <span className="text-[10px] text-mk-text-muted font-mono">
                    {viewMode === "desktop" ? "Desktop (600px)" : "Mobile (375px)"}
                  </span>
                </div>
              </div>

              <iframe
                srcDoc={html}
                className="w-full border-0"
                style={{ height: "700px" }}
                title="Email Preview"
                sandbox="allow-same-origin"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
