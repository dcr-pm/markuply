import { v4 as uuid } from "uuid";
import type { EmailElement, ElementType, DragItem } from "@/types/builder";

export const ELEMENT_PALETTE: DragItem[] = [
  {
    type: "heading",
    label: "Heading",
    icon: "H",
    defaultProps: {
      content: "Your Heading Here",
      level: 1,
      styles: { fontSize: "32px", color: "#111111", textAlign: "left", padding: "10px 0" },
    },
  },
  {
    type: "text",
    label: "Text",
    icon: "T",
    defaultProps: {
      content: "Your text content goes here. Click to edit and add your message.",
      styles: { fontSize: "16px", color: "#333333", padding: "10px 0", lineHeight: "1.6" },
    },
  },
  {
    type: "image",
    label: "Image",
    icon: "🖼",
    defaultProps: {
      src: "https://placehold.co/600x300/e2e8f0/64748b?text=Your+Image",
      alt: "Image",
      styles: { width: "100%", borderRadius: "8px", padding: "10px 0" },
    },
  },
  {
    type: "button",
    label: "Button",
    icon: "▶",
    defaultProps: {
      text: "Click Here",
      link: "https://example.com",
      buttonColor: "#4F46E5",
      textColor: "#ffffff",
      borderRadius: "6px",
      styles: { textAlign: "center", padding: "10px 0" },
    },
  },
  {
    type: "divider",
    label: "Divider",
    icon: "—",
    defaultProps: {
      thickness: "1px",
      dividerColor: "#e5e7eb",
      dividerWidth: "100%",
      styles: { padding: "10px 0" },
    },
  },
  {
    type: "spacer",
    label: "Spacer",
    icon: "↕",
    defaultProps: {
      height: "30px",
      styles: {},
    },
  },
  {
    type: "video",
    label: "Video",
    icon: "▷",
    defaultProps: {
      thumbnailSrc: "https://placehold.co/600x340/1e293b/f8fafc?text=Video+Thumbnail",
      videoUrl: "https://example.com/video",
      alt: "Video",
      styles: { width: "100%", borderRadius: "8px", padding: "10px 0" },
    },
  },
  {
    type: "gif",
    label: "GIF",
    icon: "G",
    defaultProps: {
      src: "https://placehold.co/400x300/fef3c7/d97706?text=Your+GIF",
      alt: "GIF",
      styles: { width: "100%", borderRadius: "8px", padding: "10px 0" },
    },
  },
  {
    type: "timer",
    label: "Timer",
    icon: "⏱",
    defaultProps: {
      targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      label: "Offer ends in",
      timerColor: "#4F46E5",
      labelColor: "#666666",
      styles: { padding: "20px 0" },
    },
  },
  {
    type: "social",
    label: "Social",
    icon: "@",
    defaultProps: {
      links: [
        { platform: "Twitter", url: "https://twitter.com", icon: "https://placehold.co/32/1DA1F2/fff?text=X" },
        { platform: "Facebook", url: "https://facebook.com", icon: "https://placehold.co/32/1877F2/fff?text=f" },
        { platform: "Instagram", url: "https://instagram.com", icon: "https://placehold.co/32/E4405F/fff?text=IG" },
        { platform: "LinkedIn", url: "https://linkedin.com", icon: "https://placehold.co/32/0A66C2/fff?text=in" },
      ],
      iconSize: "32px",
      styles: { textAlign: "center", padding: "10px 0" },
    },
  },
  {
    type: "columns",
    label: "Columns",
    icon: "❙❙",
    defaultProps: {
      columns: [
        { width: "50%", elements: [] },
        { width: "50%", elements: [] },
      ],
      styles: { padding: "10px 0" },
    },
  },
  {
    type: "html",
    label: "HTML",
    icon: "</>",
    defaultProps: {
      rawHtml: '<div style="padding: 10px; text-align: center; color: #666;">Custom HTML Block</div>',
      styles: {},
    },
  },
];

export function createDefaultElement(type: ElementType): EmailElement {
  const palette = ELEMENT_PALETTE.find((p) => p.type === type);
  if (!palette) {
    return {
      id: uuid(),
      type: "text",
      content: "New text block",
      styles: { padding: "10px 0" },
    };
  }

  return {
    id: uuid(),
    type,
    ...palette.defaultProps,
    styles: { ...palette.defaultProps.styles },
  } as EmailElement;
}
