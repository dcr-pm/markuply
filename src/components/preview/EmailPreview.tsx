"use client";

import { useState, useMemo } from "react";
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

  const html = useMemo(() => generateEmailHtml(template), [template]);

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
    <div className="flex h-full flex-col flex-1">
      {/* Toolbar */}
      <div className="flex items-center gap-3 border-b border-slate-200/80 bg-white px-4 py-2.5">
        <div className="flex rounded-lg bg-slate-100 p-0.5">
          <button
            onClick={() => setViewMode("desktop")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              viewMode === "desktop" ? "bg-white text-slate-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            Desktop
          </button>
          <button
            onClick={() => setViewMode("mobile")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              viewMode === "mobile" ? "bg-white text-slate-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
            Mobile
          </button>
        </div>

        <div className="flex rounded-lg bg-slate-100 p-0.5">
          <button
            onClick={() => setShowCode(false)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              !showCode ? "bg-white text-slate-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Preview
          </button>
          <button
            onClick={() => setShowCode(true)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              showCode ? "bg-white text-slate-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            HTML Code
          </button>
        </div>

        <div className="flex-1" />

        <span className="text-[10px] text-slate-400">
          {template.elements.length} block{template.elements.length !== 1 && "s"} · {viewMode === "desktop" ? "600px" : "375px"}
        </span>

        <button
          onClick={handleCopy}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
        >
          <svg className="h-3.5 w-3.5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
          Copy HTML
        </button>
        <button
          onClick={handleDownload}
          className="rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-1.5 text-xs font-medium text-white hover:from-violet-700 hover:to-indigo-700 shadow-sm"
        >
          <svg className="h-3.5 w-3.5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Download .html
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-gradient-to-b from-slate-50 to-slate-100/80 p-6">
        {showCode ? (
          <div className="mx-auto max-w-4xl animate-fadeIn">
            <pre className="overflow-x-auto rounded-2xl bg-slate-900 p-6 text-sm text-emerald-400 leading-relaxed shadow-lg border border-slate-800">
              <code>{html}</code>
            </pre>
          </div>
        ) : (
          <div className="flex justify-center animate-fadeIn">
            <div
              className="transition-all duration-300 bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden border border-slate-200/60"
              style={{
                width: viewMode === "desktop" ? "100%" : "375px",
                maxWidth: viewMode === "desktop" ? "700px" : "375px",
              }}
            >
              {/* Browser chrome */}
              <div className="flex items-center gap-2 border-b border-slate-200/80 bg-gradient-to-b from-slate-50 to-slate-100/50 px-4 py-2.5">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                </div>
                <div className="ml-2 flex-1 rounded-md bg-white/60 border border-slate-200/80 py-1 px-3">
                  <span className="text-[10px] text-slate-400 font-mono">
                    {viewMode === "desktop" ? "Desktop Preview (600px)" : "Mobile Preview (375px)"}
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
