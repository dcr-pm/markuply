import { v4 as uuid } from "uuid";
import type { EmailElement } from "@/types/builder";

// ── Prompt-to-Elements Engine ──
// Converts natural language prompts into structured email elements.
// Uses smart pattern matching locally, with optional AI API enhancement.

interface PromptPattern {
  keywords: string[];
  generate: (prompt: string) => EmailElement[];
}

const PATTERNS: PromptPattern[] = [
  // ── Countdown / Timer ──
  {
    keywords: ["timer", "countdown", "clock", "expires", "ends in", "hurry", "limited time"],
    generate: (prompt) => {
      const hours = extractNumber(prompt, 48);
      const label = extractQuoted(prompt) || inferLabel(prompt, "Offer ends in");
      const color = extractColor(prompt) || "#dc2626";
      return [
        {
          id: uuid(),
          type: "timer",
          targetDate: new Date(Date.now() + hours * 60 * 60 * 1000).toISOString(),
          label,
          timerColor: color,
          labelColor: "#666666",
          styles: { padding: "16px 0", textAlign: "center" },
        },
      ];
    },
  },

  // ── Flash Sale ──
  {
    keywords: ["flash sale", "big sale", "mega sale", "clearance"],
    generate: (prompt) => {
      const discount = extractDiscount(prompt) || "50% OFF";
      const color = extractColor(prompt) || "#fbbf24";
      return [
        {
          id: uuid(),
          type: "heading",
          content: "FLASH SALE",
          level: 1 as const,
          styles: {
            fontSize: "36px",
            color,
            textAlign: "center",
            fontWeight: "bold",
            padding: "8px 0 0",
          },
        },
        {
          id: uuid(),
          type: "heading",
          content: discount,
          level: 2 as const,
          styles: {
            fontSize: "22px",
            color: "#ffffff",
            textAlign: "center",
            padding: "4px 0 8px",
          },
        },
        {
          id: uuid(),
          type: "timer",
          targetDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
          label: "Sale ends in",
          timerColor: "#dc2626",
          labelColor: "#999999",
          styles: { padding: "8px 0" },
        },
        {
          id: uuid(),
          type: "button",
          text: "Shop Now",
          link: "https://example.com/sale",
          buttonColor: color,
          textColor: "#111827",
          borderRadius: "999px",
          styles: { textAlign: "center", padding: "12px 0" },
        },
      ];
    },
  },

  // ── Free Shipping ──
  {
    keywords: ["free shipping", "free delivery", "shipping included", "no shipping"],
    generate: (prompt) => {
      const threshold = extractDollarAmount(prompt);
      const message = threshold
        ? `FREE SHIPPING on orders over $${threshold}`
        : "FREE SHIPPING on all orders";
      const bgColor = extractColor(prompt) || "#059669";
      return [
        {
          id: uuid(),
          type: "text",
          content: message,
          styles: {
            fontSize: "14px",
            fontWeight: "bold",
            color: "#ffffff",
            backgroundColor: bgColor,
            textAlign: "center",
            padding: "12px 20px",
            borderRadius: "8px",
          },
        },
      ];
    },
  },

  // ── Discount / Promo Code ──
  {
    keywords: ["discount", "promo code", "coupon", "code", "% off", "save"],
    generate: (prompt) => {
      const code = extractPromoCode(prompt) || "SAVE20";
      const discount = extractDiscount(prompt) || "20% OFF";
      return [
        {
          id: uuid(),
          type: "heading",
          content: discount,
          level: 1 as const,
          styles: {
            fontSize: "32px",
            color: "#7c3aed",
            textAlign: "center",
            fontWeight: "bold",
            padding: "8px 0 4px",
          },
        },
        {
          id: uuid(),
          type: "text",
          content: `Use code ${code} at checkout`,
          styles: {
            fontSize: "16px",
            color: "#4b5563",
            textAlign: "center",
            padding: "4px 0",
          },
        },
        {
          id: uuid(),
          type: "button",
          text: "Apply Code",
          link: "https://example.com",
          buttonColor: "#7c3aed",
          textColor: "#ffffff",
          borderRadius: "8px",
          styles: { textAlign: "center", padding: "12px 0" },
        },
      ];
    },
  },

  // ── Hero / Banner ──
  {
    keywords: ["hero", "banner", "hero image", "hero banner", "main image", "feature image"],
    generate: (prompt) => {
      const text = extractQuoted(prompt) || "Your Hero Banner";
      return [
        {
          id: uuid(),
          type: "image",
          src: "https://placehold.co/600x280/4F46E5/ffffff?text=" + encodeURIComponent(text),
          alt: text,
          styles: { width: "100%", borderRadius: "0", padding: "0" },
        },
      ];
    },
  },

  // ── Logo / Brand ──
  {
    keywords: ["logo", "brand", "company logo"],
    generate: () => [
      {
        id: uuid(),
        type: "image",
        src: "https://placehold.co/200x60/f8fafc/334155?text=YOUR+LOGO",
        alt: "Company Logo",
        styles: {
          width: "200px",
          padding: "16px 0",
          textAlign: "center",
        },
      },
    ],
  },

  // ── Navigation ──
  {
    keywords: ["navigation", "nav", "menu", "links", "nav bar", "navbar"],
    generate: () => [
      {
        id: uuid(),
        type: "text",
        content: "Home  |  Shop  |  Sale  |  About  |  Contact",
        styles: {
          fontSize: "13px",
          color: "#6b7280",
          textAlign: "center",
          padding: "12px 0",
          letterSpacing: "0.5px",
        },
      },
    ],
  },

  // ── CTA / Button ──
  {
    keywords: ["button", "cta", "call to action", "shop now", "learn more", "get started", "sign up", "subscribe"],
    generate: (prompt) => {
      const text = extractButtonText(prompt) || "Shop Now";
      const color = extractColor(prompt) || "#4F46E5";
      return [
        {
          id: uuid(),
          type: "button",
          text,
          link: "https://example.com",
          buttonColor: color,
          textColor: "#ffffff",
          borderRadius: "8px",
          styles: { textAlign: "center", padding: "12px 0", fontSize: "16px" },
        },
      ];
    },
  },

  // ── Social Links ──
  {
    keywords: ["social", "follow us", "social media", "twitter", "facebook", "instagram"],
    generate: () => [
      {
        id: uuid(),
        type: "social",
        links: [
          { platform: "Twitter", url: "https://twitter.com", icon: "https://placehold.co/32/1DA1F2/fff?text=X" },
          { platform: "Facebook", url: "https://facebook.com", icon: "https://placehold.co/32/1877F2/fff?text=f" },
          { platform: "Instagram", url: "https://instagram.com", icon: "https://placehold.co/32/E4405F/fff?text=IG" },
          { platform: "LinkedIn", url: "https://linkedin.com", icon: "https://placehold.co/32/0A66C2/fff?text=in" },
        ],
        iconSize: "32px",
        styles: { textAlign: "center", padding: "16px 0" },
      },
    ],
  },

  // ── Testimonial / Review ──
  {
    keywords: ["testimonial", "review", "quote", "customer says", "feedback"],
    generate: (prompt) => {
      const name = extractQuoted(prompt) || "Sarah M.";
      return [
        {
          id: uuid(),
          type: "text",
          content: `"This product completely changed how I work. I can't recommend it enough!"`,
          styles: {
            fontSize: "18px",
            fontStyle: "italic",
            color: "#374151",
            textAlign: "center",
            padding: "16px 24px 4px",
            lineHeight: "1.6",
          },
        },
        {
          id: uuid(),
          type: "text",
          content: `— ${name}, Verified Customer`,
          styles: {
            fontSize: "13px",
            color: "#9ca3af",
            textAlign: "center",
            padding: "4px 0 12px",
          },
        },
      ];
    },
  },

  // ── Product Card ──
  {
    keywords: ["product", "product card", "item", "feature product"],
    generate: (prompt) => {
      const name = extractQuoted(prompt) || "Premium Widget";
      const price = extractDollarAmount(prompt);
      return [
        {
          id: uuid(),
          type: "image",
          src: "https://placehold.co/400x300/f1f5f9/475569?text=" + encodeURIComponent(name),
          alt: name,
          styles: { width: "100%", borderRadius: "12px", padding: "8px 0" },
        },
        {
          id: uuid(),
          type: "heading",
          content: name,
          level: 3 as const,
          styles: { fontSize: "18px", color: "#111827", padding: "4px 0 2px" },
        },
        ...(price
          ? [
              {
                id: uuid(),
                type: "text" as const,
                content: `$${price}`,
                styles: {
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "#059669",
                  padding: "2px 0 8px",
                },
              },
            ]
          : []),
        {
          id: uuid(),
          type: "button",
          text: "Buy Now",
          link: "https://example.com",
          buttonColor: "#111827",
          textColor: "#ffffff",
          borderRadius: "8px",
          styles: { padding: "8px 0" },
        },
      ];
    },
  },

  // ── Footer ──
  {
    keywords: ["footer", "unsubscribe", "bottom", "legal", "copyright"],
    generate: () => [
      {
        id: uuid(),
        type: "divider",
        thickness: "1px",
        dividerColor: "#e5e7eb",
        dividerWidth: "100%",
        styles: { padding: "8px 0" },
      },
      {
        id: uuid(),
        type: "social",
        links: [
          { platform: "Twitter", url: "https://twitter.com", icon: "https://placehold.co/24/1DA1F2/fff?text=X" },
          { platform: "Facebook", url: "https://facebook.com", icon: "https://placehold.co/24/1877F2/fff?text=f" },
          { platform: "Instagram", url: "https://instagram.com", icon: "https://placehold.co/24/E4405F/fff?text=IG" },
        ],
        iconSize: "24px",
        styles: { textAlign: "center", padding: "12px 0 4px" },
      },
      {
        id: uuid(),
        type: "text",
        content: "© 2026 Your Company. All rights reserved.\nYou received this email because you signed up. Unsubscribe here.",
        styles: {
          fontSize: "11px",
          color: "#9ca3af",
          textAlign: "center",
          padding: "4px 20px 16px",
          lineHeight: "1.6",
        },
      },
    ],
  },

  // ── Heading (generic) ──
  {
    keywords: ["heading", "title", "headline"],
    generate: (prompt) => {
      const text = extractQuoted(prompt) || inferHeadingText(prompt);
      return [
        {
          id: uuid(),
          type: "heading",
          content: text,
          level: 1 as const,
          styles: {
            fontSize: "28px",
            color: "#111827",
            textAlign: "center",
            fontWeight: "bold",
            padding: "8px 0",
          },
        },
      ];
    },
  },

  // ── Paragraph / Text ──
  {
    keywords: ["text", "paragraph", "body", "copy", "description", "message"],
    generate: (prompt) => {
      const text =
        extractQuoted(prompt) ||
        "Your text content goes here. Click to edit and customize this block with your own message.";
      return [
        {
          id: uuid(),
          type: "text",
          content: text,
          styles: {
            fontSize: "16px",
            color: "#374151",
            padding: "8px 0",
            lineHeight: "1.6",
          },
        },
      ];
    },
  },

  // ── Image ──
  {
    keywords: ["image", "photo", "picture", "graphic", "illustration"],
    generate: (prompt) => {
      const alt = extractQuoted(prompt) || "Image";
      return [
        {
          id: uuid(),
          type: "image",
          src: "https://placehold.co/600x300/e2e8f0/64748b?text=" + encodeURIComponent(alt),
          alt,
          styles: { width: "100%", borderRadius: "8px", padding: "8px 0" },
        },
      ];
    },
  },

  // ── Divider ──
  {
    keywords: ["divider", "separator", "line", "hr"],
    generate: () => [
      {
        id: uuid(),
        type: "divider",
        thickness: "1px",
        dividerColor: "#e5e7eb",
        dividerWidth: "100%",
        styles: { padding: "8px 0" },
      },
    ],
  },

  // ── Spacer ──
  {
    keywords: ["spacer", "space", "gap", "padding"],
    generate: (prompt) => {
      const height = extractNumber(prompt, 30);
      return [
        {
          id: uuid(),
          type: "spacer",
          height: `${height}px`,
          styles: {},
        },
      ];
    },
  },

  // ── Video ──
  {
    keywords: ["video", "youtube", "vimeo", "play"],
    generate: (prompt) => {
      const alt = extractQuoted(prompt) || "Watch Video";
      return [
        {
          id: uuid(),
          type: "video",
          thumbnailSrc: "https://placehold.co/600x340/1e293b/f8fafc?text=" + encodeURIComponent(alt),
          videoUrl: "https://example.com/video",
          alt,
          styles: { width: "100%", borderRadius: "8px", padding: "8px 0" },
        },
      ];
    },
  },

  // ── GIF ──
  {
    keywords: ["gif", "animated", "animation"],
    generate: (prompt) => {
      const alt = extractQuoted(prompt) || "Animated GIF";
      return [
        {
          id: uuid(),
          type: "gif",
          src: "https://placehold.co/400x300/fef3c7/d97706?text=" + encodeURIComponent(alt),
          alt,
          styles: { width: "100%", borderRadius: "8px", padding: "8px 0" },
        },
      ];
    },
  },
];

