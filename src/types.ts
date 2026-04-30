export type WidgetFont = "sans" | "serif" | "mono" | "pixel" | "display";

export interface Widget {
  id: string;
  title: string;
  description: string;
  color: string;
  textColor: string;
  font: WidgetFont;
  backgroundImage?: string;
  bgZoom?: number;
  bgOffset?: { x: number; y: number };
  punchIcon: string;
  punchColor?: string;
  punchShape: "circle" | "square" | "rounded" | "pill" | "leaf";
  gridColumns: number;
  resetInterval: "manual" | "12h" | "24h" | "weekly" | "monthly";
  lastResetAt: number;
  totalSlots: number;
  showDayLabels?: boolean;
  punches: boolean[]; // index based on totalSlots
  createdAt: number;
  goalType: "daily" | "habit";
}

export type ThemePreset = {
  name: string;
  color: string;
  textColor: string;
  font: WidgetFont;
  backgroundImage?: string;
};

export const THEME_PRESETS: ThemePreset[] = [
  { name: "Nordic Night", color: "#2E3440", textColor: "#ECEFF4", font: "mono" },
  { name: "Sunset", color: "#FF6321", textColor: "#141414", font: "serif" },
  { name: "Matrix", color: "#000000", textColor: "#00FF00", font: "mono" },
  { name: "Minimal Soft", color: "#F5F5F0", textColor: "#141414", font: "sans" },
  { name: "Bold Brutalist", color: "#FFFFFF", textColor: "#000000", font: "display" },
];
