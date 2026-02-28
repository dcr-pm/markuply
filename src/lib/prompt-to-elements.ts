import { v4 as uuid } from "uuid";
import type { EmailElement, ElementStyles } from "@/types/builder";

// ── Prompt-to-Elements Engine ──
// Converts natural language prompts into structured email elements.
// Supports rich styling directives, column-aware layouts, and creative compositions.

interface PromptPattern {
  keywords: string[];
  generate: (prompt: string) => EmailElement[];
}

// ── Smart Prompt Result ──
// Extended result type that includes region/block styling and column-aware layouts

export interface RegionStyleOverrides {
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  textAlign?: "left" | "center" | "right";
  padding?: string;
}

export interface ColumnPromptResult {
  columnIndex: number;
  label: string;
  elements: EmailElement[];
}

export interface SmartPromptResult {
  elements: EmailElement[];
  regionStyle?: RegionStyleOverrides;
  columns?: ColumnPromptResult[];
  isColumnLayout: boolean;
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

  // ── Marketing Footer (full) ──
  {
    keywords: ["marketing footer", "email footer", "full footer", "standard footer"],
    generate: () => [
      {
        id: uuid(),
        type: "footer",
        variant: "marketing" as const,
        companyName: "Your Company",
        companyAddress: "123 Main St, Suite 100, San Francisco, CA 94105",
        unsubscribeUrl: "https://example.com/unsubscribe",
        preferencesUrl: "https://example.com/preferences",
        privacyUrl: "https://example.com/privacy",
        termsUrl: "https://example.com/terms",
        links: [
          { label: "Website", url: "https://example.com" },
          { label: "Help Center", url: "https://example.com/help" },
          { label: "Contact Us", url: "https://example.com/contact" },
        ],
        socialLinks: [
          { platform: "Twitter", url: "https://twitter.com", icon: "https://placehold.co/24/1DA1F2/fff?text=X" },
          { platform: "Facebook", url: "https://facebook.com", icon: "https://placehold.co/24/1877F2/fff?text=f" },
          { platform: "Instagram", url: "https://instagram.com", icon: "https://placehold.co/24/E4405F/fff?text=IG" },
          { platform: "LinkedIn", url: "https://linkedin.com", icon: "https://placehold.co/24/0A66C2/fff?text=in" },
        ],
        showSocial: true,
        showAddress: true,
        textColor: "#9ca3af",
        dividerColor: "#e5e7eb",
        styles: { padding: "0", backgroundColor: "#f9fafb" },
      },
    ],
  },

  // ── Transactional Footer ──
  {
    keywords: ["transactional footer", "account footer", "receipt footer", "order footer"],
    generate: () => [
      {
        id: uuid(),
        type: "footer",
        variant: "transactional" as const,
        companyName: "Your Company",
        companyAddress: "123 Main St, Suite 100, San Francisco, CA 94105",
        unsubscribeUrl: "https://example.com/unsubscribe",
        preferencesUrl: "https://example.com/preferences",
        privacyUrl: "https://example.com/privacy",
        termsUrl: "https://example.com/terms",
        links: [
          { label: "Help Center", url: "https://example.com/help" },
          { label: "Contact Support", url: "https://example.com/support" },
        ],
        socialLinks: [],
        showSocial: false,
        showAddress: true,
        textColor: "#9ca3af",
        dividerColor: "#e5e7eb",
        styles: { padding: "0", backgroundColor: "#f9fafb" },
      },
    ],
  },

