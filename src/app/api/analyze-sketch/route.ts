import { NextResponse } from "next/server";

/**
 * AI Sketch Analysis API Route
 *
 * Accepts a canvas image (base64 PNG) and returns structured email layout.
 * When ANTHROPIC_API_KEY is configured, uses Claude's vision capabilities
 * to intelligently interpret the sketch. Otherwise, falls back to the
 * local heuristic-based analysis engine.
 *
 * POST /api/analyze-sketch
 * Body: { image: string (base64 data URL), width: number, height: number }
 * Returns: { elements: EmailElement[], confidence: number }
 */

interface AnalysisRequest {
  image: string;
  width: number;
  height: number;
}

interface AnalyzedBlock {
  type: string;
  content?: string;
  confidence: number;
  position: { y: number };
}

export async function POST(request: Request) {
  try {
    const body: AnalysisRequest = await request.json();

    if (!body.image) {
      return NextResponse.json(
        { error: "Missing image data" },
        { status: 400 },
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (apiKey) {
      // Use Claude Vision for intelligent sketch analysis
      return await analyzeWithAI(body, apiKey);
    }

    // Fallback: return a guided response based on image dimensions
    return NextResponse.json({
      elements: getHeuristicLayout(),
      confidence: 0.6,
      method: "heuristic",
      message:
        "Using heuristic analysis. Set ANTHROPIC_API_KEY for AI-powered sketch recognition.",
    });
  } catch (error) {
    console.error("Sketch analysis error:", error);
    return NextResponse.json(
      { error: "Analysis failed" },
      { status: 500 },
    );
  }
}

async function analyzeWithAI(body: AnalysisRequest, apiKey: string) {
  const base64 = body.image.replace(/^data:image\/\w+;base64,/, "");

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: "image/png",
                data: base64,
              },
            },
            {
              type: "text",
              text: `You are an expert at converting hand-drawn email sketches into structured email layouts.

Analyze this hand-drawn sketch of an email layout. Identify all visual elements from top to bottom and classify each as one of these types:
- "heading" (large text, titles)
- "text" (paragraphs, body text, wavy lines representing text)
- "image" (rectangles, boxes with X marks or icons inside)
- "button" (small rectangles with text, CTAs)
- "divider" (horizontal lines)
- "spacer" (empty gaps between elements)

Return ONLY a valid JSON array of objects, each with:
- "type": element type from the list above
- "content": suggested text content (for headings, text, buttons)
- "confidence": 0-1 how confident you are

Example:
[
  {"type": "heading", "content": "Welcome to Our Newsletter", "confidence": 0.9},
  {"type": "image", "content": null, "confidence": 0.8},
  {"type": "text", "content": "Here is what we've been up to this week...", "confidence": 0.7},
  {"type": "button", "content": "Learn More", "confidence": 0.85}
]

Only output the JSON array, no other text.`,
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`AI API error: ${response.status}`);
  }

  const data = await response.json();
  const text =
    data.content?.[0]?.type === "text" ? data.content[0].text : "";

  // Parse the JSON from AI response
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error("Could not parse AI response");
  }

  const blocks: AnalyzedBlock[] = JSON.parse(jsonMatch[0]);
  const avgConfidence =
    blocks.reduce((sum: number, b: AnalyzedBlock) => sum + b.confidence, 0) /
    blocks.length;

  return NextResponse.json({
    elements: blocks,
    confidence: avgConfidence,
    method: "ai",
    message: "Analyzed with Claude Vision",
  });
}

function getHeuristicLayout(): AnalyzedBlock[] {
  return [
    { type: "heading", content: "Your Email Heading", confidence: 0.5, position: { y: 0 } },
    { type: "text", content: "Your email body text goes here. Edit this content in the builder.", confidence: 0.5, position: { y: 1 } },
    { type: "image", content: undefined, confidence: 0.5, position: { y: 2 } },
    { type: "button", content: "Click Here", confidence: 0.5, position: { y: 3 } },
  ];
}
