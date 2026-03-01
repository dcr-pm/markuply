"use client";

import { useState } from "react";
import type { EmailElement, EmailTemplate, HeaderElement } from "@/types/builder";

interface PropertyPanelProps {
  element: EmailElement | null;
  template: EmailTemplate;
  onChange: (el: EmailElement) => void;
  onTemplateChange: (t: EmailTemplate) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

/* ── Email-safe fonts ── */
const EMAIL_FONTS = [
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Helvetica", value: "Helvetica, Arial, sans-serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Times New Roman", value: "'Times New Roman', Times, serif" },
  { label: "Courier New", value: "'Courier New', monospace" },
  { label: "Verdana", value: "Verdana, Geneva, sans-serif" },
  { label: "Tahoma", value: "Tahoma, Geneva, sans-serif" },
  { label: "Trebuchet MS", value: "'Trebuchet MS', sans-serif" },
  { label: "Lucida Sans", value: "'Lucida Sans Unicode', sans-serif" },
  { label: "Palatino", value: "'Palatino Linotype', serif" },
];

/* ── AI Style Presets ── */
const TEXT_PRESETS = [
  { label: "Professional", styles: { fontFamily: "Arial, sans-serif", fontSize: "15px", color: "#1e293b", lineHeight: "1.7", fontWeight: "normal" } },
  { label: "Bold & Punchy", styles: { fontFamily: "Arial, sans-serif", fontSize: "18px", color: "#0f172a", lineHeight: "1.5", fontWeight: "bold" } },
  { label: "Elegant", styles: { fontFamily: "Georgia, serif", fontSize: "16px", color: "#374151", lineHeight: "1.8", fontWeight: "normal" } },
  { label: "Minimal", styles: { fontFamily: "Helvetica, Arial, sans-serif", fontSize: "14px", color: "#64748b", lineHeight: "1.6", fontWeight: "300" } },
];

const BUTTON_PRESETS = [
  { label: "Primary", buttonColor: "#7c3aed", textColor: "#ffffff", borderRadius: "8px" },
  { label: "Pill", buttonColor: "#4F46E5", textColor: "#ffffff", borderRadius: "50px" },
  { label: "Square", buttonColor: "#0f172a", textColor: "#ffffff", borderRadius: "0px" },
  { label: "Ghost", buttonColor: "transparent", textColor: "#7c3aed", borderRadius: "8px" },
  { label: "Success", buttonColor: "#10b981", textColor: "#ffffff", borderRadius: "8px" },
  { label: "Danger", buttonColor: "#ef4444", textColor: "#ffffff", borderRadius: "8px" },
];

/* ── Shared UI Components ── */
function Section({ title, defaultOpen = true, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-4 py-2.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider hover:bg-slate-50"
      >
        {title}
        <svg className={`h-3 w-3 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && <div className="px-4 pb-3 space-y-2.5 animate-fadeIn">{children}</div>}
    </div>
  );
}

function InputField({ label, value, onChange, type = "text", placeholder }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-[11px] font-medium text-slate-500 mb-1">{label}</label>
      {type === "textarea" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-violet-400 resize-y"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-violet-400"
        />
      )}
    </div>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-[11px] font-medium text-slate-500 mb-1">{label}</label>
      <div className="flex items-center gap-2">
        <div className="relative">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
          <div
            className="h-7 w-7 rounded-lg border border-slate-200 shadow-inner cursor-pointer"
            style={{ backgroundColor: value }}
          />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-mono text-slate-600 focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-violet-400"
        />
      </div>
    </div>
  );
}

function SelectField({ label, value, options, onChange }: {
  label: string; value: string; options: { label: string; value: string }[]; onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-[11px] font-medium text-slate-500 mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-violet-400"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

function SliderField({ label, value, onChange, min, max, step = 1, unit = "px" }: {
  label: string; value: number; onChange: (v: number) => void; min: number; max: number; step?: number; unit?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-[11px] font-medium text-slate-500">{label}</label>
        <span className="text-[10px] font-mono text-slate-400">{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
    </div>
  );
}

function AlignButtons({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const options = [
    { val: "left", icon: <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth={2} d="M3 6h18M3 12h12M3 18h16" /></svg> },
    { val: "center", icon: <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth={2} d="M3 6h18M6 12h12M4 18h16" /></svg> },
    { val: "right", icon: <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth={2} d="M3 6h18M9 12h12M5 18h16" /></svg> },
  ];
  return (
    <div>
      <label className="block text-[11px] font-medium text-slate-500 mb-1">Alignment</label>
      <div className="flex rounded-lg border border-slate-200 p-0.5">
        {options.map((o) => (
          <button
            key={o.val}
            onClick={() => onChange(o.val)}
            className={`flex-1 flex items-center justify-center py-1.5 rounded-md text-xs transition-colors ${
              value === o.val ? "bg-violet-100 text-violet-700" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
            }`}
          >
            {o.icon}
          </button>
        ))}
      </div>
    </div>
  );
}

function FontField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-[11px] font-medium text-slate-500 mb-1">Font Family</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 focus:border-violet-400 focus:bg-white focus:outline-none"
        style={{ fontFamily: value }}
      >
        {EMAIL_FONTS.map((f) => (
          <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>{f.label}</option>
        ))}
      </select>
    </div>
  );
}

function CheckField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer py-0.5">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="rounded border-slate-300 text-violet-600 focus:ring-violet-500 h-3.5 w-3.5"
      />
      {label}
    </label>
  );
}

/* ── Style Presets Component ── */
function StylePresets({ presets, onApply }: { presets: { label: string; [k: string]: unknown }[]; onApply: (p: Record<string, unknown>) => void }) {
  return (
    <div>
      <label className="block text-[11px] font-medium text-slate-500 mb-1.5">
        <span className="inline-flex items-center gap-1">
          <span className="flex h-3.5 w-3.5 items-center justify-center rounded bg-violet-600 text-[7px] text-white font-bold">AI</span>
          Quick Styles
        </span>
      </label>
      <div className="flex flex-wrap gap-1">
        {presets.map((p) => (
          <button
            key={p.label as string}
            onClick={() => onApply(p)}
            className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-600 hover:bg-violet-100 hover:text-violet-700 transition-colors"
          >
            {p.label as string}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Common style editing section ── */
function CommonStyles({
  element,
  onChange,
}: {
  element: EmailElement;
  onChange: (el: EmailElement) => void;
}) {
  const updateStyles = (key: string, value: string) => {
    onChange({ ...element, styles: { ...element.styles, [key]: value } });
  };

  return (
    <Section title="Spacing & Background" defaultOpen={false}>
      <ColorField
        label="Background Color"
        value={element.styles.backgroundColor || "#ffffff"}
        onChange={(v) => updateStyles("backgroundColor", v)}
      />
      <InputField
        label="Padding"
        value={element.styles.padding || "10px 0"}
        onChange={(v) => updateStyles("padding", v)}
        placeholder="e.g. 10px 20px"
      />
      <InputField
        label="Margin"
        value={element.styles.margin || "0"}
        onChange={(v) => updateStyles("margin", v)}
        placeholder="e.g. 0 auto"
      />
      <InputField
        label="Border"
        value={element.styles.border || ""}
        onChange={(v) => updateStyles("border", v)}
        placeholder="e.g. 1px solid #e5e7eb"
      />
      <InputField
        label="Border Radius"
        value={element.styles.borderRadius || "0"}
        onChange={(v) => updateStyles("borderRadius", v)}
        placeholder="e.g. 8px"
      />
      <InputField
        label="Width"
        value={element.styles.width || ""}
        onChange={(v) => updateStyles("width", v)}
        placeholder="e.g. 100% or 400px"
      />
      <InputField
        label="Max Width"
        value={element.styles.maxWidth || ""}
        onChange={(v) => updateStyles("maxWidth", v)}
        placeholder="e.g. 600px"
      />
    </Section>
  );
}

/* ── Property renderers per element type ── */
function renderProperties(element: EmailElement, onChange: (el: EmailElement) => void) {
  const updateStyles = (key: string, value: string) => {
    onChange({ ...element, styles: { ...element.styles, [key]: value } });
  };

  switch (element.type) {
    case "text":
      return (
        <>
          <Section title="Content">
            <InputField label="Text Content" value={element.content} onChange={(v) => onChange({ ...element, content: v })} type="textarea" />
            <StylePresets
              presets={TEXT_PRESETS}
              onApply={(p) => {
                const s = p.styles as Record<string, string>;
                onChange({ ...element, styles: { ...element.styles, ...s } });
              }}
            />
          </Section>
          <Section title="Typography">
            <FontField value={element.styles.fontFamily || "Arial, sans-serif"} onChange={(v) => updateStyles("fontFamily", v)} />
            <SliderField label="Font Size" value={parseInt(element.styles.fontSize || "16")} onChange={(v) => updateStyles("fontSize", `${v}px`)} min={10} max={48} />
            <SelectField label="Font Weight" value={element.styles.fontWeight || "normal"} options={[
              { label: "Light (300)", value: "300" }, { label: "Normal", value: "normal" }, { label: "Medium (500)", value: "500" }, { label: "Semi Bold (600)", value: "600" }, { label: "Bold", value: "bold" },
            ]} onChange={(v) => updateStyles("fontWeight", v)} />
            <ColorField label="Text Color" value={element.styles.color || "#333333"} onChange={(v) => updateStyles("color", v)} />
            <SliderField label="Line Height" value={parseFloat(element.styles.lineHeight || "1.6") * 10} onChange={(v) => updateStyles("lineHeight", String(v / 10))} min={10} max={30} step={1} unit="" />
            <AlignButtons value={element.styles.textAlign || "left"} onChange={(v) => updateStyles("textAlign", v)} />
          </Section>
          <CommonStyles element={element} onChange={onChange} />
        </>
      );

    case "heading":
      return (
        <>
          <Section title="Content">
            <InputField label="Heading Text" value={element.content} onChange={(v) => onChange({ ...element, content: v })} />
            <SelectField label="Level" value={String(element.level)} options={[
              { label: "H1 — Large", value: "1" }, { label: "H2 — Medium", value: "2" }, { label: "H3 — Small", value: "3" },
            ]} onChange={(v) => onChange({ ...element, level: parseInt(v) as 1 | 2 | 3 })} />
          </Section>
          <Section title="Typography">
            <FontField value={element.styles.fontFamily || "Arial, sans-serif"} onChange={(v) => updateStyles("fontFamily", v)} />
            <SliderField label="Font Size" value={parseInt(element.styles.fontSize || "32")} onChange={(v) => updateStyles("fontSize", `${v}px`)} min={14} max={72} />
            <SelectField label="Font Weight" value={element.styles.fontWeight || "bold"} options={[
              { label: "Normal", value: "normal" }, { label: "Medium (500)", value: "500" }, { label: "Semi Bold (600)", value: "600" }, { label: "Bold", value: "bold" }, { label: "Extra Bold (800)", value: "800" },
            ]} onChange={(v) => updateStyles("fontWeight", v)} />
            <ColorField label="Text Color" value={element.styles.color || "#111111"} onChange={(v) => updateStyles("color", v)} />
            <AlignButtons value={element.styles.textAlign || "left"} onChange={(v) => updateStyles("textAlign", v)} />
          </Section>
          <CommonStyles element={element} onChange={onChange} />
        </>
      );

    case "image":
      return (
        <>
          <Section title="Image">
            <InputField label="Image URL" value={element.src} onChange={(v) => onChange({ ...element, src: v })} placeholder="https://..." />
            <InputField label="Alt Text" value={element.alt} onChange={(v) => onChange({ ...element, alt: v })} placeholder="Describe the image" />
            <InputField label="Link URL" value={element.link || ""} onChange={(v) => onChange({ ...element, link: v })} placeholder="Optional link" />
          </Section>
          <Section title="Size & Shape">
            <InputField label="Width" value={element.styles.width || "100%"} onChange={(v) => updateStyles("width", v)} />
            <InputField label="Max Width" value={element.styles.maxWidth || "100%"} onChange={(v) => updateStyles("maxWidth", v)} />
            <SliderField label="Border Radius" value={parseInt(element.styles.borderRadius || "0")} onChange={(v) => updateStyles("borderRadius", `${v}px`)} min={0} max={50} />
            <AlignButtons value={element.styles.textAlign || "left"} onChange={(v) => updateStyles("textAlign", v)} />
          </Section>
          <CommonStyles element={element} onChange={onChange} />
        </>
      );

    case "button":
      return (
        <>
          <Section title="Button">
            <InputField label="Button Text" value={element.text} onChange={(v) => onChange({ ...element, text: v })} />
            <InputField label="Link URL" value={element.link} onChange={(v) => onChange({ ...element, link: v })} placeholder="https://..." />
            <StylePresets
              presets={BUTTON_PRESETS}
              onApply={(p) => onChange({
                ...element,
                buttonColor: (p.buttonColor as string) || element.buttonColor,
                textColor: (p.textColor as string) || element.textColor,
                borderRadius: (p.borderRadius as string) || element.borderRadius,
              })}
            />
          </Section>
          <Section title="Style">
            <ColorField label="Button Color" value={element.buttonColor || "#4F46E5"} onChange={(v) => onChange({ ...element, buttonColor: v })} />
            <ColorField label="Text Color" value={element.textColor || "#ffffff"} onChange={(v) => onChange({ ...element, textColor: v })} />
            <SliderField label="Border Radius" value={parseInt(element.borderRadius || "6")} onChange={(v) => onChange({ ...element, borderRadius: `${v}px` })} min={0} max={50} />
            <SliderField label="Font Size" value={parseInt(element.styles.fontSize || "16")} onChange={(v) => updateStyles("fontSize", `${v}px`)} min={12} max={24} />
            <FontField value={element.styles.fontFamily || "Arial, sans-serif"} onChange={(v) => updateStyles("fontFamily", v)} />
            <AlignButtons value={element.styles.textAlign || "center"} onChange={(v) => updateStyles("textAlign", v)} />
          </Section>
          <CommonStyles element={element} onChange={onChange} />
        </>
      );

    case "divider":
      return (
        <>
          <Section title="Divider">
            <SliderField label="Thickness" value={parseInt(element.thickness || "1")} onChange={(v) => onChange({ ...element, thickness: `${v}px` })} min={1} max={10} />
            <ColorField label="Color" value={element.dividerColor || "#e5e7eb"} onChange={(v) => onChange({ ...element, dividerColor: v })} />
            <InputField label="Width" value={element.dividerWidth || "100%"} onChange={(v) => onChange({ ...element, dividerWidth: v })} />
          </Section>
          <CommonStyles element={element} onChange={onChange} />
        </>
      );

    case "spacer":
      return (
        <>
          <Section title="Spacer">
            <SliderField label="Height" value={parseInt(element.height || "30")} onChange={(v) => onChange({ ...element, height: `${v}px` })} min={5} max={120} />
          </Section>
          <CommonStyles element={element} onChange={onChange} />
        </>
      );

    case "video":
      return (
        <>
          <Section title="Video">
            <InputField label="Video URL" value={element.videoUrl} onChange={(v) => onChange({ ...element, videoUrl: v })} />
            <InputField label="Thumbnail URL" value={element.thumbnailSrc} onChange={(v) => onChange({ ...element, thumbnailSrc: v })} />
            <InputField label="Alt Text" value={element.alt} onChange={(v) => onChange({ ...element, alt: v })} />
          </Section>
          <Section title="Style">
            <SliderField label="Border Radius" value={parseInt(element.styles.borderRadius || "0")} onChange={(v) => updateStyles("borderRadius", `${v}px`)} min={0} max={30} />
            <InputField label="Width" value={element.styles.width || "100%"} onChange={(v) => updateStyles("width", v)} />
          </Section>
          <CommonStyles element={element} onChange={onChange} />
        </>
      );

    case "gif":
      return (
        <>
          <Section title="GIF">
            <InputField label="GIF URL" value={element.src} onChange={(v) => onChange({ ...element, src: v })} />
            <InputField label="Alt Text" value={element.alt} onChange={(v) => onChange({ ...element, alt: v })} />
            <InputField label="Link URL" value={element.link || ""} onChange={(v) => onChange({ ...element, link: v })} />
          </Section>
          <Section title="Style">
            <SliderField label="Border Radius" value={parseInt(element.styles.borderRadius || "0")} onChange={(v) => updateStyles("borderRadius", `${v}px`)} min={0} max={30} />
            <InputField label="Width" value={element.styles.width || "100%"} onChange={(v) => updateStyles("width", v)} />
          </Section>
          <CommonStyles element={element} onChange={onChange} />
        </>
      );

    case "timer":
      return (
        <>
          <Section title="Countdown">
            <InputField label="Label" value={element.label} onChange={(v) => onChange({ ...element, label: v })} />
            <InputField label="Target Date" value={element.targetDate.slice(0, 16)} onChange={(v) => onChange({ ...element, targetDate: new Date(v).toISOString() })} type="datetime-local" />
          </Section>
          <Section title="Colors">
            <ColorField label="Timer Color" value={element.timerColor || "#4F46E5"} onChange={(v) => onChange({ ...element, timerColor: v })} />
            <ColorField label="Label Color" value={element.labelColor || "#666666"} onChange={(v) => onChange({ ...element, labelColor: v })} />
          </Section>
          <CommonStyles element={element} onChange={onChange} />
        </>
      );

    case "social":
      return (
        <>
          <Section title="Social Links">
            <SliderField label="Icon Size" value={parseInt(element.iconSize || "32")} onChange={(v) => onChange({ ...element, iconSize: `${v}px` })} min={16} max={64} />
            <AlignButtons value={element.styles.textAlign || "center"} onChange={(v) => updateStyles("textAlign", v)} />
          </Section>
          <Section title="Links">
            {element.links.map((link, i) => (
              <div key={i} className="rounded-lg border border-slate-200 p-2 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-slate-500">{link.platform}</span>
                  <button
                    onClick={() => onChange({ ...element, links: element.links.filter((_, idx) => idx !== i) })}
                    className="text-slate-400 hover:text-red-500 text-[10px]"
                  >×</button>
                </div>
                <InputField
                  label="URL"
                  value={link.url}
                  onChange={(v) => {
                    const newLinks = [...element.links];
                    newLinks[i] = { ...link, url: v };
                    onChange({ ...element, links: newLinks });
                  }}
                />
              </div>
            ))}
          </Section>
          <CommonStyles element={element} onChange={onChange} />
        </>
      );

    case "columns":
      return (
        <>
          <Section title="Layout">
            <SelectField label="Number of Columns" value={String(element.columns.length)} options={[
              { label: "2 Columns", value: "2" }, { label: "3 Columns", value: "3" }, { label: "4 Columns", value: "4" },
            ]} onChange={(v) => {
              const count = parseInt(v);
              const width = `${Math.floor(100 / count)}%`;
              const cols = Array.from({ length: count }, (_, i) => element.columns[i] || { width, elements: [] });
              onChange({ ...element, columns: cols });
            }} />
            {element.columns.map((col, i) => (
              <InputField
                key={i}
                label={`Column ${i + 1} Width`}
                value={col.width}
                onChange={(v) => {
                  const newCols = [...element.columns];
                  newCols[i] = { ...col, width: v };
                  onChange({ ...element, columns: newCols });
                }}
              />
            ))}
          </Section>
          <CommonStyles element={element} onChange={onChange} />
        </>
      );

    case "html":
      return (
        <>
          <Section title="Custom HTML">
            <InputField label="HTML Code" value={element.rawHtml} onChange={(v) => onChange({ ...element, rawHtml: v })} type="textarea" />
          </Section>
          <CommonStyles element={element} onChange={onChange} />
        </>
      );

    case "footer":
      return (
        <>
          <Section title="Footer Settings">
            <SelectField label="Footer Variant" value={element.variant} options={[
              { label: "Marketing", value: "marketing" }, { label: "Transactional", value: "transactional" },
              { label: "Minimal", value: "minimal" }, { label: "Full", value: "full" },
            ]} onChange={(v) => onChange({ ...element, variant: v as "marketing" | "transactional" | "minimal" | "full" })} />
            <InputField label="Company Name" value={element.companyName} onChange={(v) => onChange({ ...element, companyName: v })} />
            <InputField label="Company Address" value={element.companyAddress} onChange={(v) => onChange({ ...element, companyAddress: v })} />
          </Section>
          <Section title="Links" defaultOpen={false}>
            <InputField label="Unsubscribe URL" value={element.unsubscribeUrl} onChange={(v) => onChange({ ...element, unsubscribeUrl: v })} />
            <InputField label="Preferences URL" value={element.preferencesUrl} onChange={(v) => onChange({ ...element, preferencesUrl: v })} />
            <InputField label="Privacy Policy URL" value={element.privacyUrl} onChange={(v) => onChange({ ...element, privacyUrl: v })} />
            <InputField label="Terms URL" value={element.termsUrl} onChange={(v) => onChange({ ...element, termsUrl: v })} />
          </Section>
          <Section title="Colors" defaultOpen={false}>
            <ColorField label="Text Color" value={element.textColor || "#9ca3af"} onChange={(v) => onChange({ ...element, textColor: v })} />
            <ColorField label="Divider Color" value={element.dividerColor || "#e5e7eb"} onChange={(v) => onChange({ ...element, dividerColor: v })} />
          </Section>
          <CommonStyles element={element} onChange={onChange} />
        </>
      );

    case "header":
      return (
        <>
          <Section title="Preset">
            <SelectField label="Header Style" value={element.variant} options={[
              { label: "Logo + Nav", value: "logo-nav" }, { label: "Logo Only", value: "logo-only" },
              { label: "Centered", value: "centered" }, { label: "Full", value: "full" },
              { label: "Minimal", value: "minimal" }, { label: "Bold", value: "bold" },
              { label: "E-commerce", value: "ecommerce" },
            ]} onChange={(v) => onChange({ ...element, variant: v as HeaderElement["variant"] })} />
          </Section>

          <Section title="Announcement Bar" defaultOpen={false}>
            <CheckField label="Show announcement bar" checked={element.showAnnouncement || false} onChange={(v) => onChange({ ...element, showAnnouncement: v })} />
            {element.showAnnouncement && (
              <>
                <InputField label="Text" value={element.announcementText || ""} onChange={(v) => onChange({ ...element, announcementText: v })} />
                <ColorField label="Background" value={element.announcementBg || "#4F46E5"} onChange={(v) => onChange({ ...element, announcementBg: v })} />
                <ColorField label="Text Color" value={element.announcementTextColor || "#ffffff"} onChange={(v) => onChange({ ...element, announcementTextColor: v })} />
              </>
            )}
          </Section>

          <Section title="Logo">
            <InputField label="Logo URL" value={element.logoSrc} onChange={(v) => onChange({ ...element, logoSrc: v })} />
            <InputField label="Alt Text" value={element.logoAlt} onChange={(v) => onChange({ ...element, logoAlt: v })} />
            <InputField label="Width" value={element.logoWidth || "180px"} onChange={(v) => onChange({ ...element, logoWidth: v })} />
            <SelectField label="Position" value={element.logoPosition || "left"} options={[
              { label: "Left", value: "left" }, { label: "Center", value: "center" }, { label: "Right", value: "right" },
            ]} onChange={(v) => onChange({ ...element, logoPosition: v as "left" | "center" | "right" })} />
          </Section>

          <Section title="Tagline" defaultOpen={false}>
            <InputField label="Tagline" value={element.tagline || ""} onChange={(v) => onChange({ ...element, tagline: v })} />
            {element.tagline && (
              <>
                <ColorField label="Color" value={element.taglineColor || "#6b7280"} onChange={(v) => onChange({ ...element, taglineColor: v })} />
                <InputField label="Font Size" value={element.taglineFontSize || "12px"} onChange={(v) => onChange({ ...element, taglineFontSize: v })} />
              </>
            )}
          </Section>

          <Section title="Navigation" defaultOpen={false}>
            <SelectField label="Position" value={element.navPosition || "right"} options={[
              { label: "Right", value: "right" }, { label: "Left", value: "left" },
              { label: "Center", value: "center" }, { label: "Below Logo", value: "below" },
            ]} onChange={(v) => onChange({ ...element, navPosition: v as "left" | "center" | "right" | "below" })} />
            <SelectField label="Style" value={element.navStyle || "text"} options={[
              { label: "Plain Text", value: "text" }, { label: "Pill Buttons", value: "pills" },
              { label: "Underlined", value: "underline" }, { label: "Bold", value: "bold" },
            ]} onChange={(v) => onChange({ ...element, navStyle: v as "text" | "pills" | "underline" | "bold" })} />
            <InputField label="Font Size" value={element.navFontSize || "13px"} onChange={(v) => onChange({ ...element, navFontSize: v })} />
            <ColorField label="Nav Color" value={element.navColor || element.textColor || "#374151"} onChange={(v) => onChange({ ...element, navColor: v })} />
            {(element.navLinks || []).map((link, i) => (
              <div key={i} className="flex items-center gap-1">
                <input value={link.label} onChange={(e) => {
                  const nl = [...(element.navLinks || [])]; nl[i] = { ...link, label: e.target.value }; onChange({ ...element, navLinks: nl });
                }} className="flex-1 rounded border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] focus:border-violet-400 focus:outline-none" placeholder="Label" />
                <input value={link.url} onChange={(e) => {
                  const nl = [...(element.navLinks || [])]; nl[i] = { ...link, url: e.target.value }; onChange({ ...element, navLinks: nl });
                }} className="flex-1 rounded border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] focus:border-violet-400 focus:outline-none" placeholder="URL" />
                <button onClick={() => onChange({ ...element, navLinks: (element.navLinks || []).filter((_, idx) => idx !== i) })} className="text-slate-400 hover:text-red-500 text-xs px-1">×</button>
              </div>
            ))}
            <button onClick={() => onChange({ ...element, navLinks: [...(element.navLinks || []), { label: "Link", url: "https://example.com" }] })} className="w-full rounded border border-dashed border-slate-300 py-1 text-[10px] text-slate-400 hover:border-violet-400 hover:text-violet-600">+ Add Link</button>
          </Section>

          <Section title="CTA Button" defaultOpen={false}>
            <CheckField label="Show CTA button" checked={element.showCta || false} onChange={(v) => onChange({ ...element, showCta: v })} />
            {element.showCta && (
              <>
                <InputField label="Text" value={element.ctaText || "Shop Now"} onChange={(v) => onChange({ ...element, ctaText: v })} />
                <InputField label="URL" value={element.ctaUrl || ""} onChange={(v) => onChange({ ...element, ctaUrl: v })} />
                <ColorField label="Color" value={element.ctaColor || "#4F46E5"} onChange={(v) => onChange({ ...element, ctaColor: v })} />
                <ColorField label="Text Color" value={element.ctaTextColor || "#ffffff"} onChange={(v) => onChange({ ...element, ctaTextColor: v })} />
                <SliderField label="Radius" value={parseInt(element.ctaBorderRadius || "6")} onChange={(v) => onChange({ ...element, ctaBorderRadius: `${v}px` })} min={0} max={30} />
              </>
            )}
          </Section>

          <Section title="Style" defaultOpen={false}>
            <InputField label="Preheader" value={element.preheaderText || ""} onChange={(v) => onChange({ ...element, preheaderText: v })} />
            <ColorField label="Background" value={element.backgroundColor || "#ffffff"} onChange={(v) => onChange({ ...element, backgroundColor: v })} />
            <ColorField label="Text Color" value={element.textColor || "#374151"} onChange={(v) => onChange({ ...element, textColor: v })} />
            <InputField label="Border Bottom" value={element.borderBottom || ""} onChange={(v) => onChange({ ...element, borderBottom: v })} placeholder="e.g. 2px solid #e5e7eb" />
            <InputField label="Padding" value={element.styles.padding || "16px 0"} onChange={(v) => updateStyles("padding", v)} />
          </Section>
        </>
      );

    default:
      return null;
  }
}

/* ── Template Settings Panel ── */
function TemplateSettings({ template, onChange }: { template: EmailTemplate; onChange: (t: EmailTemplate) => void }) {
  return (
    <>
      <Section title="Email Settings">
        <InputField label="Template Name" value={template.name} onChange={(v) => onChange({ ...template, name: v })} />
        <InputField label="Subject Line" value={template.subject} onChange={(v) => onChange({ ...template, subject: v })} />
        <InputField label="Preheader Text" value={template.preheader} onChange={(v) => onChange({ ...template, preheader: v })} placeholder="Preview text shown in inbox" />
      </Section>
      <Section title="Global Style">
        <ColorField label="Body Background" value={template.bodyBackground} onChange={(v) => onChange({ ...template, bodyBackground: v })} />
        <ColorField label="Content Background" value={template.contentBackground} onChange={(v) => onChange({ ...template, contentBackground: v })} />
        <InputField label="Content Width" value={template.contentWidth} onChange={(v) => onChange({ ...template, contentWidth: v })} />
        <SelectField label="Base Font" value={template.fontFamily} options={EMAIL_FONTS} onChange={(v) => onChange({ ...template, fontFamily: v })} />
      </Section>
    </>
  );
}

/* ── Main PropertyPanel ── */
export function PropertyPanel({
  element,
  template,
  onChange,
  onTemplateChange,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
}: PropertyPanelProps) {
  const typeLabels: Record<string, string> = {
    text: "Text Block", heading: "Heading", image: "Image", button: "Button",
    divider: "Divider", spacer: "Spacer", video: "Video", gif: "GIF",
    timer: "Countdown Timer", social: "Social Links", columns: "Columns Layout",
    html: "Custom HTML", footer: "Email Footer", header: "Email Header",
  };

  if (!element) {
    return (
      <div className="w-[300px] shrink-0 border-l border-slate-200/80 bg-white overflow-y-auto">
        <div className="p-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-800">Template Settings</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Select an element to edit its properties</p>
        </div>
        <TemplateSettings template={template} onChange={onTemplateChange} />
      </div>
    );
  }

  return (
    <div className="w-[300px] shrink-0 border-l border-slate-200/80 bg-white overflow-y-auto animate-slideInRight">
      {/* Header */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-violet-100 text-xs text-violet-700 font-semibold">
              {element.type.charAt(0).toUpperCase()}
            </span>
            <h3 className="text-sm font-semibold text-slate-800">
              {typeLabels[element.type] || element.type}
            </h3>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="px-4 py-2 border-b border-slate-100 flex gap-1">
        <button onClick={onMoveUp} className="flex-1 flex items-center justify-center gap-1 rounded-md border border-slate-200 py-1.5 text-[10px] font-medium text-slate-600 hover:bg-slate-50" title="Move up">
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
          Up
        </button>
        <button onClick={onMoveDown} className="flex-1 flex items-center justify-center gap-1 rounded-md border border-slate-200 py-1.5 text-[10px] font-medium text-slate-600 hover:bg-slate-50" title="Move down">
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          Down
        </button>
        <button onClick={onDuplicate} className="flex-1 flex items-center justify-center gap-1 rounded-md border border-slate-200 py-1.5 text-[10px] font-medium text-slate-600 hover:bg-violet-50 hover:text-violet-600 hover:border-violet-200" title="Duplicate">
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
          Copy
        </button>
        <button onClick={onDelete} className="flex items-center justify-center gap-1 rounded-md border border-red-200 px-3 py-1.5 text-[10px] font-medium text-red-500 hover:bg-red-50" title="Delete">
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>
      </div>

      {/* Properties */}
      {renderProperties(element, onChange)}
    </div>
  );
}
