"use client";

import type { FooterElement } from "@/types/builder";

interface FooterBlockProps {
  element: FooterElement;
  selected: boolean;
  onSelect: () => void;
  onChange: (el: FooterElement) => void;
}

export function FooterBlock({ element, onSelect }: FooterBlockProps) {
  const textColor = element.textColor || "#9ca3af";
  const dividerColor = element.dividerColor || "#e5e7eb";
  const fontFamily = element.styles.fontFamily || "Arial, sans-serif";
  const fontSize = element.styles.fontSize || "12px";

  return (
    <div onClick={onSelect} className="cursor-pointer rounded-lg">
      <div
        style={{
          backgroundColor: element.styles.backgroundColor || "#f9fafb",
          padding: "24px 20px",
          textAlign: "center",
          borderTop: `1px solid ${dividerColor}`,
          fontFamily,
          fontSize,
        }}
      >
        {/* Social icons */}
        {element.showSocial && element.socialLinks.length > 0 && (
          <div style={{ marginBottom: "16px" }}>
            {element.socialLinks.map((link) => (
              <span key={link.platform} className="inline-block mx-1.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={link.icon}
                  alt={link.platform}
                  width={24}
                  height={24}
                  className="rounded"
                  style={{ display: "inline-block" }}
                />
              </span>
            ))}
          </div>
        )}

        {/* Footer links */}
        {element.links.length > 0 && (
          <div style={{ marginBottom: "12px" }}>
            {element.links.map((link, i) => (
              <span key={link.label}>
                <span
                  style={{
                    color: textColor,
                    fontSize: "12px",
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                >
                  {link.label}
                </span>
                {i < element.links.length - 1 && (
                  <span style={{ color: textColor, fontSize: "12px", margin: "0 8px" }}>|</span>
                )}
              </span>
            ))}
          </div>
        )}

        {/* Company address */}
        {element.showAddress && element.companyAddress && (
          <p style={{ fontSize: "11px", color: textColor, margin: "0 0 8px", lineHeight: "1.5" }}>
            {element.companyName} | {element.companyAddress}
          </p>
        )}

        {/* Legal links */}
        <p style={{ fontSize: "11px", color: textColor, margin: "0 0 8px", lineHeight: "1.5" }}>
          <span style={{ textDecoration: "underline", cursor: "pointer" }}>Unsubscribe</span>
          {" | "}
          <span style={{ textDecoration: "underline", cursor: "pointer" }}>Email Preferences</span>
          {" | "}
          <span style={{ textDecoration: "underline", cursor: "pointer" }}>Privacy Policy</span>
          {" | "}
          <span style={{ textDecoration: "underline", cursor: "pointer" }}>Terms of Service</span>
        </p>

        {/* Copyright */}
        <p style={{ fontSize: "10px", color: textColor, margin: "8px 0 0", opacity: 0.7 }}>
          &copy; {new Date().getFullYear()} {element.companyName}. All rights reserved.
        </p>

        {/* CAN-SPAM / transactional notice */}
        {element.variant === "transactional" && (
          <p style={{ fontSize: "10px", color: textColor, margin: "8px 0 0", opacity: 0.6 }}>
            This is a transactional email related to your account activity.
          </p>
        )}
      </div>
    </div>
  );
}
