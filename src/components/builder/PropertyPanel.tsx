"use client";

import type { EmailElement, HeaderElement } from "@/types/builder";

interface PropertyPanelProps {
  element: EmailElement | null;
  onChange: (el: EmailElement) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-[11px] font-medium text-mk-text-muted mb-1">
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-mk-border px-3 py-2 text-sm text-mk-text focus:border-mk-primary focus:outline-none focus:ring-1 focus:ring-mk-primary"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-mk-border px-3 py-2 text-sm text-mk-text focus:border-mk-primary focus:outline-none focus:ring-1 focus:ring-mk-primary"
        />
      )}
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-[11px] font-medium text-mk-text-muted mb-1">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-8 rounded-md border border-mk-border cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 rounded-lg border border-mk-border px-3 py-1.5 text-sm font-mono text-mk-text focus:border-mk-primary focus:outline-none"
        />
      </div>
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-[11px] font-medium text-mk-text-muted mb-1">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-mk-border px-3 py-2 text-sm text-mk-text focus:border-mk-primary focus:outline-none"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function renderProperties(
  element: EmailElement,
  onChange: (el: EmailElement) => void,
) {
  const updateStyles = (key: string, value: string) => {
    onChange({ ...element, styles: { ...element.styles, [key]: value } });
  };

  const commonStyleFields = (
    <div className="space-y-3 border-t border-mk-border-light pt-3 mt-3">
      <p className="text-[10px] font-semibold text-mk-text-muted uppercase tracking-widest">
        Typography
      </p>
      <SelectField
        label="Font Family"
        value={element.styles.fontFamily || "Arial, sans-serif"}
        options={[
          { label: "Arial", value: "Arial, sans-serif" },
          { label: "Helvetica", value: "Helvetica, Arial, sans-serif" },
          { label: "Georgia", value: "Georgia, serif" },
          { label: "Times New Roman", value: "'Times New Roman', Times, serif" },
          { label: "Verdana", value: "Verdana, Geneva, sans-serif" },
          { label: "Trebuchet MS", value: "'Trebuchet MS', sans-serif" },
          { label: "Courier New", value: "'Courier New', Courier, monospace" },
          { label: "Tahoma", value: "Tahoma, Geneva, sans-serif" },
          { label: "Lucida Sans", value: "'Lucida Sans Unicode', 'Lucida Grande', sans-serif" },
          { label: "Palatino", value: "'Palatino Linotype', 'Book Antiqua', Palatino, serif" },
          { label: "Garamond", value: "Garamond, serif" },
          { label: "System UI", value: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" },
        ]}
        onChange={(v) => updateStyles("fontFamily", v)}
      />
      <InputField
        label="Font Size"
        value={element.styles.fontSize || "16px"}
        onChange={(v) => updateStyles("fontSize", v)}
      />
      <ColorField
        label="Text Color"
        value={element.styles.color || "#333333"}
        onChange={(v) => updateStyles("color", v)}
      />
      <SelectField
        label="Font Weight"
        value={element.styles.fontWeight || "normal"}
        options={[
          { label: "Light (300)", value: "300" },
          { label: "Normal (400)", value: "normal" },
          { label: "Medium (500)", value: "500" },
          { label: "Semi-Bold (600)", value: "600" },
          { label: "Bold (700)", value: "bold" },
          { label: "Extra-Bold (800)", value: "800" },
        ]}
        onChange={(v) => updateStyles("fontWeight", v)}
      />
      <InputField
        label="Line Height"
        value={element.styles.lineHeight || "1.5"}
        onChange={(v) => updateStyles("lineHeight", v)}
      />

      <p className="text-[10px] font-semibold text-mk-text-muted uppercase tracking-widest pt-2">
        Layout
      </p>
      <SelectField
        label="Position / Text Align"
        value={element.styles.textAlign || "left"}
        options={[
          { label: "Left", value: "left" },
          { label: "Center", value: "center" },
          { label: "Right", value: "right" },
        ]}
        onChange={(v) => updateStyles("textAlign", v)}
      />
      <ColorField
        label="Background Color"
        value={element.styles.backgroundColor || "#ffffff"}
        onChange={(v) => updateStyles("backgroundColor", v)}
      />
      <InputField
        label="Padding"
        value={element.styles.padding || "10px 0"}
        onChange={(v) => updateStyles("padding", v)}
      />
      <InputField
        label="Border Radius"
        value={element.styles.borderRadius || "0"}
        onChange={(v) => updateStyles("borderRadius", v)}
      />
    </div>
  );

  switch (element.type) {
    case "text":
      return (
        <div className="space-y-3">
          <InputField
            label="Content"
            value={element.content}
            onChange={(v) => onChange({ ...element, content: v })}
            type="textarea"
          />
          <InputField
            label="Font Size"
            value={element.styles.fontSize || "16px"}
            onChange={(v) => updateStyles("fontSize", v)}
          />
          <ColorField
            label="Text Color"
            value={element.styles.color || "#333333"}
            onChange={(v) => updateStyles("color", v)}
          />
          <InputField
            label="Line Height"
            value={element.styles.lineHeight || "1.6"}
            onChange={(v) => updateStyles("lineHeight", v)}
          />
          <SelectField
            label="Font Weight"
            value={element.styles.fontWeight || "normal"}
            options={[
              { label: "Normal", value: "normal" },
              { label: "Bold", value: "bold" },
              { label: "Light", value: "300" },
            ]}
            onChange={(v) => updateStyles("fontWeight", v)}
          />
          {commonStyleFields}
        </div>
      );

    case "heading":
      return (
        <div className="space-y-3">
          <InputField
            label="Content"
            value={element.content}
            onChange={(v) => onChange({ ...element, content: v })}
          />
          <SelectField
            label="Level"
            value={String(element.level)}
            options={[
              { label: "H1 — Large", value: "1" },
              { label: "H2 — Medium", value: "2" },
              { label: "H3 — Small", value: "3" },
            ]}
            onChange={(v) =>
              onChange({ ...element, level: parseInt(v) as 1 | 2 | 3 })
            }
          />
          <InputField
            label="Font Size"
            value={element.styles.fontSize || "32px"}
            onChange={(v) => updateStyles("fontSize", v)}
          />
          <ColorField
            label="Text Color"
            value={element.styles.color || "#111111"}
            onChange={(v) => updateStyles("color", v)}
          />
          {commonStyleFields}
        </div>
      );

    case "image":
      return (
        <div className="space-y-3">
          <InputField
            label="Image URL"
            value={element.src}
            onChange={(v) => onChange({ ...element, src: v })}
          />
          <InputField
            label="Alt Text"
            value={element.alt}
            onChange={(v) => onChange({ ...element, alt: v })}
          />
          <InputField
            label="Link URL"
            value={element.link || ""}
            onChange={(v) => onChange({ ...element, link: v })}
          />
          <InputField
            label="Border Radius"
            value={element.styles.borderRadius || "0"}
            onChange={(v) => updateStyles("borderRadius", v)}
          />
          <InputField
            label="Width"
            value={element.styles.width || "100%"}
            onChange={(v) => updateStyles("width", v)}
          />
          {commonStyleFields}
        </div>
      );

    case "button":
      return (
        <div className="space-y-3">
          <InputField
            label="Button Text"
            value={element.text}
            onChange={(v) => onChange({ ...element, text: v })}
          />
          <InputField
            label="Link URL"
            value={element.link}
            onChange={(v) => onChange({ ...element, link: v })}
          />
          <ColorField
            label="Button Color"
            value={element.buttonColor || "#4F46E5"}
            onChange={(v) => onChange({ ...element, buttonColor: v })}
          />
          <ColorField
            label="Text Color"
            value={element.textColor || "#ffffff"}
            onChange={(v) => onChange({ ...element, textColor: v })}
          />
          <InputField
            label="Border Radius"
            value={element.borderRadius || "6px"}
            onChange={(v) => onChange({ ...element, borderRadius: v })}
          />
          <InputField
            label="Font Size"
            value={element.styles.fontSize || "16px"}
            onChange={(v) => updateStyles("fontSize", v)}
          />
          {commonStyleFields}
        </div>
      );

    case "divider":
      return (
        <div className="space-y-3">
          <InputField
            label="Thickness"
            value={element.thickness || "1px"}
            onChange={(v) => onChange({ ...element, thickness: v })}
          />
          <ColorField
            label="Color"
            value={element.dividerColor || "#e5e7eb"}
            onChange={(v) => onChange({ ...element, dividerColor: v })}
          />
          <InputField
            label="Width"
            value={element.dividerWidth || "100%"}
            onChange={(v) => onChange({ ...element, dividerWidth: v })}
          />
          {commonStyleFields}
        </div>
      );

    case "spacer":
      return (
        <div className="space-y-3">
          <InputField
            label="Height"
            value={element.height || "30px"}
            onChange={(v) => onChange({ ...element, height: v })}
          />
          {commonStyleFields}
        </div>
      );

    case "video":
      return (
        <div className="space-y-3">
          <InputField
            label="Video URL"
            value={element.videoUrl}
            onChange={(v) => onChange({ ...element, videoUrl: v })}
          />
          <InputField
            label="Thumbnail URL"
            value={element.thumbnailSrc}
            onChange={(v) => onChange({ ...element, thumbnailSrc: v })}
          />
          <InputField
            label="Alt Text"
            value={element.alt}
            onChange={(v) => onChange({ ...element, alt: v })}
          />
          <InputField
            label="Border Radius"
            value={element.styles.borderRadius || "0"}
            onChange={(v) => updateStyles("borderRadius", v)}
          />
          {commonStyleFields}
        </div>
      );

    case "gif":
      return (
        <div className="space-y-3">
          <InputField
            label="GIF URL"
            value={element.src}
            onChange={(v) => onChange({ ...element, src: v })}
          />
          <InputField
            label="Alt Text"
            value={element.alt}
            onChange={(v) => onChange({ ...element, alt: v })}
          />
          <InputField
            label="Link URL"
            value={element.link || ""}
            onChange={(v) => onChange({ ...element, link: v })}
          />
          <InputField
            label="Border Radius"
            value={element.styles.borderRadius || "0"}
            onChange={(v) => updateStyles("borderRadius", v)}
          />
          {commonStyleFields}
        </div>
      );

    case "timer":
      return (
        <div className="space-y-3">
          <InputField
            label="Label"
            value={element.label}
            onChange={(v) => onChange({ ...element, label: v })}
          />
          <InputField
            label="Target Date"
            value={element.targetDate.slice(0, 16)}
            onChange={(v) => onChange({ ...element, targetDate: new Date(v).toISOString() })}
            type="datetime-local"
          />
          <ColorField
            label="Timer Color"
            value={element.timerColor || "#4F46E5"}
            onChange={(v) => onChange({ ...element, timerColor: v })}
          />
          <ColorField
            label="Label Color"
            value={element.labelColor || "#666666"}
            onChange={(v) => onChange({ ...element, labelColor: v })}
          />
          <InputField
            label="Digit Font Size"
            value={element.styles.fontSize || "24px"}
            onChange={(v) => updateStyles("fontSize", v)}
          />
          {commonStyleFields}
        </div>
      );

    case "social":
      return (
        <div className="space-y-3">
          <InputField
            label="Icon Size"
            value={element.iconSize || "32px"}
            onChange={(v) => onChange({ ...element, iconSize: v })}
          />
          {element.links.map((link, i) => (
            <div key={i} className="rounded-lg border border-gray-200 p-2 space-y-2">
              <InputField
                label={`${link.platform} URL`}
                value={link.url}
                onChange={(v) => {
                  const newLinks = [...element.links];
                  newLinks[i] = { ...link, url: v };
                  onChange({ ...element, links: newLinks });
                }}
              />
            </div>
          ))}
          {commonStyleFields}
        </div>
      );

    case "columns":
      return (
        <div className="space-y-3">
          <SelectField
            label="Number of Columns"
            value={String(element.columns.length)}
            options={[
              { label: "2 Columns", value: "2" },
              { label: "3 Columns", value: "3" },
              { label: "4 Columns", value: "4" },
            ]}
            onChange={(v) => {
              const count = parseInt(v);
              const width = `${Math.floor(100 / count)}%`;
              const cols = Array.from({ length: count }, (_, i) =>
                element.columns[i] || { width, elements: [] },
              );
              onChange({ ...element, columns: cols });
            }}
          />
          {commonStyleFields}
        </div>
      );

    case "html":
      return (
        <div className="space-y-3">
          <InputField
            label="HTML Code"
            value={element.rawHtml}
            onChange={(v) => onChange({ ...element, rawHtml: v })}
            type="textarea"
          />
          {commonStyleFields}
        </div>
      );

    case "footer":
      return (
        <div className="space-y-3">
          <SelectField
            label="Footer Variant"
            value={element.variant}
            options={[
              { label: "Marketing", value: "marketing" },
              { label: "Transactional", value: "transactional" },
              { label: "Minimal", value: "minimal" },
              { label: "Full", value: "full" },
            ]}
            onChange={(v) => onChange({ ...element, variant: v as "marketing" | "transactional" | "minimal" | "full" })}
          />
          <InputField
            label="Company Name"
            value={element.companyName}
            onChange={(v) => onChange({ ...element, companyName: v })}
          />
          <InputField
            label="Company Address"
            value={element.companyAddress}
            onChange={(v) => onChange({ ...element, companyAddress: v })}
          />
          <InputField
            label="Unsubscribe URL"
            value={element.unsubscribeUrl}
            onChange={(v) => onChange({ ...element, unsubscribeUrl: v })}
          />
          <InputField
            label="Preferences URL"
            value={element.preferencesUrl}
            onChange={(v) => onChange({ ...element, preferencesUrl: v })}
          />
          <InputField
            label="Privacy Policy URL"
            value={element.privacyUrl}
            onChange={(v) => onChange({ ...element, privacyUrl: v })}
          />
          <InputField
            label="Terms URL"
            value={element.termsUrl}
            onChange={(v) => onChange({ ...element, termsUrl: v })}
          />
          <ColorField
            label="Text Color"
            value={element.textColor || "#9ca3af"}
            onChange={(v) => onChange({ ...element, textColor: v })}
          />
          <ColorField
            label="Divider Color"
            value={element.dividerColor || "#e5e7eb"}
            onChange={(v) => onChange({ ...element, dividerColor: v })}
          />
          {commonStyleFields}
        </div>
      );

    case "header": {
      const applyPreset = (variant: HeaderElement["variant"]) => {
        const presets: Record<HeaderElement["variant"], Partial<HeaderElement>> = {
          "logo-nav": {
            logoPosition: "left",
            navPosition: "right",
            navStyle: "text",
            showCta: false,
            showAnnouncement: false,
          },
          "logo-only": {
            logoPosition: "center",
            navPosition: "below",
            navStyle: "text",
            showCta: false,
            showAnnouncement: false,
            navLinks: [],
          },
          "centered": {
            logoPosition: "center",
            navPosition: "below",
            navStyle: "text",
            showCta: false,
            showAnnouncement: false,
          },
          "full": {
            logoPosition: "left",
            navPosition: "right",
            navStyle: "text",
            showCta: true,
            showAnnouncement: true,
            announcementText: element.announcementText || "Free shipping on orders over $50!",
          },
          "minimal": {
            logoPosition: "left",
            navPosition: "right",
            navStyle: "text",
            showCta: false,
            showAnnouncement: false,
            borderBottom: "1px solid #e5e7eb",
          },
          "bold": {
            logoPosition: "left",
            navPosition: "right",
            navStyle: "bold",
            showCta: true,
            showAnnouncement: false,
            backgroundColor: "#1A1625",
            textColor: "#ffffff",
            navColor: "#ffffff",
          },
          "ecommerce": {
            logoPosition: "center",
            navPosition: "below",
            navStyle: "pills",
            showCta: true,
            ctaText: "Shop Now",
            showAnnouncement: true,
            announcementText: element.announcementText || "New collection available - Shop now!",
          },
        };
        onChange({ ...element, variant, ...presets[variant] });
      };

      return (
        <div className="space-y-3">
          <SelectField
            label="Preset"
            value={element.variant}
            options={[
              { label: "Logo + Nav", value: "logo-nav" },
              { label: "Logo Only", value: "logo-only" },
              { label: "Centered", value: "centered" },
              { label: "Full", value: "full" },
              { label: "Minimal", value: "minimal" },
              { label: "Bold", value: "bold" },
              { label: "E-commerce", value: "ecommerce" },
            ]}
            onChange={(v) => applyPreset(v as HeaderElement["variant"])}
          />

          {/* ── Announcement Bar ── */}
          <div className="space-y-2 border-t border-mk-border-light pt-3">
            <p className="text-[10px] font-semibold text-mk-text-muted uppercase tracking-widest">Announcement Bar</p>
            <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={element.showAnnouncement || false}
                onChange={(e) => onChange({ ...element, showAnnouncement: e.target.checked })}
                className="rounded border-gray-300"
              />
              Show announcement bar
            </label>
            {element.showAnnouncement && (
              <>
                <InputField
                  label="Announcement Text"
                  value={element.announcementText || ""}
                  onChange={(v) => onChange({ ...element, announcementText: v })}
                />
                <ColorField
                  label="Bar Background"
                  value={element.announcementBg || "#4F46E5"}
                  onChange={(v) => onChange({ ...element, announcementBg: v })}
                />
                <ColorField
                  label="Bar Text Color"
                  value={element.announcementTextColor || "#ffffff"}
                  onChange={(v) => onChange({ ...element, announcementTextColor: v })}
                />
              </>
            )}
          </div>

          {/* ── Logo ── */}
          <div className="space-y-2 border-t border-mk-border-light pt-3">
            <p className="text-[10px] font-semibold text-mk-text-muted uppercase tracking-widest">Logo</p>
            <InputField
              label="Logo URL"
              value={element.logoSrc}
              onChange={(v) => onChange({ ...element, logoSrc: v })}
            />
            <InputField
              label="Alt Text"
              value={element.logoAlt}
              onChange={(v) => onChange({ ...element, logoAlt: v })}
            />
            <InputField
              label="Width"
              value={element.logoWidth || "180px"}
              onChange={(v) => onChange({ ...element, logoWidth: v })}
            />
          </div>

          {/* ── Tagline ── */}
          <div className="space-y-2 border-t border-mk-border-light pt-3">
            <p className="text-[10px] font-semibold text-mk-text-muted uppercase tracking-widest">Tagline</p>
            <InputField
              label="Tagline Text"
              value={element.tagline || ""}
              onChange={(v) => onChange({ ...element, tagline: v })}
            />
            {element.tagline && (
              <>
                <ColorField
                  label="Tagline Color"
                  value={element.taglineColor || "#6b7280"}
                  onChange={(v) => onChange({ ...element, taglineColor: v })}
                />
                <InputField
                  label="Tagline Font Size"
                  value={element.taglineFontSize || "12px"}
                  onChange={(v) => onChange({ ...element, taglineFontSize: v })}
                />
              </>
            )}
          </div>

          {/* ── Navigation ── */}
          <div className="space-y-2 border-t border-mk-border-light pt-3">
            <p className="text-[10px] font-semibold text-mk-text-muted uppercase tracking-widest">Navigation</p>
            <SelectField
              label="Nav Style"
              value={element.navStyle || "text"}
              options={[
                { label: "Plain Text", value: "text" },
                { label: "Pill Buttons", value: "pills" },
                { label: "Underlined", value: "underline" },
                { label: "Bold", value: "bold" },
              ]}
              onChange={(v) => onChange({ ...element, navStyle: v as "text" | "pills" | "underline" | "bold" })}
            />
            <InputField
              label="Nav Font Size"
              value={element.navFontSize || "13px"}
              onChange={(v) => onChange({ ...element, navFontSize: v })}
            />
            <ColorField
              label="Nav Color"
              value={element.navColor || element.textColor || "#374151"}
              onChange={(v) => onChange({ ...element, navColor: v })}
            />
            {(element.navLinks || []).map((link, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <input
                  value={link.label}
                  onChange={(e) => {
                    const nl = [...(element.navLinks || [])];
                    nl[i] = { ...link, label: e.target.value };
                    onChange({ ...element, navLinks: nl });
                  }}
                  className="flex-1 rounded border border-gray-300 px-2 py-1 text-xs focus:border-indigo-500 focus:outline-none"
                  placeholder="Label"
                />
                <input
                  value={link.url}
                  onChange={(e) => {
                    const nl = [...(element.navLinks || [])];
                    nl[i] = { ...link, url: e.target.value };
                    onChange({ ...element, navLinks: nl });
                  }}
                  className="flex-1 rounded border border-gray-300 px-2 py-1 text-xs focus:border-indigo-500 focus:outline-none"
                  placeholder="URL"
                />
                <button
                  onClick={() => {
                    const nl = (element.navLinks || []).filter((_, idx) => idx !== i);
                    onChange({ ...element, navLinks: nl });
                  }}
                  className="text-gray-400 hover:text-red-500 text-xs px-1"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              onClick={() => onChange({ ...element, navLinks: [...(element.navLinks || []), { label: "Link", url: "https://example.com" }] })}
              className="w-full rounded border border-dashed border-gray-300 py-1 text-[10px] text-gray-400 hover:border-indigo-400 hover:text-indigo-600"
            >
              + Add Nav Link
            </button>
          </div>

          {/* ── CTA Button ── */}
          <div className="space-y-2 border-t border-mk-border-light pt-3">
            <p className="text-[10px] font-semibold text-mk-text-muted uppercase tracking-widest">CTA Button</p>
            <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={element.showCta || false}
                onChange={(e) => onChange({ ...element, showCta: e.target.checked })}
                className="rounded border-gray-300"
              />
              Show CTA button
            </label>
            {element.showCta && (
              <>
                <InputField
                  label="Button Text"
                  value={element.ctaText || "Shop Now"}
                  onChange={(v) => onChange({ ...element, ctaText: v })}
                />
                <InputField
                  label="Button URL"
                  value={element.ctaUrl || ""}
                  onChange={(v) => onChange({ ...element, ctaUrl: v })}
                />
                <ColorField
                  label="Button Color"
                  value={element.ctaColor || "#4F46E5"}
                  onChange={(v) => onChange({ ...element, ctaColor: v })}
                />
                <ColorField
                  label="Button Text Color"
                  value={element.ctaTextColor || "#ffffff"}
                  onChange={(v) => onChange({ ...element, ctaTextColor: v })}
                />
                <InputField
                  label="Border Radius"
                  value={element.ctaBorderRadius || "6px"}
                  onChange={(v) => onChange({ ...element, ctaBorderRadius: v })}
                />
              </>
            )}
          </div>

          {/* ── Styling ── */}
          <div className="space-y-2 border-t border-mk-border-light pt-3">
            <p className="text-[10px] font-semibold text-mk-text-muted uppercase tracking-widest">Style</p>
            <InputField
              label="Preheader Text"
              value={element.preheaderText || ""}
              onChange={(v) => onChange({ ...element, preheaderText: v })}
            />
            <ColorField
              label="Background Color"
              value={element.backgroundColor || "#ffffff"}
              onChange={(v) => onChange({ ...element, backgroundColor: v })}
            />
            <ColorField
              label="Text Color"
              value={element.textColor || "#374151"}
              onChange={(v) => onChange({ ...element, textColor: v })}
            />
            <InputField
              label="Border Bottom"
              value={element.borderBottom || ""}
              onChange={(v) => onChange({ ...element, borderBottom: v })}
            />
            <InputField
              label="Padding"
              value={element.styles.padding || "16px 0"}
              onChange={(v) => updateStyles("padding", v)}
            />
          </div>
        </div>
      );
    }

    default:
      return null;
  }
}

export function PropertyPanel({
  element,
  onChange,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
}: PropertyPanelProps) {
  if (!element) {
    return (
      <div className="w-72 shrink-0 border-l border-mk-border bg-mk-surface p-6">
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-mk-primary-50">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--mk-primary)" strokeWidth="1.5">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-mk-text">No element selected</p>
          <p className="mt-1 text-xs text-mk-text-muted">
            Click an element to edit its properties
          </p>
        </div>
      </div>
    );
  }

  const typeLabels: Record<string, string> = {
    text: "Text Block",
    heading: "Heading",
    image: "Image",
    button: "Button",
    divider: "Divider",
    spacer: "Spacer",
    video: "Video",
    gif: "GIF",
    timer: "Countdown Timer",
    social: "Social Links",
    columns: "Columns Layout",
    html: "Custom HTML",
    footer: "Email Footer",
    header: "Email Header",
  };

  return (
    <div className="w-72 shrink-0 overflow-y-auto border-l border-mk-border bg-mk-surface mk-panel-slide">
      <div className="p-4">
        {/* Header */}
        <div className="mb-3 flex items-center gap-2">
          <div className="h-6 w-1 rounded-full bg-mk-primary" />
          <h3 className="text-sm font-bold text-mk-text">
            {typeLabels[element.type] || element.type}
          </h3>
        </div>

        {/* Actions */}
        <div className="mb-4 flex gap-1">
          <button
            onClick={onMoveUp}
            className="rounded-md border border-mk-border px-2 py-1 text-xs text-mk-text-secondary hover:bg-mk-primary-50 hover:text-mk-primary hover:border-mk-primary transition-all"
            title="Move up (Ctrl+↑)"
          >
            ↑
          </button>
          <button
            onClick={onMoveDown}
            className="rounded-md border border-mk-border px-2 py-1 text-xs text-mk-text-secondary hover:bg-mk-primary-50 hover:text-mk-primary hover:border-mk-primary transition-all"
            title="Move down (Ctrl+↓)"
          >
            ↓
          </button>
          <button
            onClick={onDuplicate}
            className="rounded-md border border-mk-border px-2 py-1 text-xs text-mk-text-secondary hover:bg-mk-primary-50 hover:text-mk-primary hover:border-mk-primary transition-all"
            title="Duplicate (Ctrl+D)"
          >
            Copy
          </button>
          <div className="flex-1" />
          <button
            onClick={onDelete}
            className="rounded-md border border-mk-accent/20 px-2 py-1 text-xs text-mk-accent hover:bg-mk-accent-light hover:border-mk-accent/40 transition-all"
            title="Delete (Del)"
          >
            Delete
          </button>
        </div>

        {renderProperties(element, onChange)}
      </div>
    </div>
  );
}
