import type { Stroke, Point } from "@/types/builder";

// ── Handwriting / Sketch Content Recognizer ──
// Detects whether strokes inside a region represent:
// 1. Hand-written text (tries to interpret it)
// 2. Common shapes (X for image, circle for button, line for divider)
// 3. Layout indicators (columns, stacking)
//
// When an API key is available, sends canvas region as image to Claude Vision
// for accurate OCR. Otherwise uses heuristic shape/content analysis.

export interface RecognizedContent {
  type: "text" | "heading" | "button" | "image" | "divider" | "shape" | "unknown";
  confidence: number;
  text?: string;
  suggestedPrompt?: string;
}

interface StrokeBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

function getStrokeBounds(stroke: Stroke): StrokeBounds {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const p of stroke.points) {
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  }
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

function getGroupBounds(strokes: Stroke[]): StrokeBounds {
  const all = strokes.map(getStrokeBounds);
  return {
    x: Math.min(...all.map(b => b.x)),
    y: Math.min(...all.map(b => b.y)),
    width: Math.max(...all.map(b => b.x + b.width)) - Math.min(...all.map(b => b.x)),
    height: Math.max(...all.map(b => b.y + b.height)) - Math.min(...all.map(b => b.y)),
  };
}

function strokeLength(stroke: Stroke): number {
  let len = 0;
  for (let i = 1; i < stroke.points.length; i++) {
    const dx = stroke.points[i].x - stroke.points[i - 1].x;
    const dy = stroke.points[i].y - stroke.points[i - 1].y;
    len += Math.sqrt(dx * dx + dy * dy);
  }
  return len;
}

function isStraightLine(stroke: Stroke): boolean {
  if (stroke.points.length < 2) return false;
  const start = stroke.points[0];
  const end = stroke.points[stroke.points.length - 1];
  const directDist = Math.sqrt((end.x - start.x) ** 2 + (end.y - start.y) ** 2);
  const pathLen = strokeLength(stroke);
  return pathLen > 0 && directDist / pathLen > 0.85;
}

function isHorizontalStroke(stroke: Stroke): boolean {
  const bounds = getStrokeBounds(stroke);
  return bounds.width > 50 && bounds.height < 15 && isStraightLine(stroke);
}

function isXShape(strokes: Stroke[]): boolean {
  if (strokes.length !== 2) return false;
  const s1 = strokes[0], s2 = strokes[1];
  if (!isStraightLine(s1) || !isStraightLine(s2)) return false;
  // Check if they cross
  const b1 = getStrokeBounds(s1), b2 = getStrokeBounds(s2);
  const overlapX = Math.min(b1.x + b1.width, b2.x + b2.width) - Math.max(b1.x, b2.x);
  const overlapY = Math.min(b1.y + b1.height, b2.y + b2.height) - Math.max(b1.y, b2.y);
  return overlapX > 10 && overlapY > 10;
}

function isCircleish(stroke: Stroke): boolean {
  if (stroke.points.length < 10) return false;
  const bounds = getStrokeBounds(stroke);
  const aspectRatio = bounds.width / Math.max(bounds.height, 1);
  if (aspectRatio < 0.5 || aspectRatio > 2) return false;

  // Check if start and end are close (closed shape)
  const start = stroke.points[0];
  const end = stroke.points[stroke.points.length - 1];
  const closeDist = Math.sqrt((end.x - start.x) ** 2 + (end.y - start.y) ** 2);
  const size = Math.max(bounds.width, bounds.height);
  return closeDist < size * 0.4;
}

function isRectangleish(stroke: Stroke): boolean {
  if (stroke.tool === "rectangle") return true;
  if (stroke.points.length < 8) return false;
  const bounds = getStrokeBounds(stroke);
  if (bounds.width < 30 || bounds.height < 20) return false;

  const start = stroke.points[0];
  const end = stroke.points[stroke.points.length - 1];
  const closeDist = Math.sqrt((end.x - start.x) ** 2 + (end.y - start.y) ** 2);
  return closeDist < Math.max(bounds.width, bounds.height) * 0.3;
}

