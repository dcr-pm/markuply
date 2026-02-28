"use client";

import type { HeaderElement } from "@/types/builder";

interface HeaderBlockProps {
  element: HeaderElement;
  selected: boolean;
  onSelect: () => void;
  onChange: (el: HeaderElement) => void;
}

export function HeaderBlock({ element, selected, onSelect }: HeaderBlockProps) {
  const textColor = element.textColor || "#374151";

  return (
    <div
      onClick={onSelect}
      className={`group relative cursor-pointer rounded-lg transition-all ${
        selected ? "ring-2 ring-indigo-500 ring-offset-2" : "hover:ring-2 hover:ring-gray-300"
      }`}
    >
      <div
        style={{
          backgroundColor: element.backgroundColor || "#ffffff",
          padding: element.styles.padding || "16px 0",
        }}
      >
        {/* Preheader text */}
        {element.preheaderText && (
          <p style={{ fontSize: "11px", color: "#9ca3af", textAlign: "center", margin: "0 0 12px" }}>
            {element.preheaderText}
          </p>
        )}

        {/* Logo + Nav layout */}
        {element.variant === "centered" ? (
          <div style={{ textAlign: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={element.logoSrc}
              alt={element.logoAlt}
              style={{ width: element.logoWidth || "180px", height: "auto", display: "inline-block" }}
            />
            {element.navLinks.length > 0 && (
              <div style={{ marginTop: "12px" }}>
                {element.navLinks.map((link, i) => (
                  <span key={link.label}>
                    <span style={{ color: textColor, fontSize: "13px", cursor: "pointer" }}>
                      {link.label}
                    </span>
                    {i < element.navLinks.length - 1 && (
                      <span style={{ color: "#d1d5db", margin: "0 12px" }}>|</span>
                    )}
                  </span>
                ))}
              </div>
            )}
          </div>
        ) : element.variant === "logo-only" ? (
          <div style={{ textAlign: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={element.logoSrc}
              alt={element.logoAlt}
              style={{ width: element.logoWidth || "180px", height: "auto", display: "inline-block" }}
            />
          </div>
        ) : (
          /* logo-nav and full */
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 8px" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={element.logoSrc}
              alt={element.logoAlt}
              style={{ width: element.logoWidth || "180px", height: "auto" }}
            />
            {element.navLinks.length > 0 && (
              <div>
                {element.navLinks.map((link, i) => (
                  <span key={link.label}>
                    <span style={{ color: textColor, fontSize: "13px", cursor: "pointer" }}>
                      {link.label}
                    </span>
                    {i < element.navLinks.length - 1 && (
                      <span style={{ color: "#d1d5db", margin: "0 10px" }}>|</span>
                    )}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {selected && (
        <div className="absolute -top-3 left-2 rounded bg-indigo-600 px-2 py-0.5 text-[10px] font-medium text-white">
          Header ({element.variant})
        </div>
      )}
    </div>
  );
}
