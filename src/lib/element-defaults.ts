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
      styles: { fontSize: "32px", color: "#111111", textAlign: "left", padding: "10px 0", fontFamily: "Arial, sans-serif" },
    },
  },
  {
    type: "text",
    label: "Text",
    icon: "T",
    defaultProps: {
      content: "Your text content goes here. Click to edit and add your message.",
      styles: { fontSize: "16px", color: "#333333", padding: "10px 0", lineHeight: "1.6", fontFamily: "Arial, sans-serif" },
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
      styles: { textAlign: "center", padding: "10px 0", fontFamily: "Arial, sans-serif" },
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
      styles: { padding: "20px 0", fontFamily: "Arial, sans-serif", fontSize: "24px" },
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
  {
    type: "footer",
    label: "Footer",
    icon: "⊥",
    defaultProps: {
      variant: "marketing",
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
      styles: { padding: "0", backgroundColor: "#f9fafb", fontFamily: "Arial, sans-serif" },
    },
  },
  {
    type: "header",
    label: "Header",
    icon: "⊤",
    defaultProps: {
      variant: "logo-nav",
      logoSrc: "https://placehold.co/180x50/f8fafc/334155?text=YOUR+LOGO",
      logoAlt: "Company Logo",
      logoWidth: "180px",
      logoPosition: "left",
      tagline: "",
      taglineColor: "#6b7280",
      taglineFontSize: "12px",
      navLinks: [
        { label: "Home", url: "https://example.com" },
        { label: "Shop", url: "https://example.com/shop" },
        { label: "Sale", url: "https://example.com/sale" },
        { label: "About", url: "https://example.com/about" },
      ],
      navPosition: "right",
      navStyle: "text",
      navFontSize: "13px",
      navColor: "",
      ctaText: "Shop Now",
      ctaUrl: "https://example.com",
      ctaColor: "#4F46E5",
      ctaTextColor: "#ffffff",
      ctaBorderRadius: "6px",
      showCta: false,
      announcementText: "",
      announcementBg: "#4F46E5",
      announcementTextColor: "#ffffff",
      showAnnouncement: false,
      preheaderText: "",
      backgroundColor: "#ffffff",
      textColor: "#374151",
      borderBottom: "",
      styles: { padding: "16px 0", fontFamily: "Arial, sans-serif" },
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
