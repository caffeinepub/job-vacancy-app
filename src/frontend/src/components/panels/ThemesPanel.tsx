import { cn } from "@/lib/utils";
import { Globe, Monitor, Moon, Pen, Sun, Type } from "lucide-react";
import { useEffect, useState } from "react";

type ThemeOption = "light" | "dark" | "system";

const THEME_STORAGE_KEY = "jf_theme";

function getStoredTheme(): ThemeOption {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
  } catch {
    // ignore
  }
  return "system";
}

function applyTheme(theme: ThemeOption) {
  const html = document.documentElement;
  // Remove any existing theme classes
  html.classList.remove("light-theme", "dark-theme");

  if (theme === "light") {
    html.classList.add("light-theme");
  } else if (theme === "dark") {
    html.classList.add("dark-theme");
  } else {
    // system — detect OS preference
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    html.classList.add(prefersDark ? "dark-theme" : "light-theme");
  }
}

export function applyStoredTheme() {
  applyTheme(getStoredTheme());
}

const THEME_OPTIONS: {
  value: ThemeOption;
  label: string;
  description: string;
  icon: React.ElementType;
}[] = [
  {
    value: "light",
    label: "Light",
    description: "Clean white interface for bright environments",
    icon: Sun,
  },
  {
    value: "dark",
    label: "Dark",
    description: "Easy on the eyes in low-light settings",
    icon: Moon,
  },
  {
    value: "system",
    label: "System",
    description: "Automatically matches your device preference",
    icon: Monitor,
  },
];

// ── Font system ──────────────────────────────────────────────────────────────

type FontOption = "handwriting" | "professional" | "system";
const FONT_STORAGE_KEY = "jf_font_style";

function getStoredFont(): FontOption {
  try {
    const stored = localStorage.getItem(FONT_STORAGE_KEY);
    if (
      stored === "handwriting" ||
      stored === "professional" ||
      stored === "system"
    ) {
      return stored;
    }
  } catch {
    // ignore
  }
  return "handwriting"; // default
}

function applyFont(font: FontOption) {
  const root = document.documentElement;
  let family: string;
  if (font === "handwriting") {
    family = "'Dancing Script', cursive";
  } else if (font === "professional") {
    family = "'Poppins', sans-serif";
  } else {
    family = "system-ui, sans-serif";
  }
  root.style.setProperty("--app-font-family", family);
}

export function applyStoredFont() {
  applyFont(getStoredFont());
}

const FONT_OPTIONS: {
  value: FontOption;
  label: string;
  description: string;
  icon: React.ElementType;
}[] = [
  {
    value: "handwriting",
    label: "Handwriting",
    description: "Dancing Script — warm, personal feel",
    icon: Pen,
  },
  {
    value: "professional",
    label: "Professional",
    description: "Poppins — clean, modern sans-serif",
    icon: Type,
  },
  {
    value: "system",
    label: "System Default",
    description: "Uses your device's default font",
    icon: Globe,
  },
];

// ─────────────────────────────────────────────────────────────────────────────

export function ThemesPanel() {
  const [selected, setSelected] = useState<ThemeOption>(getStoredTheme);
  const [selectedFont, setSelectedFont] = useState<FontOption>(getStoredFont);

  // Sync theme on mount and whenever it changes
  useEffect(() => {
    applyTheme(selected);
  }, [selected]);

  // When system is selected, listen for OS theme changes and re-apply
  useEffect(() => {
    if (selected !== "system") return;

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    function onSystemChange() {
      applyTheme("system");
    }
    mq.addEventListener("change", onSystemChange);
    return () => mq.removeEventListener("change", onSystemChange);
  }, [selected]);

  // Sync font on mount and whenever it changes
  useEffect(() => {
    applyFont(selectedFont);
  }, [selectedFont]);

  function handleSelect(theme: ThemeOption) {
    setSelected(theme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // ignore
    }
    applyTheme(theme);
  }

  function handleSelectFont(font: FontOption) {
    setSelectedFont(font);
    try {
      localStorage.setItem(FONT_STORAGE_KEY, font);
    } catch {
      // ignore
    }
    applyFont(font);
  }

  return (
    <div
      className="flex flex-col min-h-0 overflow-hidden"
      style={{ height: "100%" }}
    >
      {/* Fixed header */}
      <div className="flex-shrink-0 px-6 pt-6 pb-4 border-b border-border">
        <h2 className="text-xl font-display font-bold text-foreground">
          Appearance
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Choose how JobFinder looks for you.
        </p>
      </div>

      {/* Scrollable content */}
      <div
        className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div className="px-6 py-4 space-y-3">
          {/* Theme Options */}
          {THEME_OPTIONS.map(({ value, label, description, icon: Icon }) => {
            const isActive = selected === value;
            return (
              <button
                key={value}
                type="button"
                data-ocid={`theme.${value}.button`}
                onClick={() => handleSelect(value)}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200",
                  isActive
                    ? "border-primary bg-primary/8 shadow-sm"
                    : "border-border bg-card hover:border-primary/40 hover:bg-secondary/60",
                )}
                aria-pressed={isActive}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground",
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className={cn(
                      "font-semibold text-sm",
                      isActive ? "text-primary" : "text-foreground",
                    )}
                  >
                    {label}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {description}
                  </div>
                </div>
                {isActive && (
                  <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                  </div>
                )}
              </button>
            );
          })}

          {/* Divider */}
          <div className="border-t border-border pt-2" />

          {/* Font Style Section header */}
          <div className="space-y-1 pb-1">
            <h3 className="text-base font-semibold text-foreground">
              Font Style
            </h3>
            <p className="text-sm text-muted-foreground">
              Choose your preferred text style.
            </p>
          </div>

          {/* Font Options */}
          {FONT_OPTIONS.map(({ value, label, description, icon: Icon }) => {
            const isActive = selectedFont === value;
            return (
              <button
                key={value}
                type="button"
                data-ocid={`font.${value}.button`}
                onClick={() => handleSelectFont(value)}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200",
                  isActive
                    ? "border-primary bg-primary/8 shadow-sm"
                    : "border-border bg-card hover:border-primary/40 hover:bg-secondary/60",
                )}
                aria-pressed={isActive}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground",
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className={cn(
                      "font-semibold text-sm",
                      isActive ? "text-primary" : "text-foreground",
                    )}
                  >
                    {label}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {description}
                  </div>
                </div>
                {isActive && (
                  <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                  </div>
                )}
              </button>
            );
          })}

          <div className="p-4 rounded-xl bg-secondary/60 border border-border">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground">Tip:</span> Dark
              mode reduces eye strain during extended job searching sessions at
              night. Your preferences are saved automatically.
            </p>
          </div>

          {/* Bottom padding so last item clears any bottom UI */}
          <div className="pb-4" />
        </div>
      </div>
    </div>
  );
}
