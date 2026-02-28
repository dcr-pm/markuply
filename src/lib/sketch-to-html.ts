import { v4 as uuid } from "uuid";
import type {
  Stroke,
  DetectedRegion,
  EmailElement,
  EmailTemplate,
  Point,
} from "@/types/builder";

// ── Sketch Analysis Engine ──
// Analyzes canvas strokes to detect email layout regions and converts them to email elements

interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

function strokeBounds(stroke: Stroke): BoundingBox {
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  for (const p of stroke.points) {
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  }
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

function isRectangular(stroke: Stroke): boolean {
  if (stroke.tool === "rectangle") return true;
  if (stroke.points.length < 4) return false;

  const bounds = strokeBounds(stroke);
  const aspectRatio = bounds.width / Math.max(bounds.height, 1);

  // Check if points roughly trace a rectangle
  const corners = findCorners(stroke.points);
  return corners.length >= 3 && aspectRatio > 0.3 && aspectRatio < 10;
}

function findCorners(points: Point[]): Point[] {
  if (points.length < 4) return [];
  const corners: Point[] = [];
  const threshold = 30;

  for (let i = 1; i < points.length - 1; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const next = points[i + 1];

    const angle = Math.abs(
      Math.atan2(next.y - curr.y, next.x - curr.x) -
        Math.atan2(curr.y - prev.y, curr.x - prev.x),
    );

    if (angle > Math.PI / 4 && angle < (3 * Math.PI) / 4) {
      if (
        corners.length === 0 ||
        distance(corners[corners.length - 1], curr) > threshold
      ) {
        corners.push(curr);
      }
    }
  }
  return corners;
}

function distance(a: Point, b: Point): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function isHorizontalLine(stroke: Stroke): boolean {
  if (stroke.tool === "line") {
    const dy = Math.abs(
      stroke.points[0].y - stroke.points[stroke.points.length - 1].y,
    );
    const dx = Math.abs(
      stroke.points[0].x - stroke.points[stroke.points.length - 1].x,
    );
    return dx > 50 && dy < 20;
  }

  const bounds = strokeBounds(stroke);
  return bounds.width > 80 && bounds.height < 15;
}

function isWavyLine(stroke: Stroke): boolean {
  if (stroke.points.length < 10) return false;
  const bounds = strokeBounds(stroke);
  if (bounds.width < 60) return false;

  // Wavy lines = lots of horizontal movement, small vertical bounds
  const verticalVariance = bounds.height;
  return bounds.width > 80 && verticalVariance > 3 && verticalVariance < 30;
}

function isSmallCircleOrDot(stroke: Stroke): boolean {
  const bounds = strokeBounds(stroke);
  return (
    bounds.width < 30 &&
    bounds.height < 30 &&
    bounds.width > 5 &&
    bounds.height > 5
  );
}

function groupNearbyStrokes(
  strokes: Stroke[],
  threshold: number = 30,
): Stroke[][] {
  const groups: Stroke[][] = [];
  const used = new Set<number>();

  for (let i = 0; i < strokes.length; i++) {
    if (used.has(i)) continue;
    const group = [strokes[i]];
    used.add(i);

    const bounds = strokeBounds(strokes[i]);

    for (let j = i + 1; j < strokes.length; j++) {
      if (used.has(j)) continue;
      const otherBounds = strokeBounds(strokes[j]);

      const verticalGap = Math.abs(
        otherBounds.y - (bounds.y + bounds.height),
      );
      const horizontalOverlap =
        Math.min(bounds.x + bounds.width, otherBounds.x + otherBounds.width) -
        Math.max(bounds.x, otherBounds.x);

      if (verticalGap < threshold && horizontalOverlap > -threshold) {
        group.push(strokes[j]);
        used.add(j);
        // Expand bounds
        bounds.x = Math.min(bounds.x, otherBounds.x);
        bounds.y = Math.min(bounds.y, otherBounds.y);
        bounds.width =
          Math.max(
            bounds.x + bounds.width,
            otherBounds.x + otherBounds.width,
          ) - bounds.x;
        bounds.height =
          Math.max(
            bounds.y + bounds.height,
            otherBounds.y + otherBounds.height,
          ) - bounds.y;
      }
    }

    groups.push(group);
  }

  return groups;
}

function classifyRegion(
  strokes: Stroke[],
  canvasWidth: number,
): DetectedRegion {
  const allBounds = strokes.map(strokeBounds);
  const combinedBounds: BoundingBox = {
    x: Math.min(...allBounds.map((b) => b.x)),
    y: Math.min(...allBounds.map((b) => b.y)),
    width: 0,
    height: 0,
  };
  combinedBounds.width =
    Math.max(...allBounds.map((b) => b.x + b.width)) - combinedBounds.x;
  combinedBounds.height =
    Math.max(...allBounds.map((b) => b.y + b.height)) - combinedBounds.y;

  const aspectRatio = combinedBounds.width / Math.max(combinedBounds.height, 1);
  const relativeWidth = combinedBounds.width / canvasWidth;

  // Check for rectangular boxes (images, buttons, containers)
  const hasRectangle = strokes.some(isRectangular);
  const hasHorizontalLine = strokes.some(isHorizontalLine);
  const hasWavy = strokes.some(isWavyLine);
  const hasDots = strokes.some(isSmallCircleOrDot);

  // Classification logic
  if (hasHorizontalLine && strokes.length === 1 && !hasRectangle) {
    return {
      type: "divider",
      bounds: combinedBounds,
      confidence: 0.9,
    };
  }

  if (
    hasRectangle &&
    combinedBounds.height > 80 &&
    aspectRatio > 1.2 &&
    aspectRatio < 4
  ) {
    // Large rectangle likely an image placeholder
    if (hasDots || strokes.length > 2) {
      return {
        type: "image",
        bounds: combinedBounds,
        confidence: 0.75,
      };
    }
  }

  if (
    hasRectangle &&
    combinedBounds.height < 60 &&
    combinedBounds.height > 20 &&
    relativeWidth < 0.6
  ) {
    // Small rectangle = button
    return {
      type: "button",
      bounds: combinedBounds,
      confidence: 0.8,
      content: "Click Here",
    };
  }

  if (combinedBounds.height < 20 && relativeWidth > 0.3) {
    return {
      type: "spacer",
      bounds: combinedBounds,
      confidence: 0.6,
    };
  }

  if (
    hasWavy &&
    combinedBounds.y < 100 &&
    (strokes.length <= 3 || combinedBounds.height < 40)
  ) {
    return {
      type: "header",
      bounds: combinedBounds,
      confidence: 0.7,
      content: "Header Text",
    };
  }

  if (hasWavy || strokes.length >= 2) {
    // Multiple wavy strokes = paragraph text
    return {
      type: "text",
      bounds: combinedBounds,
      confidence: 0.7,
      content: "Your text content goes here. Edit this to add your message.",
    };
  }

  // Default to text
  return {
    type: "text",
    bounds: combinedBounds,
    confidence: 0.5,
    content: "Content block",
  };
}

export function analyzeSketch(
  strokes: Stroke[],
  canvasWidth: number,
  canvasHeight: number,
): DetectedRegion[] {
  if (strokes.length === 0) return [];

  // Filter out eraser strokes
  const drawStrokes = strokes.filter((s) => s.tool !== "eraser");

  // Group nearby strokes into logical regions
  const groups = groupNearbyStrokes(drawStrokes);

  // Classify each group
  const regions = groups.map((group) => classifyRegion(group, canvasWidth));

  // Sort top to bottom
  regions.sort((a, b) => a.bounds.y - b.bounds.y);

  return regions;
}

export function regionsToEmailElements(
  regions: DetectedRegion[],
): EmailElement[] {
  return regions.map((region) => {
    const base = { id: uuid(), styles: {} };

    switch (region.type) {
      case "header":
        return {
          ...base,
          type: "heading" as const,
          content: region.content || "Welcome",
          level: 1 as const,
          styles: {
            fontSize: "32px",
            color: "#111111",
            textAlign: "center" as const,
            padding: "20px 0",
          },
        };

      case "text":
        return {
          ...base,
          type: "text" as const,
          content:
            region.content ||
            "Your text content goes here. Edit this to add your message.",
          styles: {
            fontSize: "16px",
            color: "#333333",
            padding: "10px 0",
            lineHeight: "1.6",
          },
        };

      case "image":
        return {
          ...base,
          type: "image" as const,
          src: "https://placehold.co/600x300/e2e8f0/64748b?text=Your+Image",
          alt: "Image placeholder",
          styles: {
            width: "100%",
            borderRadius: "8px",
            padding: "10px 0",
          },
        };

      case "button":
        return {
          ...base,
          type: "button" as const,
          text: region.content || "Click Here",
          link: "https://example.com",
          buttonColor: "#4F46E5",
          textColor: "#ffffff",
          borderRadius: "6px",
          styles: {
            textAlign: "center" as const,
            padding: "10px 0",
          },
        };

      case "divider":
        return {
          ...base,
          type: "divider" as const,
          thickness: "1px",
          dividerColor: "#e5e7eb",
          dividerWidth: "100%",
          styles: { padding: "10px 0" },
        };

      case "spacer":
        return {
          ...base,
          type: "spacer" as const,
          height: `${Math.max(20, Math.round(region.bounds.height))}px`,
          styles: {},
        };

      case "columns":
        return {
          ...base,
          type: "columns" as const,
          columns: [
            { width: "50%", elements: [] },
            { width: "50%", elements: [] },
          ],
          styles: { padding: "10px 0" },
        };

      case "footer":
        return {
          ...base,
          type: "text" as const,
          content: "© 2026 Your Company. All rights reserved.",
          styles: {
            fontSize: "12px",
            color: "#999999",
            textAlign: "center" as const,
            padding: "20px 0",
          },
        };

      default:
        return {
          ...base,
          type: "text" as const,
          content: "Content block",
          styles: { padding: "10px 0" },
        };
    }
  });
}

export function sketchToTemplate(
  strokes: Stroke[],
  canvasWidth: number,
  canvasHeight: number,
): EmailTemplate {
  const regions = analyzeSketch(strokes, canvasWidth, canvasHeight);
  const elements = regionsToEmailElements(regions);

  return {
    id: uuid(),
    name: "Sketch Design",
    subject: "Your Email Subject",
    preheader: "Preview text for email clients",
    bodyBackground: "#f4f4f7",
    contentBackground: "#ffffff",
    contentWidth: "600px",
    fontFamily: "Arial, sans-serif",
    elements,
  };
}
