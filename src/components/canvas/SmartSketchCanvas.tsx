"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { v4 as uuid } from "uuid";
import type {
  SmartRegion,
  EmailElement,
  EmailTemplate,
  RegionBounds,
} from "@/types/builder";
import { RegionPromptBar } from "./RegionPromptBar";
import { RegionElementEditor } from "./RegionElementEditor";
import { SmartToolbar } from "./SmartToolbar";
import { recognizeContent } from "@/lib/handwriting-recognizer";
import { promptToElements } from "@/lib/prompt-to-elements";
import type { Stroke, Point, SketchTool } from "@/types/builder";

const CANVAS_W = 600;
const CANVAS_H = 900;

interface SmartSketchCanvasProps {
  onConvert: (template: EmailTemplate) => void;
}

export function SmartSketchCanvas({ onConvert }: SmartSketchCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const [regions, setRegions] = useState<SmartRegion[]>([]);
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  const [editingElementId, setEditingElementId] = useState<string | null>(null);
  const [tool, setTool] = useState<SketchTool>("rectangle");
  const [color, setColor] = useState("#4F46E5");
  const [strokeWidth, setStrokeWidth] = useState(2);

  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const drawStartRef = useRef<Point | null>(null);
  const [freeStrokes, setFreeStrokes] = useState<Stroke[]>([]);
  const activePointsRef = useRef<Point[]>([]);

  // Column configuration for new regions
  const [pendingColumns, setPendingColumns] = useState(1);

  // ── Canvas coordinate helper ──
  const getPoint = useCallback(
    (e: React.TouchEvent | React.MouseEvent): Point => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      if ("touches" in e) {
        const t = e.touches[0];
        return { x: (t.clientX - rect.left) * scaleX, y: (t.clientY - rect.top) * scaleY };
      }
      return {
        x: ((e as React.MouseEvent).clientX - rect.left) * scaleX,
        y: ((e as React.MouseEvent).clientY - rect.top) * scaleY,
      };
    },
    [],
  );

  // ── Redraw the canvas ──
  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    // Background
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Subtle grid
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 0.5;
    for (let x = 40; x < CANVAS_W; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CANVAS_H);
      ctx.stroke();
    }
    for (let y = 40; y < CANVAS_H; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(CANVAS_W, y);
      ctx.stroke();
    }

    // Center guide line
    ctx.strokeStyle = "#c7d2fe";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(CANVAS_W / 2, 0);
    ctx.lineTo(CANVAS_W / 2, CANVAS_H);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw regions
    for (const region of regions) {
      const isSelected = region.id === selectedRegionId;
      const b = region.bounds;

      // Region fill
      ctx.fillStyle = isSelected ? "rgba(79, 70, 229, 0.06)" : "rgba(99, 102, 241, 0.03)";
      ctx.fillRect(b.x, b.y, b.width, b.height);

      // Region border
      ctx.strokeStyle = isSelected ? "#4F46E5" : "#a5b4fc";
      ctx.lineWidth = isSelected ? 2.5 : 1.5;
      ctx.setLineDash(isSelected ? [] : [6, 3]);
      ctx.strokeRect(b.x, b.y, b.width, b.height);
      ctx.setLineDash([]);

      // Region label
      ctx.fillStyle = isSelected ? "#4F46E5" : "#6366f1";
      ctx.font = "bold 11px Arial";
      ctx.fillText(
        region.label.toUpperCase(),
        b.x + 8,
        b.y + 16,
      );

      // Column dividers
      if (region.subRegions.length > 1) {
        ctx.strokeStyle = "#c7d2fe";
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        for (let i = 1; i < region.subRegions.length; i++) {
          const sub = region.subRegions[i];
          ctx.beginPath();
          ctx.moveTo(sub.bounds.x, sub.bounds.y);
          ctx.lineTo(sub.bounds.x, sub.bounds.y + sub.bounds.height);
          ctx.stroke();
        }
        ctx.setLineDash([]);
      }

      // Element count indicator
      const totalEls = region.subRegions.reduce(
        (sum, sr) => sum + sr.elements.length,
        region.elements.length,
      );
      if (totalEls > 0) {
        const badge = `${totalEls} element${totalEls !== 1 ? "s" : ""}`;
        ctx.fillStyle = "#818cf8";
        ctx.font = "10px Arial";
        ctx.fillText(badge, b.x + b.width - ctx.measureText(badge).width - 8, b.y + 16);
      }
    }

    // Draw free-form strokes (pen/marker drawings inside regions)
    for (const stroke of freeStrokes) {
      if (stroke.points.length < 2) continue;
      ctx.beginPath();
      ctx.strokeStyle = stroke.tool === "eraser" ? "#f8fafc" : stroke.color;
      ctx.lineWidth = stroke.width;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.globalAlpha = stroke.tool === "marker" ? 0.4 : 1;
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }, [regions, selectedRegionId, freeStrokes]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = CANVAS_W;
    canvas.height = CANVAS_H;
    redraw();
  }, [redraw]);

  // ── Drawing handlers ──
  const startDrawing = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      e.preventDefault();
      const pt = getPoint(e);
      drawStartRef.current = pt;
      activePointsRef.current = [pt];
      setIsDrawing(true);
    },
    [getPoint],
  );

  const onDraw = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      e.preventDefault();
      if (!isDrawing || !drawStartRef.current) return;
      const pt = getPoint(e);
      activePointsRef.current.push(pt);

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      if (tool === "rectangle") {
        redraw();
        const start = drawStartRef.current;
        ctx.strokeStyle = color;
        ctx.lineWidth = strokeWidth;
        ctx.setLineDash([6, 3]);
        ctx.strokeRect(
          start.x, start.y,
          pt.x - start.x, pt.y - start.y,
        );
        ctx.setLineDash([]);
        // Size label
        const w = Math.abs(Math.round(pt.x - start.x));
        const h = Math.abs(Math.round(pt.y - start.y));
        ctx.fillStyle = "#4F46E5";
        ctx.font = "11px Arial";
        ctx.fillText(`${w} × ${h}`, Math.min(start.x, pt.x), Math.min(start.y, pt.y) - 4);
      } else if (tool === "line") {
        redraw();
        const start = drawStartRef.current;
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = strokeWidth;
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(pt.x, pt.y);
        ctx.stroke();
      } else {
        // Freehand
        const points = activePointsRef.current;
        if (points.length >= 2) {
          const prev = points[points.length - 2];
          ctx.beginPath();
          ctx.strokeStyle = tool === "eraser" ? "#f8fafc" : color;
          ctx.lineWidth = strokeWidth;
          ctx.lineCap = "round";
          ctx.globalAlpha = tool === "marker" ? 0.4 : 1;
          ctx.moveTo(prev.x, prev.y);
          ctx.lineTo(pt.x, pt.y);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    },
    [isDrawing, getPoint, tool, color, strokeWidth, redraw],
  );

  const stopDrawing = useCallback(() => {
    if (!isDrawing || !drawStartRef.current) return;
    setIsDrawing(false);

    const start = drawStartRef.current;
    const points = activePointsRef.current;

    if (tool === "rectangle" && points.length > 1) {
      const end = points[points.length - 1];
      const x = Math.min(start.x, end.x);
      const y = Math.min(start.y, end.y);
      const w = Math.abs(end.x - start.x);
      const h = Math.abs(end.y - start.y);

      // Minimum size check
      if (w > 40 && h > 30) {
        const bounds: RegionBounds = { x, y, width: w, height: h };

        // Check if drawing inside an existing region (creates sub-region)
        const parentRegion = regions.find((r) => {
          const b = r.bounds;
          return x >= b.x && y >= b.y && x + w <= b.x + b.width && y + h <= b.y + b.height;
        });

        if (parentRegion) {
          // Add as sub-region (column)
          const subRegion: SmartRegion = {
            id: uuid(),
            bounds,
            role: "custom",
            label: `Column ${parentRegion.subRegions.length + 1}`,
            elements: [],
            subRegions: [],
          };
          setRegions((prev) =>
            prev.map((r) =>
              r.id === parentRegion.id
                ? { ...r, subRegions: [...r.subRegions, subRegion] }
                : r,
            ),
          );
          setSelectedRegionId(subRegion.id);
        } else {
          // Create top-level region with optional columns
          const role = y < 120 ? "header" : y > CANVAS_H - 150 ? "footer" : "content";
          const label = role === "header" ? "Header" : role === "footer" ? "Footer" : `Section ${regions.length + 1}`;

          const subRegions: SmartRegion[] = [];
          if (pendingColumns > 1) {
            const colWidth = w / pendingColumns;
            for (let i = 0; i < pendingColumns; i++) {
              subRegions.push({
                id: uuid(),
                bounds: {
                  x: x + i * colWidth,
                  y: y + 24,
                  width: colWidth,
                  height: h - 24,
                },
                role: "custom",
                label: `Col ${i + 1}`,
                elements: [],
                subRegions: [],
              });
            }
          }

          const region: SmartRegion = {
            id: uuid(),
            bounds,
            role,
            label,
            elements: [],
            subRegions,
          };
          setRegions((prev) => [...prev, region]);
          setSelectedRegionId(region.id);
        }
      }
    } else if (tool === "pen" || tool === "marker" || tool === "eraser") {
      // Check if these strokes are inside a region
      if (points.length > 1) {
        const stroke: Stroke = {
          id: uuid(),
          points: [...points],
          color,
          width: strokeWidth,
          tool,
        };

        // Find which region contains this stroke
        const regionCenter = {
          x: (Math.min(...points.map((p) => p.x)) + Math.max(...points.map((p) => p.x))) / 2,
          y: (Math.min(...points.map((p) => p.y)) + Math.max(...points.map((p) => p.y))) / 2,
        };

        const containingRegion = findContainingRegion(regions, regionCenter);

        if (containingRegion) {
          // Try to recognize what was drawn
          const recognized = recognizeContent([stroke]);
          if (recognized.suggestedPrompt && recognized.confidence > 0.5) {
            const elements = promptToElements(recognized.suggestedPrompt);
            addElementsToRegion(containingRegion, elements);
          } else {
            // Store the stroke for later recognition
            setFreeStrokes((prev) => [...prev, stroke]);
          }
        } else {
          setFreeStrokes((prev) => [...prev, stroke]);
        }
      }
    }

    drawStartRef.current = null;
    activePointsRef.current = [];
    redraw();
  }, [isDrawing, tool, color, strokeWidth, regions, pendingColumns, redraw]);

  // ── Region helpers ──
  function findContainingRegion(
    regionList: SmartRegion[],
    point: Point,
  ): string | null {
    // Check sub-regions first (more specific)
    for (const r of regionList) {
      for (const sub of r.subRegions) {
        const b = sub.bounds;
        if (
          point.x >= b.x && point.x <= b.x + b.width &&
          point.y >= b.y && point.y <= b.y + b.height
        ) {
          return sub.id;
        }
      }
      const b = r.bounds;
      if (
        point.x >= b.x && point.x <= b.x + b.width &&
        point.y >= b.y && point.y <= b.y + b.height
      ) {
        return r.id;
      }
    }
    return null;
  }

  const addElementsToRegion = useCallback(
    (regionId: string, elements: EmailElement[]) => {
      setRegions((prev) =>
        prev.map((r) => {
          // Check top-level
          if (r.id === regionId) {
            return { ...r, elements: [...r.elements, ...elements] };
          }
          // Check sub-regions
          const updatedSubs = r.subRegions.map((sub) =>
            sub.id === regionId
              ? { ...sub, elements: [...sub.elements, ...elements] }
              : sub,
          );
          return { ...r, subRegions: updatedSubs };
        }),
      );
    },
    [],
  );

  const updateElementInRegion = useCallback(
    (regionId: string, updated: EmailElement) => {
      setRegions((prev) =>
        prev.map((r) => {
          if (r.id === regionId) {
            return {
              ...r,
              elements: r.elements.map((el) => (el.id === updated.id ? updated : el)),
            };
          }
          const updatedSubs = r.subRegions.map((sub) =>
            sub.id === regionId
              ? {
                  ...sub,
                  elements: sub.elements.map((el) =>
                    el.id === updated.id ? updated : el,
                  ),
                }
              : sub,
          );
          return { ...r, subRegions: updatedSubs };
        }),
      );
    },
    [],
  );

  const deleteElementFromRegion = useCallback(
    (regionId: string, elementId: string) => {
      setRegions((prev) =>
        prev.map((r) => {
          if (r.id === regionId) {
            return { ...r, elements: r.elements.filter((el) => el.id !== elementId) };
          }
          const updatedSubs = r.subRegions.map((sub) =>
            sub.id === regionId
              ? { ...sub, elements: sub.elements.filter((el) => el.id !== elementId) }
              : sub,
          );
          return { ...r, subRegions: updatedSubs };
        }),
      );
    },
    [],
  );

  const moveElementInRegion = useCallback(
    (regionId: string, elementId: string, direction: "up" | "down") => {
      setRegions((prev) =>
        prev.map((r) => {
          const updateElements = (elements: EmailElement[]) => {
            const idx = elements.findIndex((el) => el.id === elementId);
            if (idx === -1) return elements;
            if (direction === "up" && idx === 0) return elements;
            if (direction === "down" && idx === elements.length - 1) return elements;
            const newElements = [...elements];
            const swap = direction === "up" ? idx - 1 : idx + 1;
            [newElements[idx], newElements[swap]] = [newElements[swap], newElements[idx]];
            return newElements;
          };

          if (r.id === regionId) {
            return { ...r, elements: updateElements(r.elements) };
          }
          const updatedSubs = r.subRegions.map((sub) =>
            sub.id === regionId
              ? { ...sub, elements: updateElements(sub.elements) }
              : sub,
          );
          return { ...r, subRegions: updatedSubs };
        }),
      );
    },
    [],
  );

  const deleteRegion = useCallback((regionId: string) => {
    setRegions((prev) => {
      // Try removing top-level
      const filtered = prev.filter((r) => r.id !== regionId);
      if (filtered.length < prev.length) return filtered;
      // Try removing sub-region
      return prev.map((r) => ({
        ...r,
        subRegions: r.subRegions.filter((sub) => sub.id !== regionId),
      }));
    });
    setSelectedRegionId(null);
  }, []);

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      const pt = getPoint(e);
      const regionId = findContainingRegion(regions, pt);
      setSelectedRegionId(regionId);
      setEditingElementId(null);
    },
    [getPoint, regions],
  );

  // ── Convert to email template ──
  const handleConvert = useCallback(() => {
    const allElements: EmailElement[] = [];

    // Sort regions top-to-bottom
    const sorted = [...regions].sort((a, b) => a.bounds.y - b.bounds.y);

    for (const region of sorted) {
      if (region.subRegions.length > 1) {
        // Multi-column region → ColumnsElement
        const columns = region.subRegions.map((sub) => ({
          width: `${Math.round((sub.bounds.width / region.bounds.width) * 100)}%`,
          elements: [...sub.elements],
        }));
        allElements.push({
          id: uuid(),
          type: "columns",
          columns,
          styles: { padding: "10px 0" },
        });
      } else if (region.subRegions.length === 1) {
        allElements.push(...region.subRegions[0].elements);
      }

      // Add the region's own elements
      allElements.push(...region.elements);
    }

    const template: EmailTemplate = {
      id: uuid(),
      name: "Sketch Design",
      subject: "Your Email Subject",
      preheader: "",
      bodyBackground: "#f4f4f7",
      contentBackground: "#ffffff",
      contentWidth: "600px",
      fontFamily: "Arial, sans-serif",
      elements: allElements,
    };

    onConvert(template);
  }, [regions, onConvert]);

  // ── Render region overlay panels ──
  function renderRegionPanel(region: SmartRegion, isSubRegion = false) {
    const b = region.bounds;
    const isSelected = selectedRegionId === region.id;
    const scale = (overlayRef.current?.clientWidth || CANVAS_W) / CANVAS_W;

    return (
      <div key={region.id}>
        {/* Region overlay — positioned to match canvas coordinates */}
        <div
          className={`absolute cursor-pointer transition-all ${
            isSelected ? "z-20" : "z-10"
          }`}
          style={{
            left: b.x * scale,
            top: b.y * scale,
            width: b.width * scale,
            height: b.height * scale,
          }}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedRegionId(region.id);
          }}
        >
          {/* Elements inside this region */}
          {isSelected && (
            <div
              className="absolute inset-0 overflow-y-auto p-2"
              style={{ top: isSubRegion ? 0 : 24 * scale }}
            >
              <div className="space-y-2">
                {region.elements.map((el, idx) => (
                  <RegionElementEditor
                    key={el.id}
                    element={el}
                    onChange={(updated) => updateElementInRegion(region.id, updated)}
                    onDelete={() => deleteElementFromRegion(region.id, el.id)}
                    onMoveUp={() => moveElementInRegion(region.id, el.id, "up")}
                    onMoveDown={() => moveElementInRegion(region.id, el.id, "down")}
                    isFirst={idx === 0}
                    isLast={idx === region.elements.length - 1}
                  />
                ))}

                {/* AI Prompt Bar — available in every region and column */}
                <RegionPromptBar
                  regionId={region.id}
                  onGenerate={(elements) => addElementsToRegion(region.id, elements)}
                  existingElements={region.elements}
                  compact={region.elements.length > 0}
                />
              </div>
            </div>
          )}

          {/* Delete region button */}
          {isSelected && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteRegion(region.id);
              }}
              className="absolute -right-2 -top-2 z-30 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white shadow-lg hover:bg-red-600"
            >
              ×
            </button>
          )}
        </div>

        {/* Render sub-regions (columns) */}
        {region.subRegions.map((sub) => renderRegionPanel(sub, true))}
      </div>
    );
  }

  const totalElements = regions.reduce(
    (sum, r) =>
      sum +
      r.elements.length +
      r.subRegions.reduce((s, sr) => s + sr.elements.length, 0),
    0,
  );

  return (
    <div className="flex flex-col gap-4">
      <SmartToolbar
        tool={tool}
        color={color}
        strokeWidth={strokeWidth}
        columns={pendingColumns}
        onToolChange={setTool}
        onColorChange={setColor}
        onStrokeWidthChange={setStrokeWidth}
        onColumnsChange={setPendingColumns}
        onClear={() => {
          setRegions([]);
          setFreeStrokes([]);
          setSelectedRegionId(null);
          redraw();
        }}
        onConvert={handleConvert}
        canConvert={totalElements > 0}
        regionCount={regions.length}
        elementCount={totalElements}
      />

      <div className="flex justify-center">
        <div className="relative rounded-xl border-2 border-gray-200 bg-white shadow-lg overflow-hidden">
          {/* Guide label */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
            <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] text-gray-400 backdrop-blur-sm shadow-sm border border-gray-100">
              Draw rectangles to create sections — then use AI prompts to fill them
            </span>
          </div>

          {/* Canvas */}
          <canvas
            ref={canvasRef}
            className="cursor-crosshair touch-none"
            style={{ width: CANVAS_W, height: CANVAS_H }}
            onMouseDown={startDrawing}
            onMouseMove={onDraw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={onDraw}
            onTouchEnd={stopDrawing}
            onClick={handleCanvasClick}
          />

          {/* Region overlays */}
          <div
            ref={overlayRef}
            className="absolute inset-0 pointer-events-none"
            style={{ width: CANVAS_W, height: CANVAS_H }}
          >
            <div className="pointer-events-auto">
              {regions.map((r) => renderRegionPanel(r))}
            </div>
          </div>
        </div>
      </div>

      {/* Status / help */}
      <div className="text-center">
        {regions.length === 0 ? (
          <p className="text-sm text-gray-500">
            <span className="font-medium text-indigo-600">Step 1:</span> Draw a rectangle to create a section. Set columns first if needed.
          </p>
        ) : totalElements === 0 ? (
          <p className="text-sm text-gray-500">
            <span className="font-medium text-indigo-600">Step 2:</span> Click a section and use the AI prompt to describe what goes inside.
          </p>
        ) : (
          <p className="text-sm text-gray-500">
            {regions.length} section{regions.length !== 1 && "s"} ·{" "}
            {totalElements} element{totalElements !== 1 && "s"} ·{" "}
            <span className="font-medium text-indigo-600">
              Click &quot;Convert to Email&quot; when ready
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