  // ── Generic Footer (catches "footer", "unsubscribe", etc.) ──
  {
    keywords: ["footer", "unsubscribe", "bottom", "legal", "copyright", "privacy"],
    generate: (prompt) => {
      const lower = prompt.toLowerCase();
      const isTransactional = lower.includes("transactional") || lower.includes("receipt") || lower.includes("order");
      return [
        {
          id: uuid(),
          type: "footer",
          variant: isTransactional ? "transactional" as const : "marketing" as const,
          companyName: "Your Company",
          companyAddress: "123 Main St, Suite 100, San Francisco, CA 94105",
          unsubscribeUrl: "https://example.com/unsubscribe",
          preferencesUrl: "https://example.com/preferences",
          privacyUrl: "https://example.com/privacy",
          termsUrl: "https://example.com/terms",
          links: [
            { label: "Website", url: "https://example.com" },
            { label: "Help Center", url: "https://example.com/help" },
            { label: "Contact Us", url: "https://example.com/contact" },
          ],
          socialLinks: [
            { platform: "Twitter", url: "https://twitter.com", icon: "https://placehold.co/24/1DA1F2/fff?text=X" },
            { platform: "Facebook", url: "https://facebook.com", icon: "https://placehold.co/24/1877F2/fff?text=f" },
            { platform: "Instagram", url: "https://instagram.com", icon: "https://placehold.co/24/E4405F/fff?text=IG" },
          ],
          showSocial: !isTransactional,
          showAddress: true,
          textColor: "#9ca3af",
          dividerColor: "#e5e7eb",
          styles: { padding: "0", backgroundColor: "#f9fafb" },
        },
      ];
    },
  },

