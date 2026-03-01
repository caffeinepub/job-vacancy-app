import { cn } from "@/lib/utils";
import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type ThemeOption = "light" | "dark" | "system";

function getStoredTheme(): ThemeOption {
  try {
    const stored = localStorage.getItem("jobfinder-theme");
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
  if (theme === "dark") {
    html.classList.add("dark");
  } else if (theme === "light") {
    html.classList.remove("dark");
  } else {
    // system
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    if (prefersDark) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
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

export function ThemesPanel() {
  const [selected, setSelected] = useState<ThemeOption>(getStoredTheme);

  useEffect(() => {
    // Sync on mount
    applyTheme(selected);
  }, [selected]);

  function handleSelect(theme: ThemeOption) {
    setSelected(theme);
    try {
      localStorage.setItem("jobfinder-theme", theme);
    } catch {
      // ignore
    }
    applyTheme(theme);
  }

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-display font-bold text-foreground">
          Appearance
        </h2>
        <p className="text-sm text-muted-foreground">
          Choose how JobFinder looks for you.
        </p>
      </div>

      <div className="space-y-3">
        {THEME_OPTIONS.map(({ value, label, description, icon: Icon }) => {
          const isActive = selected === value;
          return (
            <button
              key={value}
              type="button"
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
      </div>

      <div className="p-4 rounded-xl bg-secondary/60 border border-border">
        <p className="text-xs text-muted-foreground leading-relaxed">
          <span className="font-semibold text-foreground">Tip:</span> Dark mode
          reduces eye strain during extended job searching sessions at night.
          Your preference is saved automatically.
        </p>
      </div>
    </div>
  );
}
