"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Theme } from "@/lib/types";
import { getInitialTheme, resolveTheme, STORAGE_KEY } from "./theme-helpers";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // BUG: Esto causa parpadeo porque useState se ejecuta en el cliente
  // después del render inicial
  // const [theme, setTheme] = useState<Theme>("light");
  // const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  // ✅ SENIOR: Inicializar con función para evitar recálculos
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">(() =>
    resolveTheme(getInitialTheme()),
  );

  // ✅ SENIOR: Aplicar tema al DOM de forma imperativa
  const applyTheme = useCallback((newTheme: Theme) => {
    const resolved = resolveTheme(newTheme);
    const root = document.documentElement;

    root.classList.remove("light", "dark");
    root.classList.add(resolved);
    root.style.colorScheme = resolved;

    setResolvedTheme(resolved);
  }, []);

  // ✅ SENIOR: Escuchar cambios de preferencias del sistema
  useEffect(() => {
    // 1. Referencia a la media query del SO
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    // 2. Función que se ejecuta cuando el SO cambia de tema
    const handleChange = () => {
      if (theme === "system") {
        // Solo reacciona si el usuario eligió "system"
        // Si eligió "dark" manualmente, no le importa lo que haga el SO
        applyTheme("system");
      }
    };

    // 3. Suscribirse al evento de cambio
    mediaQuery.addEventListener("change", handleChange);

    // 4. Cleanup: desuscribirse cuando el componente se desmonte o cambien las dependencias
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, applyTheme]);

  // ✅ SENIOR: Función para cambiar tema con persistencia
  const setTheme = useCallback(
    (newTheme: Theme) => {
      // 1. Actualiza el estado de React (para que los componentes se enteren)
      setThemeState(newTheme);

      // 2. Aplica el tema visualmente (clase en <html>, colorScheme)
      applyTheme(newTheme);

      // 3. Guarda la elección en localStorage (para que persista al recargar)
      try {
        localStorage.setItem(STORAGE_KEY, newTheme);
      } catch {
        // Si localStorage falla, no rompe la app — solo no persiste
        console.warn("Failed to persist theme preference");
      }
    },
    [applyTheme],
  );

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

// ============================================
// SOLUCIÓN SENIOR (Oculta por defecto)
// ============================================
export const SENIOR_THEME_SOLUTION = `
'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { Theme } from '@/lib/types';

const STORAGE_KEY = 'theme-preference';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// ✅ SENIOR: Función para obtener el tema inicial SIN causar parpadeo
function getInitialTheme(): Theme {
  // Solo ejecutar en el cliente
  if (typeof window === 'undefined') return 'system';
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && ['light', 'dark', 'system'].includes(stored)) {
      return stored as Theme;
    }
  } catch {
    // localStorage puede fallar en modo incógnito
    console.warn('Failed to read theme from localStorage');
  }
  
  return 'system';
}

// ✅ SENIOR: Resolver tema actual basado en preferencias del sistema
function resolveTheme(theme: Theme): 'light' | 'dark' {
  if (theme === 'system') {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return theme;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // ✅ SENIOR: Usar función inicializadora para evitar parpadeo
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => 
    resolveTheme(getInitialTheme())
  );

  // ✅ SENIOR: Aplicar tema al DOM
  const applyTheme = useCallback((newTheme: Theme) => {
    const root = document.documentElement;
    const resolved = resolveTheme(newTheme);
    
    root.classList.remove('light', 'dark');
    root.classList.add(resolved);
    
    // ✅ SENIOR: Actualizar meta theme-color para móviles
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', resolved === 'dark' ? '#0a0a0a' : '#ffffff');
    }
    
    setResolvedTheme(resolved);
  }, []);

  // ✅ SENIOR: Efecto para aplicar tema inicial y escuchar cambios del sistema
  useEffect(() => {
    applyTheme(theme);
    
    // ✅ SENIOR: Escuchar cambios en preferencias del sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, applyTheme]);

  // ✅ SENIOR: Función memoizada para cambiar tema con persistencia
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch {
      console.warn('Failed to save theme to localStorage');
    }
    
    applyTheme(newTheme);
  }, [applyTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
`;
