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
      <div className="flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3">
        <div className="flex rounded-lg border border-gray-200 p-0.5">
          <button
            onClick={() => setViewMode("desktop")}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              viewMode === "desktop"
                ? "bg-indigo-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Desktop
          </button>
          <button
            onClick={() => setViewMode("mobile")}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              viewMode === "mobile"
                ? "bg-indigo-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Mobile
          </button>
        </div>

        <div className="flex rounded-lg border border-gray-200 p-0.5">
          <button
            onClick={() => setShowCode(false)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              !showCode
                ? "bg-indigo-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Preview
          </button>
          <button
            onClick={() => setShowCode(true)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              showCode
                ? "bg-indigo-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            HTML Code
          </button>
        </div>

        <div className="flex-1" />

        <button
          onClick={handleCopy}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Copy HTML
        </button>
        <button
          onClick={handleDownload}
          className="rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 transition-colors"
        >
          Download .html
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-gray-100 p-6">
        {showCode ? (
          <div className="mx-auto max-w-4xl">
            <pre className="overflow-x-auto rounded-xl bg-gray-900 p-6 text-sm text-green-400 leading-relaxed">
              <code>{html}</code>
            </pre>
          </div>
        ) : (
          <div className="flex justify-center">
            <div
              className="transition-all duration-300 bg-white rounded-xl shadow-lg overflow-hidden"
              style={{
                width: viewMode === "desktop" ? "100%" : "375px",
                maxWidth: viewMode === "desktop" ? "700px" : "375px",
              }}
            >
              {/* Browser chrome */}
              <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-50 px-4 py-2">
                <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
                <span className="ml-2 text-[10px] text-gray-400">
                  {viewMode === "desktop" ? "Desktop (600px)" : "Mobile (375px)"}
                </span>
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
