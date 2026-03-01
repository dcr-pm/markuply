"use client";

import type { HeaderElement } from "@/types/builder";

interface HeaderBlockProps {
  element: HeaderElement;
  selected: boolean;
  onSelect: () => void;
  onChange: (el: HeaderElement) => void;
}

export function HeaderBlock({ element, onSelect }: HeaderBlockProps) {
  const textColor = element.textColor || "#374151";
  const navColor = element.navColor || textColor;
  const navFontSize = element.navFontSize || "13px";
  const logoPosition = element.logoPosition || "left";
  const navPosition = element.navPosition || "right";
  const navStyle = element.navStyle || "text";

  const renderNavLink = (link: { label: string; url: string }, i: number, total: number) => {
    const baseStyle: React.CSSProperties = {
      color: navColor,
      fontSize: navFontSize,
      cursor: "pointer",
      textDecoration: "none",
      fontWeight: navStyle === "bold" ? "700" : "normal",
    };

    if (navStyle === "pills") {
      return (
        <span
          key={link.label}
          style={{
            ...baseStyle,
            backgroundColor: navColor + "18",
            padding: "5px 14px",
            borderRadius: "999px",
            margin: "0 3px",
            display: "inline-block",
          }}
        >
          {link.label}
        </span>
      );
    }

    if (navStyle === "underline") {
      return (
        <span key={link.label}>
          <span
            style={{
              ...baseStyle,
              borderBottom: `2px solid ${navColor}`,
              paddingBottom: "2px",
            }}
          >
            {link.label}
          </span>
          {i < total - 1 && <span style={{ margin: "0 12px" }} />}
        </span>
      );
    }

    // "text" and "bold" styles
    return (
      <span key={link.label}>
        <span style={baseStyle}>{link.label}</span>
        {i < total - 1 && (
          <span style={{ color: "#d1d5db", margin: "0 10px" }}>|</span>
        )}
      </span>
    );
  };

  const navLinks = element.navLinks || [];
  const navBlock = navLinks.length > 0 ? (
    <div
      style={{
        textAlign: navPosition === "below" ? (logoPosition === "center" ? "center" : "left") : undefined,
        marginTop: navPosition === "below" ? "10px" : undefined,
      }}
    >
      {navLinks.map((link, i) => renderNavLink(link, i, navLinks.length))}
    </div>
  ) : null;

  const logoBlock = (
    <div style={{ display: "inline-block" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={element.logoSrc}
        alt={element.logoAlt}
        style={{
          width: element.logoWidth || "180px",
          height: "auto",
          display: "block",
        }}
      />
      {element.tagline && (
        <p
          style={{
            margin: "4px 0 0",
            fontSize: element.taglineFontSize || "12px",
            color: element.taglineColor || "#6b7280",
            lineHeight: "1.4",
          }}
        >
          {element.tagline}
        </p>
      )}
    </div>
  );

  const ctaBlock = element.showCta && element.ctaText ? (
    <span
      style={{
        display: "inline-block",
        backgroundColor: element.ctaColor || "#4F46E5",
        color: element.ctaTextColor || "#ffffff",
        padding: "8px 20px",
        borderRadius: element.ctaBorderRadius || "6px",
        fontSize: "13px",
        fontWeight: "600",
        cursor: "pointer",
        textDecoration: "none",
        marginLeft: "12px",
        whiteSpace: "nowrap",
      }}
    >
      {element.ctaText}
    </span>
  ) : null;

  // Determine layout
  const isCentered = logoPosition === "center";
  const isNavBelow = navPosition === "below";

  return (
    <div onClick={onSelect} className="cursor-pointer rounded-lg">
      {/* Announcement Bar */}
      {element.showAnnouncement && element.announcementText && (
        <div
          style={{
            backgroundColor: element.announcementBg || "#4F46E5",
            color: element.announcementTextColor || "#ffffff",
            fontSize: "12px",
            fontWeight: "600",
            textAlign: "center",
            padding: "8px 16px",
            letterSpacing: "0.5px",
          }}
        >
          {element.announcementText}
        </div>
      )}

      <div
        style={{
          backgroundColor: element.backgroundColor || "#ffffff",
          padding: element.styles.padding || "16px 0",
          borderBottom: element.borderBottom || undefined,
        }}
      >
        {/* Preheader text */}
        {element.preheaderText && (
          <p style={{ fontSize: "11px", color: "#9ca3af", textAlign: "center", margin: "0 0 12px" }}>
            {element.preheaderText}
          </p>
        )}

        {/* Centered layout */}
        {isCentered ? (
          <div style={{ textAlign: "center" }}>
            {logoBlock}
            {isNavBelow && navBlock}
            {!isNavBelow && navBlock && (
              <div style={{ marginTop: "10px" }}>{navBlock}</div>
            )}
            {ctaBlock && <div style={{ marginTop: "10px" }}>{ctaBlock}</div>}
          </div>
        ) : (
          /* Horizontal layout — logo left/right + nav + CTA */
          <div
            style={{
              display: "flex",
              alignItems: isNavBelow ? "flex-start" : "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              padding: "0 8px",
              flexDirection: logoPosition === "right" ? "row-reverse" : "row",
            }}
          >
            {logoBlock}

            {!isNavBelow && (
              <div style={{ display: "flex", alignItems: "center", gap: "0" }}>
                {navBlock}
                {ctaBlock}
              </div>
            )}

            {isNavBelow && ctaBlock && (
              <div style={{ display: "flex", alignItems: "center" }}>
                {ctaBlock}
              </div>
            )}

            {isNavBelow && navBlock && (
              <div style={{ width: "100%", marginTop: "10px", padding: "0" }}>
                {navBlock}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
