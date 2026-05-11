"use client";

import { useState, useEffect, useMemo, useDeferredValue } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExerciseTabs } from "@/components/exercise-tabs";
import { HintCard } from "@/components/hint-card";
import { CodeBlock } from "@/components/code-block";
import {
  MapPin,
  Search,
  AlertCircle,
  RefreshCw,
  Globe,
  Loader2,
} from "lucide-react";
import type { ExerciseTab, Location } from "@/lib/types";
import { fetchLocations } from "@/lib/mock-data";
import { useFetch } from "@/hooks/use-fetch";

function HackerMapsDemo() {
  const {
    data: locations,
    error,
    isLoading,
    isError,
    isSuccess,
    execute,
    cancel,
  } = useFetch<Location[]>();
  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearch = useDeferredValue(searchTerm.toLowerCase());
  //   searchTerm se actualiza inmediatamente (el input responde al instante)
  // deferredSearch se actualiza "cuando React tenga tiempo".
  //  React decide cuánto esperar según la carga del navegador.

  useEffect(() => {
    // Ignoramos el signal porque fetchLocations es mock (usa setTimeout, no fetch HTTP)
    // El hook internamente sigue protegiendo con signal.aborted antes de hacer dispatch
    execute((_signal) => fetchLocations());
    return () => cancel();

    // Si estuviéramos usando una API real, pasaríamos el signal así:
    // execute((signal) => fetch("/api/locations", { signal }).then(r => r.json()));
    // Esto cancelaría la conexión HTTP de verdad al desmontar el componente
  }, [execute, cancel]);

  // BUG: No es case-insensitive correctamente
  const filteredLocations: Location[] | null | undefined = useMemo(() => {
    //Sin useMemo: filtra en cada render (incluso si nada cambió).
    // Con useMemo: filtra solo cuando locations o searchTerm cambian.
    // Con 8 locations no importa. Con 10,000 sí notarías lag.
    return locations?.filter((location) => {
      return (
        location.name.toLowerCase().includes(deferredSearch) ||
        location.country.toLowerCase().includes(deferredSearch) ||
        location.description.toLowerCase().includes(deferredSearch)
      );
    });
  }, [locations, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Barra de búsqueda */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar ubicaciones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => execute((_signal) => fetchLocations())}
          disabled={isLoading}
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {/* Estado de error - BUG: Nunca se muestra */}
      {isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading state general*/}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">
            Cargando ubicaciones...
          </span>
        </div>
      )}

      {/* Lista de ubicaciones */}
      {isSuccess && (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredLocations?.map((location) => (
            <Card
              key={location.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{location.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {location.country}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {location.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <Globe className="w-3 h-3" />
                      <span>
                        {location.latitude.toFixed(4)},{" "}
                        {location.longitude.toFixed(4)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* BUG: No hay estado vacío */}
      {filteredLocations?.length === 0 && !isLoading && (
        <div className="text-center py-8 text-muted-foreground">
          {/* TODO: Diferenciar entre "no hay datos" y "no hay resultados" */}
          {locations && locations.length > 0
            ? "No hay resultados que coincidan con la búsqueda"
            : "No hay datos disponibles"}
        </div>
      )}

      {/* Info de bugs */}
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Bugs a arreglar:</strong>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>No hay indicador de carga mientras se obtienen datos</li>
            <li>Los errores de API no se muestran al usuario</li>
            <li>El filtro solo busca en el nombre (debería buscar en todo)</li>
            <li>El filtro es sensible a mayúsculas/minúsculas</li>
            <li>No hay cleanup en useEffect (memory leak potencial)</li>
            <li>No hay debounce en la búsqueda</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
}

// Hints para este ejercicio
function HackerMapsHints() {
  return (
    <div className="space-y-4">
      <HintCard
        title="useReducer para estados que dependen entre sí"
        concept="useReducer vs múltiples useState"
        description="Cuando tienes loading, error y data que cambian juntos, useReducer garantiza transiciones atómicas. No puedes estar en loading=true y error='algo' al mismo tiempo."
        seniorTip="Cada dispatch reemplaza TODO el estado de golpe. El reducer es como un guardia que solo permite combinaciones válidas: idle → loading → success | error."
        difficulty="avanzado"
      />

      <HintCard
        title="Custom hook genérico con <T>"
        concept="Generics en hooks"
        description="useFetch<Location[]>() le dice al hook qué tipo de datos maneja. Así data tiene el tipo correcto y TypeScript te da autocompletado."
        seniorTip="El <T> es un placeholder. Cuando usas useFetch<Location[]>(), T se reemplaza por Location[] en todo el hook. Sin él, data sería 'unknown'."
        difficulty="intermedio"
      />

      <HintCard
        title="AbortController para cancelar fetches"
        concept="Signal + cleanup en useEffect"
        description="Si el usuario navega antes de que el fetch termine, el signal cancela la conexión HTTP de verdad. Sin esto, el fetch sigue en vuelo consumiendo red."
        seniorTip="execute recibe (signal) => fetch(url, { signal }). El hook crea el AbortController internamente. cancel() en el cleanup del useEffect lo aborta."
        difficulty="avanzado"
      />

      <HintCard
        title="useDeferredValue para debounce nativo"
        concept="React decide cuánto esperar"
        description="searchTerm se actualiza al instante (input responsivo). deferredSearch se actualiza cuando React tiene tiempo. Usas deferredSearch para el filtrado pesado."
        seniorTip="A diferencia de setTimeout (tiempo fijo), useDeferredValue se adapta a la carga del dispositivo. Más inteligente y sin librerías externas."
        difficulty="intermedio"
      />

      <HintCard
        title="useMemo para memoizar el filtrado"
        concept="No recalcular si nada cambió"
        description="Sin useMemo, el .filter() se ejecuta en CADA render aunque locations y searchTerm no hayan cambiado. Con useMemo solo recalcula cuando las dependencias cambian."
        seniorTip="useMemo memoiza VALORES (el array filtrado). useCallback memoiza FUNCIONES. No los confundas — useCallback en un filtrado no tiene sentido."
        difficulty="intermedio"
      />

      <HintCard
        title="onClick espera una función, no el resultado"
        concept="Referencia vs ejecución"
        description="onClick={execute(...)} EJECUTA inmediatamente y pasa el resultado (Promise). onClick={() => execute(...)} PASA una función que se ejecuta al hacer clic."
        seniorTip="Si ves que algo se ejecuta al montar en vez de al hacer clic, revisa si te falta el () => al inicio del onClick."
        difficulty="básico"
      />

      <HintCard
        title="Expresiones JS en JSX necesitan llaves {}"
        concept="JSX vs JavaScript"
        description="Dentro de JSX, cualquier expresión JavaScript debe ir entre {}. Sin ellas, JSX lo trata como texto literal y caracteres como > rompen el parseo."
        seniorTip="{condicion ? 'texto A' : 'texto B'} — el ternario completo va dentro de llaves. Sin las llaves externas, JSX no sabe que es código."
        difficulty="básico"
      />
    </div>
  );
}

// Solución Senior
const SENIOR_SOLUTION = `// ============================================
// SOLUCIÓN: HACKER MAPS - Data Fetching + Búsqueda
// ============================================

// ─────────────────────────────────────────────
// 1️⃣ CUSTOM HOOK: hooks/use-fetch.ts
// Maneja loading/success/error con useReducer + AbortController
// ─────────────────────────────────────────────

import { useReducer, useCallback, useRef } from "react";

type FetchState<T> =
  | { status: "idle"; data: null; error: null }
  | { status: "loading"; data: null; error: null }
  | { status: "success"; data: T; error: null }
  | { status: "error"; data: null; error: string };

type FetchAction<T> =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: T }
  | { type: "FETCH_ERROR"; payload: string };

function fetchReducer<T>(_state: FetchState<T>, action: FetchAction<T>): FetchState<T> {
  switch (action.type) {
    case "FETCH_START":
      return { status: "loading", data: null, error: null };
    case "FETCH_SUCCESS":
      return { status: "success", data: action.payload, error: null };
    case "FETCH_ERROR":
      return { status: "error", data: null, error: action.payload };
  }
}

export function useFetch<T>() {
  const [state, dispatch] = useReducer(fetchReducer<T>, {
    status: "idle", data: null, error: null,
  });

  // Guarda el AbortController actual para poder cancelarlo
  const abortControllerRef = useRef<AbortController | null>(null);

  const execute = useCallback(async (fetchFn: (signal: AbortSignal) => Promise<T>) => {
    // Si hay un fetch anterior en curso, lo cancela
    if (abortControllerRef.current) abortControllerRef.current.abort();

    // Crea un nuevo AbortController para esta llamada
    const controller = new AbortController();
    abortControllerRef.current = controller;

    dispatch({ type: "FETCH_START" });

    try {
      const data = await fetchFn(controller.signal);
      // Si fue abortado, no actualiza estado
      if (!controller.signal.aborted) {
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      }
    } catch (err) {
      // Si el error es por abort, lo ignoramos (no es un error real)
      if (err instanceof Error && err.name === "AbortError") return;
      if (!controller.signal.aborted) {
        dispatch({ type: "FETCH_ERROR", payload: err instanceof Error ? err.message : "Error desconocido" });
      }
    }
  }, []);

  // Cancela el fetch en curso (para usar en cleanup de useEffect)
  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  return {
    ...state,
    isLoading: state.status === "loading",
    isError: state.status === "error",
    isSuccess: state.status === "success",
    execute,
    cancel,
  };
}

// ─────────────────────────────────────────────
// 2️⃣ COMPONENTE: HackerMapsDemo
// ─────────────────────────────────────────────

import { useState, useEffect, useMemo, useDeferredValue } from "react";
import { useFetch } from "@/hooks/use-fetch";
import { fetchLocations } from "@/lib/mock-data";
import type { Location } from "@/lib/types";

function HackerMapsDemo() {
  const {
    data: locations,
    error,
    isLoading,
    isError,
    isSuccess,
    execute,
    cancel,
  } = useFetch<Location[]>();
  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearch = useDeferredValue(searchTerm.toLowerCase());
  //   searchTerm se actualiza inmediatamente (el input responde al instante)
  // deferredSearch se actualiza "cuando React tenga tiempo".
  //  React decide cuánto esperar según la carga del navegador.

  useEffect(() => {
    // Ignoramos el signal porque fetchLocations es mock (usa setTimeout, no fetch HTTP)
    // El hook internamente sigue protegiendo con signal.aborted antes de hacer dispatch
    execute((_signal) => fetchLocations());
    return () => cancel();

    // Si estuviéramos usando una API real, pasaríamos el signal así:
    // execute((signal) => fetch("/api/locations", { signal }).then(r => r.json()));
    // Esto cancelaría la conexión HTTP de verdad al desmontar el componente
  }, [execute, cancel]);

  const filteredLocations: Location[] | null | undefined = useMemo(() => {
    // Sin useMemo: filtra en cada render (incluso si nada cambió).
    // Con useMemo: filtra solo cuando locations o searchTerm cambian.
    // Con 8 locations no importa. Con 10,000 sí notarías lag.
    return locations?.filter((location) => {
      return (
        location.name.toLowerCase().includes(deferredSearch) ||
        location.country.toLowerCase().includes(deferredSearch) ||
        location.description.toLowerCase().includes(deferredSearch)
      );
    });
  }, [locations, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Barra de búsqueda */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar ubicaciones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        {/* onClick={() => ...) pasa una FUNCIÓN. Sin () => ejecutaría inmediatamente */}
        <Button
          variant="outline"
          onClick={() => execute((_signal) => fetchLocations())}
          disabled={isLoading}
        >
          <RefreshCw className={\`w-4 h-4 \${isLoading ? "animate-spin" : ""}\`} />
        </Button>
      </div>

      {/* Estado de error */}
      {isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading state general */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">
            Cargando ubicaciones...
          </span>
        </div>
      )}

      {/* Lista de ubicaciones (solo si success) */}
      {isSuccess && (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredLocations?.map((location) => (
            <Card key={location.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{location.name}</h3>
                    <p className="text-sm text-muted-foreground">{location.country}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {location.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <Globe className="w-3 h-3" />
                      <span>
                        {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Estado vacío — diferencia entre "sin resultados" y "sin datos" */}
      {/* Las llaves {} son necesarias porque es JavaScript dentro de JSX */}
      {filteredLocations?.length === 0 && !isLoading && (
        <div className="text-center py-8 text-muted-foreground">
          {locations && locations.length > 0
            ? "No hay resultados que coincidan con la búsqueda"
            : "No hay datos disponibles"}
        </div>
      )}
    </div>
  );
}

// ✅ PUNTOS CLAVE:
// 1. useReducer en custom hook → estados mutuamente excluyentes (no puedes tener loading + error)
// 2. AbortController → cancela fetch real al desmontar (cleanup)
// 3. useDeferredValue → debounce nativo, React decide cuánto esperar
// 4. useMemo → filtrado solo recalcula cuando cambian dependencias
// 5. Genérico <T> → hook reutilizable: useFetch<Location[]>(), useFetch<User>(), etc.
// 6. isLoading/isError/isSuccess → UI condicional limpia
// 7. onClick={() => execute(...)} → () => evita ejecución inmediata
// 8. {expresión JS} en JSX → siempre entre llaves`;

function HackerMapsSolution() {
  return (
    <div className="space-y-4">
      <Alert className="bg-blue-500/10 border-blue-500/20">
        <AlertCircle className="h-4 w-4 text-blue-500" />
        <AlertDescription className="text-blue-600">
          Esta solución usa un custom hook con useReducer + AbortController para
          manejo de estados, y useDeferredValue + useMemo para búsqueda
          optimizada.
        </AlertDescription>
      </Alert>

      <CodeBlock
        code={SENIOR_SOLUTION}
        title="hacker-maps-senior.tsx"
        showRevealButton={true}
      />
    </div>
  );
}

// Componente principal del ejercicio
export function HackerMapsExercise() {
  const [activeTab, setActiveTab] = useState<ExerciseTab>("exercise");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle>HackerMaps</CardTitle>
              <CardDescription>
                Implementa búsqueda y filtrado de ubicaciones con manejo de
                estados
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ExerciseTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            exerciseContent={<HackerMapsDemo />}
            hintsContent={<HackerMapsHints />}
            solutionContent={<HackerMapsSolution />}
          />
        </CardContent>
      </Card>
    </div>
  );
}
