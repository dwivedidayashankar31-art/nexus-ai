import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "dark" | "light" | "system";
export type Language = "en" | "hi" | "es" | "fr";
export type Density = "compact" | "comfortable";
export type AiConfidence = "fast" | "balanced" | "thorough";
export type DateFormat = "dmy" | "mdy";

export type Settings = {
  theme: Theme;
  language: Language;
  density: Density;
  dateFormat: DateFormat;
  emailNotif: boolean;
  actionAlerts: boolean;
  escalationAlerts: boolean;
  aiVoice: boolean;
  aiAutoLog: boolean;
  aiStreaming: boolean;
  aiConfidence: AiConfidence;
};

const DEFAULTS: Settings = {
  theme: "dark",
  language: "en",
  density: "comfortable",
  dateFormat: "dmy",
  emailNotif: true,
  actionAlerts: true,
  escalationAlerts: true,
  aiVoice: true,
  aiAutoLog: true,
  aiStreaming: true,
  aiConfidence: "balanced",
};

const STORAGE_KEY = "nexus-settings";

function loadSettings(): Settings {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return { ...DEFAULTS, ...JSON.parse(saved) };
  } catch {}
  return DEFAULTS;
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove("dark", "light");
  if (theme === "system") {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.classList.add(prefersDark ? "dark" : "light");
  } else {
    root.classList.add(theme);
  }
}

function applyDensity(density: Density) {
  document.documentElement.setAttribute("data-density", density);
}

type SettingsContextType = {
  settings: Settings;
  update: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  resetAll: () => void;
};

const SettingsContext = createContext<SettingsContextType>({
  settings: DEFAULTS,
  update: () => {},
  resetAll: () => {},
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(loadSettings);

  useEffect(() => {
    applyTheme(settings.theme);
    applyDensity(settings.density);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (settings.theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => applyTheme("system");
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }
  }, [settings.theme]);

  const update = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const resetAll = () => {
    setSettings(DEFAULTS);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <SettingsContext.Provider value={{ settings, update, resetAll }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