// ── Helper extractors ──

function extractNumber(prompt: string, fallback: number): number {
  const match = prompt.match(/\b(\d+)\b/);
  return match ? parseInt(match[1]) : fallback;
}

function extractQuoted(prompt: string): string | null {
  const match = prompt.match(/["']([^"']+)["']/);
  return match ? match[1] : null;
}

function extractColor(prompt: string): string | null {
  const hexMatch = prompt.match(/#[0-9a-fA-F]{3,8}/);
  if (hexMatch) return hexMatch[0];

  const colorMap: Record<string, string> = {
    red: "#dc2626",
    blue: "#2563eb",
    green: "#059669",
    purple: "#7c3aed",
    orange: "#ea580c",
    pink: "#ec4899",
    yellow: "#eab308",
    gold: "#fbbf24",
    black: "#111827",
    white: "#ffffff",
    indigo: "#4F46E5",
  };

  for (const [name, hex] of Object.entries(colorMap)) {
    if (prompt.toLowerCase().includes(name)) return hex;
  }
  return null;
}

function extractDiscount(prompt: string): string | null {
  const match = prompt.match(/(\d+)%\s*(off)?/i);
  if (match) return `${match[1]}% OFF`;
  const dollarMatch = prompt.match(/\$(\d+)\s*(off)?/i);
  if (dollarMatch) return `$${dollarMatch[1]} OFF`;
  return null;
}

function extractDollarAmount(prompt: string): number | null {
  const match = prompt.match(/\$(\d+(?:\.\d{2})?)/);
  return match ? parseFloat(match[1]) : null;
}

function extractPromoCode(prompt: string): string | null {
  const match = prompt.match(/\b(code|promo|coupon)\s+(\w+)/i);
  return match ? match[2].toUpperCase() : null;
}

function extractButtonText(prompt: string): string | null {
  const quoted = extractQuoted(prompt);
  if (quoted) return quoted;

  const buttonTexts = [
    "shop now",
    "buy now",
    "learn more",
    "get started",
    "sign up",
    "subscribe",
    "explore",
    "view collection",
    "see details",
    "order now",
    "claim offer",
    "start free trial",
  ];
  const lower = prompt.toLowerCase();
  for (const text of buttonTexts) {
    if (lower.includes(text)) return text.replace(/\b\w/g, (c) => c.toUpperCase());
  }
  return null;
}

function inferLabel(prompt: string, fallback: string): string {
  if (prompt.toLowerCase().includes("sale")) return "Sale ends in";
  if (prompt.toLowerCase().includes("offer")) return "Offer expires in";
  if (prompt.toLowerCase().includes("launch")) return "Launching in";
  if (prompt.toLowerCase().includes("event")) return "Event starts in";
  return fallback;
}

function inferHeadingText(prompt: string): string {
  // Try to pull meaningful text from the prompt itself
  const cleaned = prompt
    .replace(/\b(add|create|make|put|insert|a|an|the|heading|title)\b/gi, "")
    .trim();
  if (cleaned.length > 3) {
    return cleaned.replace(/\b\w/g, (c) => c.toUpperCase());
  }
  return "Your Heading Here";
}

// ── Main entry point ──

export function promptToElements(prompt: string): EmailElement[] {
  const lower = prompt.toLowerCase().trim();

  if (!lower) return [];

  // Try each pattern, score by number of keyword matches
  let bestMatch: PromptPattern | null = null;
  let bestScore = 0;

  for (const pattern of PATTERNS) {
    let score = 0;
    for (const keyword of pattern.keywords) {
      if (lower.includes(keyword)) {
        score += keyword.length; // Longer keyword matches score higher
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = pattern;
    }
  }

  if (bestMatch && bestScore > 0) {
    return bestMatch.generate(prompt);
  }

  // Fallback: generate a text block with the prompt content
  return [
    {
      id: uuid(),
      type: "text",
      content: prompt,
      styles: {
        fontSize: "16px",
        color: "#374151",
        padding: "8px 0",
        lineHeight: "1.6",
      },
    },
  ];
}

// ── Quick suggestion chips ──

export interface PromptSuggestion {
  label: string;
  prompt: string;
  icon: string;
}

export const PROMPT_SUGGESTIONS: PromptSuggestion[] = [
  { label: "Timer", prompt: "countdown timer 48 hours", icon: "⏱" },
  { label: "Flash Sale", prompt: "flash sale 50% off", icon: "⚡" },
  { label: "Free Shipping", prompt: "free shipping on orders over $50", icon: "📦" },
  { label: "CTA Button", prompt: 'button "Shop Now"', icon: "▶" },
  { label: "Hero Banner", prompt: 'hero banner "Welcome to Our Store"', icon: "🖼" },
  { label: "Logo", prompt: "company logo", icon: "◈" },
  { label: "Navigation", prompt: "navigation menu", icon: "☰" },
  { label: "Promo Code", prompt: "discount code SAVE20 for 20% off", icon: "🏷" },
  { label: "Product", prompt: 'product card "Premium Widget" $49.99', icon: "📱" },
  { label: "Testimonial", prompt: 'testimonial from "Sarah M."', icon: "💬" },
  { label: "Social Links", prompt: "social media links", icon: "@" },
  { label: "Footer", prompt: "email footer with unsubscribe", icon: "⊥" },
  { label: "Divider", prompt: "divider line", icon: "—" },
  { label: "Spacer", prompt: "spacer 30px", icon: "↕" },
  { label: "Image", prompt: "placeholder image", icon: "▣" },
  { label: "Video", prompt: "video placeholder", icon: "▷" },
];
