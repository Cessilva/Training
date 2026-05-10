// ✅ SENIOR: Lectura sincrónica del tema para evitar parpadeo

import { Theme } from "@/lib/types";

export const STORAGE_KEY = "theme-preference";

export function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "system";

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && ["light", "dark", "system"].includes(stored)) {
      return stored as Theme;
    }
  } catch {
    // El catch solo atrapa cuando localStorage en sí mismo falla, que pasa en:
    // Modo incógnito en algunos navegadores antiguos
    // Cuando el usuario tiene storage deshabilitado
    // Cuando se excede la cuota de almacenamiento
  }

  return "system";
}

export function resolveTheme(theme: Theme): "light" | "dark" {
  if (theme === "system") {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return theme;
}
