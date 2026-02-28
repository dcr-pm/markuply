"use client";

import { useEffect } from "react";
import { useCanvas } from "@/hooks/useCanvas";
import { SketchToolbar } from "./SketchToolbar";
import type { EmailTemplate } from "@/types/builder";
import { sketchToTemplate } from "@/lib/sketch-to-html";

interface SketchCanvasProps {
  onConvert: (template: EmailTemplate) => void;
}

export function SketchCanvas({ onConvert }: SketchCanvasProps) {
  const {
    canvasRef,
    state,
    startDrawing,
    draw,
    stopDrawing,
    setTool,
    setColor,
    setStrokeWidth,
    undo,
    clear,
    redraw,
  } = useCanvas();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = 600;
    canvas.height = 800;
    redraw(state.strokes);
    // Only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConvert = () => {
    const template = sketchToTemplate(state.strokes, 600, 800);
    onConvert(template);
  };

  return (
    <div className="flex flex-col gap-4">
      <SketchToolbar
        currentTool={state.currentTool}
        currentColor={state.currentColor}
        strokeWidth={state.strokeWidth}
        onToolChange={setTool}
        onColorChange={setColor}
        onStrokeWidthChange={setStrokeWidth}
        onUndo={undo}
        onClear={clear}
        onConvert={handleConvert}
        hasStrokes={state.strokes.length > 0}
      />

      <div className="flex justify-center">
        <div className="relative rounded-xl border-2 border-gray-200 bg-white shadow-lg overflow-hidden">
          {/* Canvas area guide */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
            <span className="rounded-full bg-gray-100/80 px-3 py-1 text-xs text-gray-400 backdrop-blur-sm">
              600 × 800 — Sketch your email layout
            </span>
          </div>

          <canvas
            ref={canvasRef}
            className="cursor-crosshair touch-none"
            style={{ width: 600, height: 800 }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
        </div>
      </div>

      {state.strokes.length > 0 && (
        <p className="text-center text-sm text-gray-500">
          {state.strokes.length} stroke{state.strokes.length !== 1 && "s"} —
          Draw rectangles for images, wavy lines for text, small boxes for
          buttons, straight lines for dividers
        </p>
      )}
    </div>
  );
}
