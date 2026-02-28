"use client";

import { useState, useRef, useEffect } from "react";
import type { EmailElement } from "@/types/builder";
import { promptToElements, PROMPT_SUGGESTIONS } from "@/lib/prompt-to-elements";

interface RegionPromptBarProps {
  regionId: string;
  onGenerate: (elements: EmailElement[]) => void;
  existingElements: EmailElement[];
  compact?: boolean;
}

export function RegionPromptBar({
  regionId,
  onGenerate,
  existingElements,
  compact = false,
}: RegionPromptBarProps) {
  const [prompt, setPrompt] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showSuggestions && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showSuggestions]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);

    // Generate elements from prompt
    const elements = promptToElements(prompt.trim());

    // Small delay for visual feedback
    await new Promise((r) => setTimeout(r, 300));

    onGenerate(elements);
    setPrompt("");
    setIsGenerating(false);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestionPrompt: string) => {
    const elements = promptToElements(suggestionPrompt);
    onGenerate(elements);
    setShowSuggestions(false);
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
      {/* Prompt input */}
      <div className="flex items-center gap-2 px-3 py-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-100">
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
        <input
          ref={inputRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe what you want here... e.g. &quot;flash sale timer&quot;"
          className="flex-1 border-0 bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
          autoFocus
        />
        {prompt.trim() && (
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="shrink-0 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {isGenerating ? (
              <span className="flex items-center gap-1">
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Generating
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
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Quick suggestion chips */}
      <div className="border-t border-gray-100 px-3 py-2">
        <div className="flex flex-wrap gap-1.5">
          {PROMPT_SUGGESTIONS.slice(0, 12).map((s) => (
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
      </div>
    </div>
  );
}
