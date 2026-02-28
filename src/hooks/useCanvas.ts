"use client";

import { useCallback, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import type { Point, Stroke, SketchTool, SketchState } from "@/types/builder";

const INITIAL_STATE: SketchState = {
  strokes: [],
  currentTool: "pen",
  currentColor: "#000000",
  strokeWidth: 3,
  canvasWidth: 600,
  canvasHeight: 800,
};

export function useCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [state, setState] = useState<SketchState>(INITIAL_STATE);
  const [isDrawing, setIsDrawing] = useState(false);
  const [undoStack, setUndoStack] = useState<Stroke[][]>([]);
  const activeStrokeRef = useRef<Point[]>([]);

  const getCanvasPoint = useCallback(
    (e: React.TouchEvent | React.MouseEvent): Point => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      if ("touches" in e) {
        const touch = e.touches[0];
        return {
          x: (touch.clientX - rect.left) * scaleX,
          y: (touch.clientY - rect.top) * scaleY,
        };
      }
      return {
        x: ((e as React.MouseEvent).clientX - rect.left) * scaleX,
        y: ((e as React.MouseEvent).clientY - rect.top) * scaleY,
      };
    },
    [],
  );

  const redraw = useCallback(
    (strokes: Stroke[]) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw white background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid lines for email layout guidance
      ctx.strokeStyle = "#f0f0f0";
      ctx.lineWidth = 1;
      const gridSpacing = 40;
      for (let x = gridSpacing; x < canvas.width; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = gridSpacing; y < canvas.height; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw all strokes
      for (const stroke of strokes) {
        if (stroke.points.length < 2) continue;

        ctx.beginPath();
        ctx.strokeStyle = stroke.tool === "eraser" ? "#ffffff" : stroke.color;
        ctx.lineWidth = stroke.width;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        if (stroke.tool === "marker") {
          ctx.globalAlpha = 0.4;
        } else {
          ctx.globalAlpha = 1;
        }

        if (stroke.tool === "rectangle") {
          const start = stroke.points[0];
          const end = stroke.points[stroke.points.length - 1];
          ctx.strokeRect(
            start.x,
            start.y,
            end.x - start.x,
            end.y - start.y,
          );
        } else if (stroke.tool === "line") {
          const start = stroke.points[0];
          const end = stroke.points[stroke.points.length - 1];
          ctx.moveTo(start.x, start.y);
          ctx.lineTo(end.x, end.y);
          ctx.stroke();
        } else {
          ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
          for (let i = 1; i < stroke.points.length; i++) {
            ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
          }
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }
    },
    [],
  );

  const startDrawing = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      e.preventDefault();
      const point = getCanvasPoint(e);
      activeStrokeRef.current = [point];
      setIsDrawing(true);
    },
    [getCanvasPoint],
  );

  const draw = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      e.preventDefault();
      if (!isDrawing) return;

      const point = getCanvasPoint(e);
      activeStrokeRef.current.push(point);

      // Live preview: draw current stroke
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const points = activeStrokeRef.current;
      if (points.length < 2) return;

      // For rectangle/line, redraw everything + preview
      if (state.currentTool === "rectangle" || state.currentTool === "line") {
        redraw(state.strokes);
        ctx.beginPath();
        ctx.strokeStyle = state.currentColor;
        ctx.lineWidth = state.strokeWidth;
        ctx.lineCap = "round";

        if (state.currentTool === "rectangle") {
          ctx.strokeRect(
            points[0].x,
            points[0].y,
            point.x - points[0].x,
            point.y - points[0].y,
          );
        } else {
          ctx.moveTo(points[0].x, points[0].y);
          ctx.lineTo(point.x, point.y);
          ctx.stroke();
        }
        return;
      }

      // For freehand, just extend the line
      const prev = points[points.length - 2];
      ctx.beginPath();
      ctx.strokeStyle =
        state.currentTool === "eraser" ? "#ffffff" : state.currentColor;
      ctx.lineWidth = state.strokeWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      if (state.currentTool === "marker") ctx.globalAlpha = 0.4;
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
      ctx.globalAlpha = 1;
    },
    [isDrawing, getCanvasPoint, state, redraw],
  );

  const stopDrawing = useCallback(() => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (activeStrokeRef.current.length > 1) {
      const newStroke: Stroke = {
        id: uuid(),
        points: [...activeStrokeRef.current],
        color: state.currentColor,
        width: state.strokeWidth,
        tool: state.currentTool,
      };

      setState((prev) => {
        const newStrokes = [...prev.strokes, newStroke];
        redraw(newStrokes);
        return { ...prev, strokes: newStrokes };
      });

      setUndoStack((prev) => [...prev, state.strokes]);
    }

    activeStrokeRef.current = [];
  }, [isDrawing, state, redraw]);

  const setTool = useCallback((tool: SketchTool) => {
    setState((prev) => ({ ...prev, currentTool: tool }));
  }, []);

  const setColor = useCallback((color: string) => {
    setState((prev) => ({ ...prev, currentColor: color }));
  }, []);

  const setStrokeWidth = useCallback((width: number) => {
    setState((prev) => ({ ...prev, strokeWidth: width }));
  }, []);

  const undo = useCallback(() => {
    if (undoStack.length === 0) return;
    const previousStrokes = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, -1));
    setState((prev) => {
      redraw(previousStrokes);
      return { ...prev, strokes: previousStrokes };
    });
  }, [undoStack, redraw]);

  const clear = useCallback(() => {
    setUndoStack((prev) => [...prev, state.strokes]);
    setState((prev) => {
      redraw([]);
      return { ...prev, strokes: [] };
    });
  }, [state.strokes, redraw]);

  const getCanvasDataUrl = useCallback((): string => {
    const canvas = canvasRef.current;
    if (!canvas) return "";
    return canvas.toDataURL("image/png");
  }, []);

  return {
    canvasRef,
    state,
    isDrawing,
    startDrawing,
    draw,
    stopDrawing,
    setTool,
    setColor,
    setStrokeWidth,
    undo,
    clear,
    redraw,
    getCanvasDataUrl,
  };
}