// Detect if strokes look like handwritten text (lots of small horizontal movement)
function looksLikeHandwriting(strokes: Stroke[]): boolean {
  if (strokes.length === 0) return false;
  const groupBounds = getGroupBounds(strokes);

  // Text is typically wider than tall, with multiple small strokes
  const isWide = groupBounds.width > groupBounds.height * 1.5;
  const hasMultipleStrokes = strokes.length >= 2;
  const smallStrokes = strokes.filter(s => {
    const b = getStrokeBounds(s);
    return b.height < 60 && b.width < 150;
  });

  return (isWide && hasMultipleStrokes) || smallStrokes.length >= 3;
}

// Count direction changes to estimate complexity (letters have many)
function strokeComplexity(stroke: Stroke): number {
  let changes = 0;
  for (let i = 2; i < stroke.points.length; i++) {
    const dx1 = stroke.points[i - 1].x - stroke.points[i - 2].x;
    const dy1 = stroke.points[i - 1].y - stroke.points[i - 2].y;
    const dx2 = stroke.points[i].x - stroke.points[i - 1].x;
    const dy2 = stroke.points[i].y - stroke.points[i - 1].y;
    if (Math.sign(dx1) !== Math.sign(dx2) || Math.sign(dy1) !== Math.sign(dy2)) {
      changes++;
    }
  }
  return changes;
}

// ── Main recognition function ──

export function recognizeContent(strokes: Stroke[]): RecognizedContent {
  if (strokes.length === 0) {
    return { type: "unknown", confidence: 0 };
  }

  const drawStrokes = strokes.filter(s => s.tool !== "eraser");
  if (drawStrokes.length === 0) {
    return { type: "unknown", confidence: 0 };
  }

  const groupBounds = getGroupBounds(drawStrokes);

  // Check for X shape (image placeholder)
  if (isXShape(drawStrokes)) {
    return {
      type: "image",
      confidence: 0.8,
      suggestedPrompt: "placeholder image",
    };
  }

  // Check for single horizontal line (divider)
  if (drawStrokes.length === 1 && isHorizontalStroke(drawStrokes[0])) {
    return {
      type: "divider",
      confidence: 0.85,
      suggestedPrompt: "divider line",
    };
  }

  // Check for circle (button indicator)
  if (drawStrokes.length === 1 && isCircleish(drawStrokes[0])) {
    return {
      type: "button",
      confidence: 0.7,
      suggestedPrompt: 'button "Click Here"',
    };
  }

  // Check for rectangle with content inside (button with text)
  if (drawStrokes.length >= 2) {
    const rectStrokes = drawStrokes.filter(isRectangleish);
    const otherStrokes = drawStrokes.filter(s => !isRectangleish(s));

    if (rectStrokes.length === 1 && otherStrokes.length > 0) {
      const rectBounds = getStrokeBounds(rectStrokes[0]);
      const isSmallRect = rectBounds.height < 80 && rectBounds.width < 300;

      if (isSmallRect && looksLikeHandwriting(otherStrokes)) {
        return {
          type: "button",
          confidence: 0.75,
          text: "Click Here",
          suggestedPrompt: 'button "Click Here"',
        };
      }

      if (!isSmallRect) {
        return {
          type: "image",
          confidence: 0.65,
          suggestedPrompt: "image placeholder",
        };
      }
    }
  }

  // Check for handwriting-like content
  if (looksLikeHandwriting(drawStrokes)) {
    const avgComplexity = drawStrokes.reduce((sum, s) => sum + strokeComplexity(s), 0) / drawStrokes.length;
    const isLarge = groupBounds.height > 30;

    if (isLarge && drawStrokes.length <= 5 && avgComplexity > 3) {
      return {
        type: "heading",
        confidence: 0.65,
        text: "Your Heading",
        suggestedPrompt: "heading",
      };
    }

    return {
      type: "text",
      confidence: 0.6,
      text: "Your text content",
      suggestedPrompt: "text paragraph",
    };
  }

  // Fallback
  return {
    type: "unknown",
    confidence: 0.3,
    suggestedPrompt: "text",
  };
}

// ── Vision API OCR (when available) ──

export async function recognizeWithVision(
  imageDataUrl: string,
): Promise<RecognizedContent | null> {
  try {
    const response = await fetch("/api/analyze-sketch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: imageDataUrl, width: 0, height: 0 }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    if (data.method === "ai" && data.elements?.length > 0) {
      const first = data.elements[0];
      return {
        type: first.type || "text",
        confidence: first.confidence || 0.8,
        text: first.content || undefined,
        suggestedPrompt: first.content || first.type,
      };
    }
  } catch {
    // Fall through to null
  }
  return null;
}
