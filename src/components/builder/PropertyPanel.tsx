"use client";

import type { EmailElement } from "@/types/builder";

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
      <label className="block text-xs font-medium text-gray-500 mb-1">
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
      <label className="block text-xs font-medium text-gray-500 mb-1">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-8 rounded border border-gray-300 cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-mono focus:border-indigo-500 focus:outline-none"
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
      <label className="block text-xs font-medium text-gray-500 mb-1">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
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
    <div className="space-y-3 border-t border-gray-200 pt-3 mt-3">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
        Style
      </p>
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
      <SelectField
        label="Text Align"
        value={element.styles.textAlign || "left"}
        options={[
          { label: "Left", value: "left" },
          { label: "Center", value: "center" },
          { label: "Right", value: "right" },
        ]}
        onChange={(v) => updateStyles("textAlign", v)}
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

    case "header":
      return (
        <div className="space-y-3">
          <SelectField
            label="Header Variant"
            value={element.variant}
            options={[
              { label: "Logo + Nav", value: "logo-nav" },
              { label: "Logo Only", value: "logo-only" },
              { label: "Full", value: "full" },
              { label: "Centered", value: "centered" },
            ]}
            onChange={(v) => onChange({ ...element, variant: v as "logo-nav" | "logo-only" | "full" | "centered" })}
          />
          <InputField
            label="Logo URL"
            value={element.logoSrc}
            onChange={(v) => onChange({ ...element, logoSrc: v })}
          />
          <InputField
            label="Logo Alt Text"
            value={element.logoAlt}
            onChange={(v) => onChange({ ...element, logoAlt: v })}
          />
          <InputField
            label="Logo Width"
            value={element.logoWidth || "180px"}
            onChange={(v) => onChange({ ...element, logoWidth: v })}
          />
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
          {commonStyleFields}
        </div>
      );

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
      <div className="w-72 shrink-0 border-l border-gray-200 bg-white p-6">
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
            <span className="text-xl text-gray-400">✎</span>
          </div>
          <p className="text-sm font-medium text-gray-500">No element selected</p>
          <p className="mt-1 text-xs text-gray-400">
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
    <div className="w-72 shrink-0 overflow-y-auto border-l border-gray-200 bg-white">
      <div className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">
            {typeLabels[element.type] || element.type}
          </h3>
        </div>

        {/* Actions */}
        <div className="mb-4 flex gap-1.5">
          <button
            onClick={onMoveUp}
            className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
            title="Move up"
          >
            ↑
          </button>
          <button
            onClick={onMoveDown}
            className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
            title="Move down"
          >
            ↓
          </button>
          <button
            onClick={onDuplicate}
            className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
            title="Duplicate"
          >
            Copy
          </button>
          <div className="flex-1" />
          <button
            onClick={onDelete}
            className="rounded-lg border border-red-200 px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50"
            title="Delete"
          >
            Delete
          </button>
        </div>

        {renderProperties(element, onChange)}
      </div>
    </div>
  );
}
