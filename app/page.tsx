"use client";

import { useEffect, useState } from "react";
import { AppSidebar, type ExerciseId } from "@/components/app-sidebar";
import { FlightValidationExercise } from "@/components/exercises/flight-validation";
import { DarkThemeSwitcherExercise } from "@/components/exercises/dark-theme-switcher";
import { HackerMapsExercise } from "@/components/exercises/hacker-maps";
import { CustomerListExercise } from "@/components/exercises/customer-list";
import { useTheme } from "@/contexts/theme-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Monitor, Github, BookOpen } from "lucide-react";

function ExerciseContent({ exerciseId }: { exerciseId: ExerciseId }) {
  switch (exerciseId) {
    case "flight-validation":
      return <FlightValidationExercise />;
    case "dark-theme":
      return <DarkThemeSwitcherExercise />;
    case "hacker-maps":
      return <HackerMapsExercise />;
    case "customer-list":
      return <CustomerListExercise />;
    default:
      return null;
  }
}

function ExerciseHeader({ exerciseId }: { exerciseId: ExerciseId }) {
  const titles: Record<
    ExerciseId,
    { title: string; badge: string; badgeColor: string }
  > = {
    "flight-validation": {
      title: "Validación de Vuelos",
      badge: "Formularios",
      badgeColor: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    },
    "dark-theme": {
      title: "Sistema de Temas",
      badge: "Context API",
      badgeColor: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    },
    "hacker-maps": {
      title: "Búsqueda de Ubicaciones",
      badge: "Data Fetching",
      badgeColor: "bg-green-500/10 text-green-600 border-green-500/20",
    },
    "customer-list": {
      title: "Gestión de Clientes",
      badge: "CRUD",
      badgeColor: "bg-orange-500/10 text-orange-600 border-orange-500/20",
    },
  };

  const { title, badge, badgeColor } = titles[exerciseId];

  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold">{title}</h1>
          <Badge variant="outline" className={badgeColor}>
            {badge}
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Implementa la solución correcta y revela las pistas si necesitas
          ayuda.
        </p>
      </div>
      <div className="flex items-center gap-2 border-solid">
        <Button variant="outline" size="sm" asChild>
          <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
            <BookOpen className="w-4 h-4 mr-2" />
            Docs
          </a>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="w-4 h-4 mr-2" />
            GitHub
          </a>
        </Button>
      </div>
    </div>
  );
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const themes: Array<"light" | "dark" | "system"> = [
      "light",
      "dark",
      "system",
    ];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
  };

  const icons = {
    light: Sun,
    dark: Moon,
    system: Monitor,
  };
  const Icon = mounted ? icons[theme] : Monitor;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      title={`Tema actual: ${mounted ? theme : "system"}`}
    >
      <Icon className="w-5 h-5" />
    </Button>
  );
}

export default function SeniorTrainingApp() {
  const [activeExercise, setActiveExercise] =
    useState<ExerciseId>("flight-validation");

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <AppSidebar
        activeExercise={activeExercise}
        onExerciseChange={setActiveExercise}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="font-normal">
              Ejercicio{" "}
              {[
                "flight-validation",
                "dark-theme",
                "hacker-maps",
                "customer-list",
              ].indexOf(activeExercise) + 1}{" "}
              de 4
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <ExerciseHeader exerciseId={activeExercise} />
            <ExerciseContent exerciseId={activeExercise} />
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-border bg-card px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between text-sm text-muted-foreground">
            <p>
              💡 Tip: Usa las pestañas para ver pistas y la solución óptima de
              cada ejercicio.
            </p>
            <p>Senior Frontend Training © 2024</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
