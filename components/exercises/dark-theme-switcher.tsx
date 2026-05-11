"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExerciseTabs } from "@/components/exercise-tabs";
import { HintCard } from "@/components/hint-card";
import { CodeBlock } from "@/components/code-block";
import { Moon, Sun, Monitor, AlertCircle, Palette } from "lucide-react";
import type { ExerciseTab, Theme } from "@/lib/types";
import { useTheme } from "@/contexts/theme-context";

function ThemeSwitcherDemo() {
  //  Modo de uso del theme
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  return (
    <div className="space-y-6">
      {/* Controles de tema */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Selector de Tema</CardTitle>
          <CardDescription>
            Implementa los 3 modos: Light, Dark y System
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              variant={theme === "light" ? "default" : "outline"}
              onClick={() => handleThemeChange("light")}
              className="flex items-center gap-2"
            >
              <Sun className="w-4 h-4" />
              Light
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              onClick={() => handleThemeChange("dark")}
              className="flex items-center gap-2"
            >
              <Moon className="w-4 h-4" />
              Dark
            </Button>
            <Button
              variant={theme === "system" ? "default" : "outline"}
              onClick={() => handleThemeChange("system")}
              className="flex items-center gap-2"
            >
              <Monitor className="w-4 h-4" />
              System
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alerta de bugs */}
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Bugs a arreglar:</strong>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>El tema no persiste al recargar la página</li>
            <li>Hay parpadeo (FOUC) al cargar</li>
            <li>
              El modo &quot;System&quot; no detecta las preferencias del OS
            </li>
            <li>
              No escucha cambios de preferencias del sistema en tiempo real
            </li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
}

// Hints para este ejercicio
function ThemeHints() {
  return (
    <div className="space-y-4">
      <HintCard
        title="El ThemeProvider va en el layout, no en page"
        concept="Context API + Layout Architecture"
        description="El provider debe vivir en layout.tsx para que persista entre navegaciones y no se re-renderice. El layout no se desmonta al cambiar de página."
        seniorTip="El layout es Server Component — no necesita 'use client'. El ThemeProvider (que sí es client) se importa como hijo. Un Server Component puede renderizar Client Components."
        difficulty="intermedio"
      />

      <HintCard
        title="Script anti-FOUC va en el <head> del layout"
        concept="Blocking Script + dangerouslySetInnerHTML"
        description="Sin un script bloqueante, el usuario ve un flash blanco antes de que React aplique el tema oscuro. El script se ejecuta antes de pintar el body."
        seniorTip="Usa <script dangerouslySetInnerHTML={{ __html: script }} /> dentro de <head>. El script lee localStorage y aplica la clase 'dark' al <html> antes de que se pinte nada."
        difficulty="avanzado"
      />

      <HintCard
        title="typeof window === 'undefined' = estás en el servidor"
        concept="Server vs Client detection"
        description="Next.js ejecuta componentes en el servidor (Node.js) donde no existe window, document ni localStorage. Siempre verifica antes de usarlos."
        seniorTip="Usa esta guarda al inicio de funciones que acceden al navegador. Retorna un default seguro ('system') cuando estás en el servidor."
        difficulty="básico"
      />

      <HintCard
        title="useCallback para funciones que se pasan como value del context"
        concept="Referential Stability"
        description="Sin useCallback, cada render del provider crea funciones nuevas → todos los consumidores se re-renderizan innecesariamente."
        seniorTip="Envuelve applyTheme y setTheme en useCallback. Las dependencias deben ser mínimas. applyTheme no depende de nada ([]), setTheme depende de applyTheme."
        difficulty="intermedio"
      />

      <HintCard
        title="matchMedia escucha cambios del SO en tiempo real"
        concept="addEventListener('change') en mediaQuery"
        description="Si el usuario cambia el tema del SO mientras tu app está abierta, necesitas reaccionar. Solo aplica si el usuario eligió 'system'."
        seniorTip="Usa mediaQuery.addEventListener('change', handler) con cleanup en el return del useEffect. No uses el deprecated addListener."
        difficulty="intermedio"
      />

      <HintCard
        title="Dos capas: script visual + estado React"
        concept="Anti-FOUC + Context sincronizado"
        description="El script previene el flash visual. Las funciones getInitialTheme/resolveTheme inicializan el estado de React con el valor correcto. Sin ambos, hay flash o inconsistencia."
        seniorTip="El script aplica la clase CSS. El useState(getInitialTheme) sincroniza React. Ambos leen localStorage de la misma forma para estar alineados."
        difficulty="avanzado"
      />
    </div>
  );
}

// Solución Senior
const SENIOR_SOLUTION = `// ============================================
// SOLUCIÓN SENIOR: DARK THEME SWITCHER
// ============================================

// ARQUITECTURA:
// 1. lib/fouc.js         → Script anti-FOUC (se ejecuta antes de React)
// 2. contexts/theme-helpers.ts → Funciones puras (getInitialTheme, resolveTheme)
// 3. contexts/theme-context.tsx → ThemeProvider + useTheme hook
// 4. app/layout.tsx      → Script en <head> + ThemeProvider en <body>
// 5. Componentes         → Consumen useTheme() para leer/cambiar tema

// ─────────────────────────────────────────────
// 1️⃣ SCRIPT ANTI-FOUC (lib/fouc.js)
// Se ejecuta ANTES de que React se cargue
// ─────────────────────────────────────────────

export const clearThemeScript = \`
  (function() {
    function getTheme() {
      try {
        const stored = localStorage.getItem('theme-preference');
        if (stored && ['light', 'dark', 'system'].includes(stored)) {
          return stored;
        }
      } catch (e) {}
      return 'system';
    }
    
    function resolveTheme(theme) {
      if (theme === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches 
          ? 'dark' : 'light';
      }
      return theme;
    }
    
    const theme = getTheme();
    const resolved = resolveTheme(theme);
    document.documentElement.classList.add(resolved);
    document.documentElement.style.colorScheme = resolved;
  })();
\`;

// ─────────────────────────────────────────────
// 2️⃣ HELPERS (contexts/theme-helpers.ts)
// Funciones puras reutilizables — se importan en theme-context.tsx:
// import { getInitialTheme, resolveTheme, STORAGE_KEY } from "./theme-helpers";
// ─────────────────────────────────────────────

// La key con la que se guarda/lee del localStorage
export const STORAGE_KEY = 'theme-preference';

// Lee qué tema eligió el usuario la última vez (o 'system' si no hay nada)
// typeof window === 'undefined' = estamos en el servidor (Node.js), no hay localStorage
export function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'system';
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && ['light', 'dark', 'system'].includes(stored)) {
      return stored as Theme;
    }
  } catch {
    // localStorage puede fallar en modo incógnito o storage deshabilitado
  }
  return 'system';
}

// Convierte 'system' en 'light' o 'dark' real preguntando al SO
// window.matchMedia('(prefers-color-scheme: dark)') es una API nativa del navegador
export function resolveTheme(theme: Theme): 'light' | 'dark' {
  if (theme === 'system') {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark' : 'light';
  }
  return theme;
}

// ─────────────────────────────────────────────
// 3️⃣ CONTEXT (contexts/theme-context.tsx)
// ─────────────────────────────────────────────

'use client';

export function ThemeProvider({ children }) {
  // ✅ Inicialización síncrona — sin parpadeo
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() =>
    resolveTheme(getInitialTheme())
  );

  // ✅ Aplica tema al DOM (clase en <html> + colorScheme)
  const applyTheme = useCallback((newTheme: Theme) => {
    const resolved = resolveTheme(newTheme);
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolved);
    root.style.colorScheme = resolved;
    setResolvedTheme(resolved);
  }, []);

  // ✅ Escucha cambios del SO (solo si tema es 'system')
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => { if (theme === 'system') applyTheme('system'); };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme, applyTheme]);

  // ✅ Cambia tema: estado + DOM + localStorage
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
    try { localStorage.setItem(STORAGE_KEY, newTheme); } catch {}
  }, [applyTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ✅ Hook con guard para uso fuera del provider
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}

// ─────────────────────────────────────────────
// 4️⃣ LAYOUT (app/layout.tsx)
// ─────────────────────────────────────────────

// import { clearThemeScript } from '@/lib/fouc';
// import { ThemeProvider } from '@/contexts/theme-context';
//
// <html>
//   <head>
//     <script dangerouslySetInnerHTML={{ __html: clearThemeScript }} />
//   </head>
//   <body>
//     <ThemeProvider>{children}</ThemeProvider>
//   </body>
// </html>

// ─────────────────────────────────────────────
// 5️⃣ CONSUMIR EN COMPONENTES
// ─────────────────────────────────────────────

function ThemeSwitcherDemo() {
  // useTheme() viene del contexto — da acceso al tema actual y a la función para cambiarlo
  const { theme, setTheme } = useTheme();

  // setTheme('dark') hace todo internamente: DOM + estado React + localStorage
  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  return (
    <div className="space-y-6">
      {/* Selector de tema con 3 botones */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Selector de Tema</CardTitle>
          <CardDescription>
            Implementa los 3 modos: Light, Dark y System
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {/* variant condicional: "default" si está activo, "outline" si no */}
            <Button
              variant={theme === "light" ? "default" : "outline"}
              onClick={() => handleThemeChange("light")}
              className="flex items-center gap-2"
            >
              <Sun className="w-4 h-4" />
              Light
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              onClick={() => handleThemeChange("dark")}
              className="flex items-center gap-2"
            >
              <Moon className="w-4 h-4" />
              Dark
            </Button>
            <Button
              variant={theme === "system" ? "default" : "outline"}
              onClick={() => handleThemeChange("system")}
              className="flex items-center gap-2"
            >
              <Monitor className="w-4 h-4" />
              System
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ✅ PUNTOS CLAVE:
// 1. Script en <head> previene flash visual (FOUC)
// 2. getInitialTheme sincroniza React con lo que el script ya aplicó
// 3. useCallback en applyTheme/setTheme evita re-renders innecesarios
// 4. matchMedia listener reacciona a cambios del SO en tiempo real
// 5. try-catch en localStorage para robustez
// 6. ThemeProvider en layout (no en page) para persistir entre rutas
// 7. useTheme() con guard para errores claros si se usa mal`;

function ThemeSolution() {
  return (
    <div className="space-y-4">
      <Alert className="bg-blue-500/10 border-blue-500/20">
        <AlertCircle className="h-4 w-4 text-blue-500" />
        <AlertDescription className="text-blue-600">
          Esta solución demuestra cómo evitar FOUC, persistir preferencias, y
          detectar el tema del sistema correctamente.
        </AlertDescription>
      </Alert>

      <CodeBlock
        code={SENIOR_SOLUTION}
        title="theme-provider-senior.tsx"
        showRevealButton={true}
      />
    </div>
  );
}

function ThemeTracking() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tracking del Ejercicio</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground uppercase">
              Pasos realizados
            </h4>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>
                <strong>Script anti-FOUC</strong> en <code>lib/fouc.js</code> —
                se ejecuta antes de React para aplicar clase dark/light al HTML
                sin flash
              </li>
              <li>
                <strong>Helpers puros</strong> en{" "}
                <code>contexts/theme-helpers.ts</code> — getInitialTheme (lee
                localStorage) y resolveTheme (convierte &apos;system&apos; en
                light/dark)
              </li>
              <li>
                <strong>ThemeProvider</strong> en{" "}
                <code>contexts/theme-context.tsx</code> — Context con
                useCallback para applyTheme y setTheme
              </li>
              <li>
                <strong>Mover ThemeProvider al layout</strong> — no en page,
                para que persista entre rutas sin re-renderizarse
              </li>
              <li>
                <strong>Script en &lt;head&gt;</strong> con next/script
                strategy=&quot;beforeInteractive&quot;
              </li>
              <li>
                <strong>Listener de matchMedia</strong> — reacciona si el SO
                cambia de tema mientras la app está abierta
              </li>
              <li>
                <strong>useTheme() hook</strong> — con guard que lanza error si
                se usa fuera del provider
              </li>
              <li>
                <strong>Mounted pattern</strong> en ThemeToggle — evita
                hydration mismatch (servidor vs cliente)
              </li>
            </ol>
          </div>
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground uppercase">
              ¿Por qué se hizo así?
            </h4>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>
                <strong>Dos capas</strong> — script previene flash visual,
                context sincroniza estado React. Sin ambos hay FOUC o
                inconsistencia
              </li>
              <li>
                <strong>Provider en layout</strong> — no se re-renderiza al
                navegar, el tema persiste
              </li>
              <li>
                <strong>useCallback</strong> — applyTheme y setTheme se pasan
                como value del context. Sin memoizar, todos los consumidores se
                re-renderizan en cada render del provider
              </li>
              <li>
                <strong>typeof window === undefined</strong> — Next.js ejecuta
                en servidor donde no hay localStorage ni matchMedia
              </li>
              <li>
                <strong>try-catch en localStorage</strong> — puede fallar en
                incógnito o storage deshabilitado
              </li>
              <li>
                <strong>Mounted pattern</strong> — servidor renderiza
                &apos;system&apos; (Monitor icon), cliente lee localStorage y
                puede ser &apos;dark&apos; (Moon). Sin mounted hay hydration
                mismatch
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground uppercase">
              Archivos involucrados
            </h4>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-muted rounded text-xs">
                lib/fouc.js
              </span>
              <span className="px-2 py-1 bg-muted rounded text-xs">
                contexts/theme-helpers.ts
              </span>
              <span className="px-2 py-1 bg-muted rounded text-xs">
                contexts/theme-context.tsx
              </span>
              <span className="px-2 py-1 bg-muted rounded text-xs">
                app/layout.tsx
              </span>
              <span className="px-2 py-1 bg-muted rounded text-xs">
                app/page.tsx (ThemeToggle)
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Componente principal del ejercicio
export function DarkThemeSwitcherExercise() {
  const [activeTab, setActiveTab] = useState<ExerciseTab>("exercise");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Palette className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle>Dark Theme Switcher</CardTitle>
              <CardDescription>
                Implementa un sistema de temas con Context API y persistencia
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ExerciseTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            exerciseContent={<ThemeSwitcherDemo />}
            hintsContent={<ThemeHints />}
            solutionContent={<ThemeSolution />}
            trackingContent={<ThemeTracking />}
          />
        </CardContent>
      </Card>
    </div>
  );
}