  // ── Email Header (rich prompt parsing) ──
  {
    keywords: ["email header", "header section", "header block", "logo header", "nav header", "header with", "top bar", "announcement bar", "header cta", "navigation header"],
    generate: (prompt) => {
      const lower = prompt.toLowerCase();

      // ── Variant detection ──
      const variant = lower.includes("ecommerce") || lower.includes("e-commerce") ? "ecommerce" as const
        : lower.includes("bold") ? "bold" as const
        : lower.includes("minimal") ? "minimal" as const
        : lower.includes("centered") || lower.includes("centre") ? "centered" as const
        : lower.includes("logo only") || lower.includes("logo-only") ? "logo-only" as const
        : lower.includes("full") ? "full" as const
        : "logo-nav" as const;

      // ── Logo position ──
      const logoPosition: "left" | "center" | "right" =
        lower.includes("logo center") || lower.includes("centered logo") || lower.includes("logo in the center") || lower.includes("logo middle") ? "center"
        : lower.includes("logo right") || lower.includes("logo on the right") || lower.includes("right logo") ? "right"
        : variant === "centered" ? "center"
        : "left";

      // ── Logo width ──
      const logoWidthMatch = lower.match(/logo\s+(?:width\s+)?(\d+)\s*(?:px)?/);
      const logoSmall = lower.includes("small logo") || lower.includes("logo small");
      const logoLarge = lower.includes("large logo") || lower.includes("logo large") || lower.includes("big logo");
      const logoWidth = logoWidthMatch ? `${logoWidthMatch[1]}px`
        : logoSmall ? "120px"
        : logoLarge ? "240px"
        : "180px";

      // ── Background & text color ──
      const bgColor = extractHeaderColor(lower, ["background", "bg"]) || (
        lower.includes("dark header") || lower.includes("dark background") ? "#1f2937"
        : lower.includes("black header") ? "#111827"
        : "#ffffff"
      );
      const isDarkBg = ["#1f2937", "#111827", "#000000", "#1e3a5f"].includes(bgColor) ||
        lower.includes("dark") || lower.includes("black");
      const textColor = extractHeaderColor(lower, ["text color", "text"]) || (isDarkBg ? "#ffffff" : "#374151");

      // ── Nav position ──
      const navPosition: "left" | "center" | "right" | "below" =
        lower.includes("nav below") || lower.includes("navigation below") || lower.includes("links below") || lower.includes("nav under") ? "below"
        : lower.includes("nav left") || lower.includes("navigation left") || lower.includes("links left") ? "left"
        : lower.includes("nav center") || lower.includes("navigation center") || lower.includes("links center") ? "center"
        : variant === "centered" ? "below"
        : "right";

      // ── Nav style ──
      const navStyle: "text" | "pills" | "underline" | "bold" =
        lower.includes("pill") || lower.includes("rounded nav") || lower.includes("tag nav") ? "pills"
        : lower.includes("underline") ? "underline"
        : lower.includes("bold nav") || lower.includes("bold link") ? "bold"
        : "text";

      // ── Nav color ──
      const navColor = extractHeaderColor(lower, ["nav color", "link color", "nav"]) || "";

      // ── Nav font size ──
      const navFsMatch = lower.match(/nav\s+(?:font\s+)?(?:size\s+)?(\d+)\s*(?:px)?/);
      const navFontSize = navFsMatch ? `${navFsMatch[1]}px` : "13px";

      // ── Parse custom nav link names from prompt ──
      const navLinks = parseNavLinksFromPrompt(lower);

      // ── Tagline ──
      const taglineMatch = prompt.match(/(?:tagline|subtitle|slogan)\s+["']([^"']+)["']/i) ||
        prompt.match(/["']([^"']+)["']\s+(?:tagline|subtitle|slogan)/i);
      const tagline = taglineMatch ? taglineMatch[1] : "";
      const taglineColor = extractHeaderColor(lower, ["tagline color"]) || (isDarkBg ? "#9ca3af" : "#6b7280");

      // ── CTA button ──
      const ctaTextMatch = prompt.match(/(?:cta|button)\s+["']([^"']+)["']/i) ||
        prompt.match(/["']([^"']+)["']\s+(?:cta|button)/i);
      const hasCta = lower.includes("cta") || lower.includes("button") || lower.includes("shop now") || lower.includes("get started") || lower.includes("sign up");
      const ctaText = ctaTextMatch ? ctaTextMatch[1]
        : lower.includes("shop now") ? "Shop Now"
        : lower.includes("get started") ? "Get Started"
        : lower.includes("sign up") ? "Sign Up"
        : lower.includes("subscribe") ? "Subscribe"
        : lower.includes("learn more") ? "Learn More"
        : lower.includes("buy now") ? "Buy Now"
        : "Shop Now";
      const ctaColor = extractHeaderColor(lower, ["cta color", "button color"]) || "#4F46E5";
      const ctaTextColor = extractHeaderColor(lower, ["cta text"]) || "#ffffff";
      const ctaRound = lower.includes("rounded cta") || lower.includes("pill cta") || lower.includes("round button");
      const ctaBorderRadius = ctaRound ? "999px" : "6px";

      // ── Announcement bar ──
      const announcementMatch = prompt.match(/(?:announcement|top bar|banner)\s+["']([^"']+)["']/i) ||
        prompt.match(/["']([^"']+)["']\s+(?:announcement|top bar|banner)/i);
      const hasAnnouncement = lower.includes("announcement") || lower.includes("top bar") || lower.includes("banner bar") || lower.includes("promo bar");
      const announcementText = announcementMatch ? announcementMatch[1]
        : hasAnnouncement ? "Free shipping on orders over $50!"
        : "";
      const announcementBg = extractHeaderColor(lower, ["announcement bg", "announcement background", "bar bg", "bar background"]) || (isDarkBg ? "#4F46E5" : "#4F46E5");
      const announcementTextColor = extractHeaderColor(lower, ["announcement text", "bar text"]) || "#ffffff";

      // ── Preheader ──
      const preheaderMatch = prompt.match(/preheader\s+["']([^"']+)["']/i);
      const preheaderText = preheaderMatch ? preheaderMatch[1] : "";

      // ── Border ──
      const hasBorder = lower.includes("border") || lower.includes("divider") || lower.includes("separator") || lower.includes("line below");
      const borderColor = extractHeaderColor(lower, ["border color"]) || "#e5e7eb";
      const borderBottom = hasBorder ? `1px solid ${borderColor}` : "";

      // ── Padding ──
      const paddingMatch = lower.match(/padding\s+(\d+)\s*(?:px)?/);
      const padding = paddingMatch ? `${paddingMatch[1]}px`
        : lower.includes("compact") || lower.includes("tight") ? "8px 0"
        : lower.includes("spacious") || lower.includes("roomy") ? "24px 0"
        : "16px 0";

      return [
        {
          id: uuid(),
          type: "header",
          variant,
          logoSrc: "https://placehold.co/" + parseInt(logoWidth) + "x50/" +
            (isDarkBg ? "ffffff/1f2937" : "f8fafc/334155") + "?text=YOUR+LOGO",
          logoAlt: "Company Logo",
          logoWidth,
          logoPosition,
          tagline,
          taglineColor,
          taglineFontSize: "12px",
          navLinks,
          navPosition,
          navStyle,
          navFontSize,
          navColor,
          ctaText,
          ctaUrl: "https://example.com",
          ctaColor,
          ctaTextColor,
          ctaBorderRadius,
          showCta: hasCta,
          announcementText,
          announcementBg,
          announcementTextColor,
          showAnnouncement: hasAnnouncement,
          preheaderText,
          backgroundColor: bgColor,
          textColor,
          borderBottom,
          styles: { padding },
        },
      ];
    },
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

// ── Header-specific helpers ──

function extractHeaderColor(lower: string, prefixes: string[]): string | null {
  for (const prefix of prefixes) {
    // Match patterns like "background red", "bg #333", "background color navy"
    const regex = new RegExp(`${prefix}\\s+(?:color\\s+)?(?:is\\s+)?(?:should\\s+be\\s+)?(#[0-9a-fA-F]{3,8}|\\w+)`, "i");
    const match = lower.match(regex);
    if (match) {
      const c = resolveColor(match[1]);
      if (c) return c;
    }
  }
  return null;
}

function parseNavLinksFromPrompt(lower: string): { label: string; url: string }[] {
  // Try to find explicit link names: "links: Home, Shop, Blog, Contact"
  const explicitMatch = lower.match(
    /(?:links?|nav|navigation|menu)\s*(?::\s*|are\s+|with\s+|including\s+)([\w\s,&]+)/i,
  );
  if (explicitMatch) {
    const names = explicitMatch[1]
      .split(/[,&]/)
      .map((s) => s.trim())
      .filter((s) => s && s.length < 20 && !/\b(and|the|with|on|in|is)\b/i.test(s));
    if (names.length >= 2) {
      return names.map((name) => ({
        label: name.replace(/\b\w/g, (c) => c.toUpperCase()),
        url: `https://example.com/${name.toLowerCase().replace(/\s+/g, "-")}`,
      }));
    }
  }

  // Detect specific common pages mentioned
  const pages: { label: string; url: string }[] = [];
  const pageKeywords: [string, string][] = [
    ["home", "https://example.com"],
    ["shop", "https://example.com/shop"],
    ["store", "https://example.com/store"],
    ["sale", "https://example.com/sale"],
    ["about", "https://example.com/about"],
    ["contact", "https://example.com/contact"],
    ["blog", "https://example.com/blog"],
    ["faq", "https://example.com/faq"],
    ["pricing", "https://example.com/pricing"],
    ["features", "https://example.com/features"],
    ["products", "https://example.com/products"],
    ["support", "https://example.com/support"],
    ["portfolio", "https://example.com/portfolio"],
    ["services", "https://example.com/services"],
    ["careers", "https://example.com/careers"],
    ["login", "https://example.com/login"],
    ["sign in", "https://example.com/login"],
    ["help", "https://example.com/help"],
  ];
  for (const [keyword, url] of pageKeywords) {
    if (lower.includes(keyword)) {
      pages.push({ label: keyword.replace(/\b\w/g, (c) => c.toUpperCase()), url });
    }
  }
  if (pages.length >= 2) return pages;

  // Default nav links
  return [
    { label: "Home", url: "https://example.com" },
    { label: "Shop", url: "https://example.com/shop" },
    { label: "Sale", url: "https://example.com/sale" },
    { label: "About", url: "https://example.com/about" },
  ];
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

// ── Style Parser ──
// Extracts styling directives from natural language prompts

const COLOR_MAP: Record<string, string> = {
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
  gray: "#6b7280",
  grey: "#6b7280",
  teal: "#0d9488",
  navy: "#1e3a5f",
  dark: "#1f2937",
  light: "#f9fafb",
  slate: "#475569",
  emerald: "#059669",
  rose: "#f43f5e",
  amber: "#f59e0b",
  cyan: "#06b6d4",
  lime: "#84cc16",
  violet: "#8b5cf6",
  fuchsia: "#d946ef",
  sky: "#0ea5e9",
};

function resolveColor(name: string): string | null {
  const lower = name.toLowerCase().trim();
  if (lower.startsWith("#")) return lower;
  return COLOR_MAP[lower] || null;
}

export function parseRegionStyle(prompt: string): RegionStyleOverrides {
  const lower = prompt.toLowerCase();
  const style: RegionStyleOverrides = {};

  // Background color: "blue background", "dark bg", "bg #333", "on black", "background color red"
  const bgPatterns = [
    /(?:background|bg)\s+(?:color\s+)?(?:is\s+)?(?:should\s+be\s+)?(#[0-9a-fA-F]{3,8}|\w+)/i,
    /(\w+)\s+(?:background|bg)/i,
    /(?:on|with)\s+(?:a\s+)?(\w+)\s+(?:background|bg|backdrop)/i,
    /make\s+(?:it|this|the\s+(?:block|section|region))\s+(\w+)/i,
  ];
  for (const pat of bgPatterns) {
    const match = prompt.match(pat);
    if (match) {
      const c = resolveColor(match[1]);
      if (c) { style.backgroundColor = c; break; }
    }
  }

  // Text color: "white text", "text color blue", "text in red"
  const textColorPatterns = [
    /(?:text|font)\s+(?:color\s+)?(?:is\s+)?(?:should\s+be\s+)?(?:in\s+)?(#[0-9a-fA-F]{3,8}|\w+)/i,
    /(\w+)\s+(?:text|font|lettering|copy)/i,
  ];
  for (const pat of textColorPatterns) {
    const match = prompt.match(pat);
    if (match) {
      const c = resolveColor(match[1]);
      if (c) { style.textColor = c; break; }
    }
  }

  // If dark background is detected but no text color, auto-set white text
  if (style.backgroundColor && !style.textColor) {
    const darkColors = ["#111827", "#1f2937", "#1e3a5f", "#000000"];
    const bgLower = style.backgroundColor.toLowerCase();
    if (darkColors.includes(bgLower) || lower.includes("dark")) {
      style.textColor = "#ffffff";
    }
  }

  // Text alignment: "centered", "left aligned", "align right"
  if (/\b(center|centered|centre)\b/i.test(lower)) {
    style.textAlign = "center";
  } else if (/\b(right\s*align|align\s*right|right\s*justified)\b/i.test(lower)) {
    style.textAlign = "right";
  } else if (/\b(left\s*align|align\s*left)\b/i.test(lower)) {
    style.textAlign = "left";
  }

  // Padding: "lots of padding", "tight padding", "padding 20px"
  const paddingMatch = lower.match(/padding\s+(\d+)(?:px)?/);
  if (paddingMatch) {
    style.padding = `${paddingMatch[1]}px`;
  } else if (/\b(lots?\s+of\s+padding|spacious|roomy)\b/i.test(lower)) {
    style.padding = "32px";
  } else if (/\b(tight|compact|minimal\s+padding|no\s+padding)\b/i.test(lower)) {
    style.padding = "4px";
  }

  return style;
}

// ── Column Layout Parser ──
// Detects column-specific instructions: "left column X, right column Y"

const COLUMN_IDENTIFIERS: Record<string, number> = {
  "left": 0, "first": 0, "col 1": 0, "column 1": 0, "1st": 0,
  "right": 1, "second": 1, "col 2": 1, "column 2": 1, "2nd": 1, "middle": 1,
  "third": 2, "col 3": 2, "column 3": 2, "3rd": 2,
  "fourth": 3, "col 4": 3, "column 4": 3, "4th": 3,
};

function parseColumnPrompt(prompt: string): ColumnPromptResult[] | null {
  const lower = prompt.toLowerCase();

  // Check for column-aware patterns
  const hasColumnRef = /\b(left|right|first|second|third|fourth|col\s*\d|column\s*\d|1st|2nd|3rd|4th)\b/i.test(lower);
  const hasColumnSeparator = /[,;]|\band\b|\bthen\b|[\-–—]/.test(lower);

  if (!hasColumnRef || !hasColumnSeparator) return null;

  const results: ColumnPromptResult[] = [];

  // Strategy 1: Split by explicit column references
  // e.g., "left column is image, right column is headline and CTA"
  const segments = splitByColumnRefs(prompt);

  if (segments.length >= 2) {
    for (const seg of segments) {
      const colIdx = seg.columnIndex;
      const elements = promptToElements(seg.text);
      if (elements.length > 0) {
        results.push({
          columnIndex: colIdx,
          label: `Column ${colIdx + 1}`,
          elements,
        });
      }
    }
  }

  return results.length >= 2 ? results : null;
}

interface ColumnSegment {
  columnIndex: number;
  text: string;
}

function splitByColumnRefs(prompt: string): ColumnSegment[] {
  const segments: ColumnSegment[] = [];
  const lower = prompt.toLowerCase();

  // Find all column references with their positions
  const refs: { index: number; colIdx: number; len: number }[] = [];

  for (const [key, colIdx] of Object.entries(COLUMN_IDENTIFIERS)) {
    const regex = new RegExp(`\\b${key.replace(/\s+/g, "\\s+")}\\b`, "gi");
    let match;
    while ((match = regex.exec(lower)) !== null) {
      refs.push({ index: match.index, colIdx, len: match[0].length });
    }
  }

  // Sort by position
  refs.sort((a, b) => a.index - b.index);

  // Deduplicate (keep first ref for each column index)
  const seen = new Set<number>();
  const uniqueRefs = refs.filter((r) => {
    if (seen.has(r.colIdx)) return false;
    seen.add(r.colIdx);
    return true;
  });

  if (uniqueRefs.length < 2) return [];

  // Extract text between column refs
  for (let i = 0; i < uniqueRefs.length; i++) {
    const start = uniqueRefs[i].index + uniqueRefs[i].len;
    const end = i + 1 < uniqueRefs.length ? uniqueRefs[i + 1].index : prompt.length;
    let text = prompt.slice(start, end).trim();

    // Clean leading separators and filler words
    text = text.replace(/^[\s,;:\-–—]+/, "").replace(/^\s*(is|should\s+be|has|have|contains?|includes?|with)\s+/i, "").trim();
    // Clean trailing separators
    text = text.replace(/[\s,;:\-–—]+$/, "").trim();

    if (text) {
      segments.push({ columnIndex: uniqueRefs[i].colIdx, text });
    }
  }

  return segments;
}

// ── Smart Composition Parser ──
// Handles complex multi-element block descriptions from a single creative prompt.
// e.g., "heading 'Sale' in red, body text explaining 20% off, green CTA button"

function parseComposition(prompt: string): EmailElement[] | null {
  const lower = prompt.toLowerCase();

  // Check for composition indicators: commas separating different element types
  const elementKeywords = [
    "heading", "title", "headline",
    "text", "copy", "paragraph", "body", "description",
    "image", "photo", "picture",
    "button", "cta",
    "timer", "countdown",
    "divider", "separator", "line",
    "spacer", "space", "gap",
  ];

  // Count distinct element types mentioned
  const mentioned = new Set<string>();
  for (const kw of elementKeywords) {
    if (lower.includes(kw)) mentioned.add(kw);
  }

  // Only parse as composition if 2+ different element types AND there's explicit separation
  if (mentioned.size < 2) return null;

  // Split by commas, "and", "then", "with a", "followed by"
  const parts = prompt.split(/,\s*|\s+and\s+|\s+then\s+|\s+with\s+(?:a\s+)?|\s+followed\s+by\s+/i).filter((p) => p.trim());

  if (parts.length < 2) return null;

  const elements: EmailElement[] = [];
  const regionStyle = parseRegionStyle(prompt);

  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    // Apply region-level style overrides to each generated element
    const generated = promptToElements(trimmed);
    for (const el of generated) {
      if (regionStyle.textColor && "content" in el) {
        el.styles.color = el.styles.color || regionStyle.textColor;
      }
      if (regionStyle.textAlign) {
        el.styles.textAlign = el.styles.textAlign || regionStyle.textAlign;
      }
      elements.push(el);
    }
  }

  return elements.length > 1 ? elements : null;
}

// ── Smart Prompt Entry Point ──
// The main "smart" function that handles creative prompts with styling, columns, and composition.

export function smartPromptToElements(prompt: string): SmartPromptResult {
  const lower = prompt.toLowerCase().trim();
  if (!lower) return { elements: [], isColumnLayout: false };

  // 1. Extract region-level styling from the prompt
  const regionStyle = parseRegionStyle(prompt);

  // 2. Check for column-aware layout instructions
  const columnResults = parseColumnPrompt(prompt);
  if (columnResults && columnResults.length >= 2) {
    // Apply region styling to column elements
    for (const col of columnResults) {
      for (const el of col.elements) {
        applyStyleOverrides(el, regionStyle);
      }
    }
    return {
      elements: [],
      regionStyle: Object.keys(regionStyle).length > 0 ? regionStyle : undefined,
      columns: columnResults,
      isColumnLayout: true,
    };
  }

  // 3. Try complex composition parsing ("heading X, text Y, button Z")
  const composed = parseComposition(prompt);
  if (composed) {
    for (const el of composed) {
      applyStyleOverrides(el, regionStyle);
    }
    return {
      elements: composed,
      regionStyle: Object.keys(regionStyle).length > 0 ? regionStyle : undefined,
      isColumnLayout: false,
    };
  }

  // 4. Fall back to standard pattern matching
  const elements = promptToElements(prompt);
  for (const el of elements) {
    applyStyleOverrides(el, regionStyle);
  }

  return {
    elements,
    regionStyle: Object.keys(regionStyle).length > 0 ? regionStyle : undefined,
    isColumnLayout: false,
  };
}

function applyStyleOverrides(el: EmailElement, style: RegionStyleOverrides) {
  if (style.textColor && !el.styles.color) {
    el.styles.color = style.textColor;
  }
  if (style.textAlign && !el.styles.textAlign) {
    el.styles.textAlign = style.textAlign;
  }
  // For buttons, apply text color to textColor prop
  if (style.textColor && el.type === "button" && el.textColor === "#ffffff") {
    // Don't override button text color if region text color is set (buttons have their own scheme)
  }
}

// ── Main entry point (original — used by composition parser and column parser) ──

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
  { label: "Mktg Footer", prompt: "marketing footer with unsubscribe and social", icon: "⊥" },
  { label: "Txn Footer", prompt: "transactional footer", icon: "⊥" },
  { label: "Header", prompt: "email header with logo left, nav right, and Shop Now CTA", icon: "⊤" },
  { label: "Divider", prompt: "divider line", icon: "—" },
  { label: "Spacer", prompt: "spacer 30px", icon: "↕" },
  { label: "Image", prompt: "placeholder image", icon: "▣" },
  { label: "Video", prompt: "video placeholder", icon: "▷" },
];

// ── Creative Prompt Examples (shown in enhanced prompt bar) ──
export const CREATIVE_PROMPT_EXAMPLES: string[] = [
  'Dark background with white centered heading "Flash Sale" and countdown timer',
  'Left column product image, right column heading "New Arrival" with body text and Shop Now button',
  'Dark header with centered logo, pill nav below, and "Shop Now" CTA button',
  'Header with announcement bar "Free shipping today!", logo left, bold nav right, border bottom',
  'Red background, white text, centered heading "50% OFF" with promo code SAVE50 and CTA',
  'E-commerce header: logo left, nav links Home Shop Sale Blog, rounded CTA "Start Shopping"',
  'Minimal header with small logo center, tagline "Since 2020", underline nav below',
  'Two columns: left is timer with "Sale ends" label, right is discount code and shop now button',
];
