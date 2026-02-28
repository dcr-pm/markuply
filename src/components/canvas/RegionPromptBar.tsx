"use client";

import { useState, useRef, useEffect } from "react";
import type { EmailElement } from "@/types/builder";
import type { SmartPromptResult, RegionStyleOverrides } from "@/lib/prompt-to-elements";
import { smartPromptToElements, PROMPT_SUGGESTIONS, CREATIVE_PROMPT_EXAMPLES } from "@/lib/prompt-to-elements";

interface RegionPromptBarProps {
  regionId: string;
  onGenerate: (elements: EmailElement[]) => void;
  onSmartGenerate?: (result: SmartPromptResult) => void;
  existingElements: EmailElement[];
  compact?: boolean;
  onStyleChange?: (style: RegionStyleOverrides) => void;
}

const STYLE_PRESETS = [
  { label: "Dark", bg: "#1f2937", text: "#ffffff" },
  { label: "Blue", bg: "#2563eb", text: "#ffffff" },
  { label: "Red", bg: "#dc2626", text: "#ffffff" },
  { label: "Purple", bg: "#7c3aed", text: "#ffffff" },
  { label: "Green", bg: "#059669", text: "#ffffff" },
  { label: "Gold", bg: "#fbbf24", text: "#111827" },
  { label: "Light", bg: "#f9fafb", text: "#111827" },
  { label: "White", bg: "#ffffff", text: "#111827" },
];

export function RegionPromptBar({
  regionId,
  onGenerate,
  onSmartGenerate,
  existingElements,
  compact = false,
  onStyleChange,
}: RegionPromptBarProps) {
  const [prompt, setPrompt] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const [activeTab, setActiveTab] = useState<"elements" | "style" | "creative">("elements");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (showSuggestions && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [showSuggestions]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [prompt]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);

    const result = smartPromptToElements(prompt.trim());

    // Small delay for visual feedback
    await new Promise((r) => setTimeout(r, 300));

    if (onSmartGenerate) {
      onSmartGenerate(result);
    } else {
      onGenerate(result.elements);
    }

    setPrompt("");
    setIsGenerating(false);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestionPrompt: string) => {
    const result = smartPromptToElements(suggestionPrompt);
    if (onSmartGenerate) {
      onSmartGenerate(result);
    } else {
      onGenerate(result.elements);
    }
    setShowSuggestions(false);
  };

  const handleStylePreset = (preset: typeof STYLE_PRESETS[0]) => {
    if (onStyleChange) {
      onStyleChange({
        backgroundColor: preset.bg,
        textColor: preset.text,
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
    if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  if (compact && !showSuggestions) {
    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowSuggestions(true);
        }}
        className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-white/80 px-3 py-2 text-xs text-gray-400 transition-all hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600 backdrop-blur-sm"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 3v3m6.366-.366-2.12 2.12M21 12h-3m.366 6.366-2.12-2.12M12 21v-3m-6.366.366 2.12-2.12M3 12h3m-.366-6.366 2.12 2.12" />
        </svg>
        {existingElements.length > 0 ? "Add more with AI..." : "Describe what goes here..."}
      </button>
    );
  }

  return (
    <div
      className="rounded-xl border border-indigo-200 bg-white shadow-lg overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Prompt textarea */}
      <div className="flex items-start gap-2 px-3 py-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-100 mt-0.5">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#4F46E5"
            strokeWidth="2"
          >
            <path d="M12 3v3m6.366-.366-2.12 2.12M21 12h-3m.366 6.366-2.12-2.12M12 21v-3m-6.366.366 2.12-2.12M3 12h3m-.366-6.366 2.12 2.12" />
          </svg>
        </div>
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='Be creative! e.g. "dark background, white centered heading &#x27;Flash Sale&#x27;, countdown timer, and red CTA button"'
          className="flex-1 resize-none border-0 bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none min-h-[28px]"
          rows={1}
          autoFocus
        />
        <div className="flex items-center gap-1.5 mt-0.5">
          {prompt.trim() && (
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="shrink-0 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {isGenerating ? (
                <span className="flex items-center gap-1">
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                </span>
              ) : (
                "Generate"
              )}
            </button>
          )}
          {showSuggestions && (
            <button
              onClick={() => setShowSuggestions(false)}
              className="shrink-0 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex border-t border-gray-100">
        {(["elements", "style", "creative"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-1.5 text-[10px] font-semibold uppercase tracking-wide transition-colors ${
              activeTab === tab
                ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {tab === "elements" ? "Elements" : tab === "style" ? "Style Block" : "Examples"}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="px-3 py-2">
        {activeTab === "elements" && (
          <div className="flex flex-wrap gap-1.5">
            {PROMPT_SUGGESTIONS.slice(0, 14).map((s) => (
              <button
                key={s.label}
                onClick={() => handleSuggestionClick(s.prompt)}
                className="flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] font-medium text-gray-600 transition-all hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
              >
                <span className="text-xs">{s.icon}</span>
                {s.label}
              </button>
            ))}
          </div>
        )}

        {activeTab === "style" && (
          <div className="space-y-2">
            <p className="text-[10px] text-gray-400 font-medium">Quick style presets for this block:</p>
            <div className="flex flex-wrap gap-1.5">
              {STYLE_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => handleStylePreset(preset)}
                  className="flex items-center gap-1.5 rounded-full border border-gray-200 px-2.5 py-1 text-[11px] font-medium text-gray-600 transition-all hover:border-indigo-300 hover:shadow-sm"
                >
                  <span
                    className="h-3.5 w-3.5 rounded-full border border-gray-300 shrink-0"
                    style={{ backgroundColor: preset.bg }}
                  />
                  {preset.label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              <button
                onClick={() => onStyleChange?.({ textAlign: "left" })}
                className="rounded border border-gray-200 px-2 py-1 text-[10px] text-gray-500 hover:bg-gray-50"
              >
                Align Left
              </button>
              <button
                onClick={() => onStyleChange?.({ textAlign: "center" })}
                className="rounded border border-gray-200 px-2 py-1 text-[10px] text-gray-500 hover:bg-gray-50"
              >
                Align Center
              </button>
              <button
                onClick={() => onStyleChange?.({ textAlign: "right" })}
                className="rounded border border-gray-200 px-2 py-1 text-[10px] text-gray-500 hover:bg-gray-50"
              >
                Align Right
              </button>
            </div>
          </div>
        )}

        {activeTab === "creative" && (
          <div className="space-y-1.5">
            <p className="text-[10px] text-gray-400 font-medium">Click an example to try it:</p>
            {CREATIVE_PROMPT_EXAMPLES.map((example, i) => (
              <button
                key={i}
                onClick={() => setPrompt(example)}
                className="block w-full text-left rounded-lg border border-gray-100 bg-gray-50/50 px-2.5 py-1.5 text-[11px] text-gray-600 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
