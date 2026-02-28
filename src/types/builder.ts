// ── Core Email Builder Type System ──

export type ElementType =
  | "text"
  | "heading"
  | "image"
  | "button"
  | "divider"
  | "spacer"
  | "video"
  | "gif"
  | "timer"
  | "social"
  | "columns"
  | "html";

export interface ElementStyles {
  backgroundColor?: string;
  color?: string;
  fontSize?: string;
  fontFamily?: string;
  fontWeight?: string;
  textAlign?: "left" | "center" | "right";
  padding?: string;
  margin?: string;
  borderRadius?: string;
  border?: string;
  width?: string;
  maxWidth?: string;
  lineHeight?: string;
}

export interface BaseElement {
  id: string;
  type: ElementType;
  styles: ElementStyles;
}

export interface TextElement extends BaseElement {
  type: "text";
  content: string;
}

export interface HeadingElement extends BaseElement {
  type: "heading";
  content: string;
  level: 1 | 2 | 3;
}

export interface ImageElement extends BaseElement {
  type: "image";
  src: string;
  alt: string;
  link?: string;
}

export interface ButtonElement extends BaseElement {
  type: "button";
  text: string;
  link: string;
  buttonColor: string;
  textColor: string;
  borderRadius: string;
}

export interface DividerElement extends BaseElement {
  type: "divider";
  thickness: string;
  dividerColor: string;
  dividerWidth: string;
}

export interface SpacerElement extends BaseElement {
  type: "spacer";
  height: string;
}

export interface VideoElement extends BaseElement {
  type: "video";
  thumbnailSrc: string;
  videoUrl: string;
  alt: string;
}

export interface GifElement extends BaseElement {
  type: "gif";
  src: string;
  alt: string;
  link?: string;
}

export interface TimerElement extends BaseElement {
  type: "timer";
  targetDate: string;
  label: string;
  timerColor: string;
  labelColor: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface SocialElement extends BaseElement {
  type: "social";
  links: SocialLink[];
  iconSize: string;
}

export interface ColumnConfig {
  width: string;
  elements: EmailElement[];
}

export interface ColumnsElement extends BaseElement {
  type: "columns";
  columns: ColumnConfig[];
}

export interface HtmlElement extends BaseElement {
  type: "html";
  rawHtml: string;
}

export type EmailElement =
  | TextElement
  | HeadingElement
  | ImageElement
  | ButtonElement
  | DividerElement
  | SpacerElement
  | VideoElement
  | GifElement
  | TimerElement
  | SocialElement
  | ColumnsElement
  | HtmlElement;

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  preheader: string;
  bodyBackground: string;
  contentBackground: string;
  contentWidth: string;
  fontFamily: string;
  elements: EmailElement[];
}

// ── Sketch / Canvas Types ──

export interface Point {
  x: number;
  y: number;
}

export interface Stroke {
  id: string;
  points: Point[];
  color: string;
  width: number;
  tool: SketchTool;
}

export type SketchTool = "pen" | "marker" | "eraser" | "rectangle" | "line" | "text";

export interface SketchState {
  strokes: Stroke[];
  currentTool: SketchTool;
  currentColor: string;
  strokeWidth: number;
  canvasWidth: number;
  canvasHeight: number;
}

// ── Detected regions from sketch analysis ──

export interface DetectedRegion {
  type: "header" | "text" | "image" | "button" | "divider" | "spacer" | "columns" | "footer";
  bounds: { x: number; y: number; width: number; height: number };
  confidence: number;
  content?: string;
}

// ── Smart Sketch Regions ──

export interface RegionBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type RegionRole =
  | "header"
  | "content"
  | "footer"
  | "sidebar"
  | "hero"
  | "custom";

export interface SmartRegion {
  id: string;
  bounds: RegionBounds;
  role: RegionRole;
  label: string;
  elements: EmailElement[];
  subRegions: SmartRegion[];
  prompt?: string;
  backgroundColor?: string;
  borderColor?: string;
}

// ── Drag and Drop ──

export interface DragItem {
  type: ElementType;
  label: string;
  icon: string;
  defaultProps: Partial<EmailElement>;
}

export type BuilderMode = "sketch" | "builder" | "preview" | "code";
