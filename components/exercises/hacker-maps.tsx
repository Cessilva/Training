'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExerciseTabs } from '@/components/exercise-tabs';
import { HintCard } from '@/components/hint-card';
import { CodeBlock } from '@/components/code-block';
import { MapPin, Search, AlertCircle, RefreshCw, Globe, Loader2 } from 'lucide-react';
import type { ExerciseTab, Location } from '@/lib/types';
import { fetchLocations } from '@/lib/mock-data';

// ============================================
// CÓDIGO INCOMPLETO - VERSIÓN "SUCIA" PARA ARREGLAR
// ============================================

function HackerMapsDemo() {
  // BUG: No hay estado de loading
  const [locations, setLocations] = useState<Location[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  // BUG: No hay manejo de errores
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // BUG: useEffect con fetch pero sin cleanup
  useEffect(() => {
    // TODO: Implementar loading state
    // TODO: Implementar error handling
    // TODO: Implementar cleanup para evitar memory leaks
    
    loadLocations();
  }, []);

  const loadLocations = async () => {
    // BUG: No maneja loading state correctamente
    try {
      const data = await fetchLocations();
      setLocations(data);
    } catch {
      // BUG: No muestra el error al usuario
      console.error('Error loading locations');
    }
  };

  // BUG: Filtrado ineficiente - se ejecuta en cada render
  // BUG: No es case-insensitive correctamente
  const filteredLocations = locations.filter(location => {
    // TODO: Implementar búsqueda case-insensitive
    // TODO: Buscar en nombre, país y descripción
    return location.name.includes(searchTerm);
  });

  // BUG: No hay indicador de loading
  // BUG: No hay UI para estado de error
  // BUG: No hay estado vacío cuando no hay resultados

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
          onClick={loadLocations}
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Estado de error - BUG: Nunca se muestra */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Lista de ubicaciones */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredLocations.map((location) => (
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
                    <span>{location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* BUG: No hay estado vacío */}
      {filteredLocations.length === 0 && !loading && (
        <div className="text-center py-8 text-muted-foreground">
          {/* TODO: Diferenciar entre "no hay datos" y "no hay resultados" */}
          No se encontraron ubicaciones
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
        title="Estados de UI: Loading, Error, Success"
        concept="State Machines + Discriminated Unions"
        description="Un Senior modela los estados de la UI como una máquina de estados: idle → loading → success | error. Esto evita estados imposibles como loading=true y error='algo'."
        seniorTip="Considera usar un tipo discriminado: type State = { status: 'idle' } | { status: 'loading' } | { status: 'success', data: Location[] } | { status: 'error', message: string }"
        difficulty="avanzado"
      />
      
      <HintCard
        title="Cleanup en useEffect"
        concept="AbortController + Closures"
        description="Sin cleanup, si el componente se desmonta antes de que el fetch termine, intentarás actualizar estado de un componente desmontado (memory leak)."
        seniorTip="Usa AbortController para cancelar el fetch: const controller = new AbortController(); fetch(url, { signal: controller.signal }); return () => controller.abort();"
        difficulty="intermedio"
      />
      
      <HintCard
        title="Búsqueda Case-Insensitive"
        concept="String.prototype.toLowerCase() + Normalización"
        description="Para búsqueda robusta, normaliza tanto el término de búsqueda como los datos. Considera también normalizar acentos con normalize('NFD')."
        seniorTip="const normalize = (str: string) => str.toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g, ''); Esto maneja 'José' === 'jose'."
        difficulty="básico"
      />
      
      <HintCard
        title="Debounce en Búsqueda"
        concept="useDeferredValue / Custom Hook"
        description="Filtrar en cada keystroke puede ser costoso con datasets grandes. Un Senior implementa debounce para esperar que el usuario termine de escribir."
        seniorTip="React 18+ ofrece useDeferredValue como alternativa nativa a debounce. También puedes crear un custom hook useDebounce(value, delay)."
        difficulty="intermedio"
      />
      
      <HintCard
        title="Memoización del Filtrado"
        concept="useMemo + Dependency Array"
        description="El filtrado se recalcula en cada render, incluso si locations y searchTerm no cambiaron. useMemo optimiza esto."
        seniorTip="const filtered = useMemo(() => locations.filter(...), [locations, searchTerm]); Solo recalcula cuando las dependencias cambian."
        difficulty="intermedio"
      />
    </div>
  );
}

// Solución Senior
const SENIOR_SOLUTION = `'use client';

import { useState, useEffect, useMemo, useDeferredValue, useCallback } from 'react';
import type { Location } from '@/lib/types';

// ✅ SENIOR: Tipo discriminado para estados de UI
type FetchState = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: Location[] }
  | { status: 'error'; message: string };

// ✅ SENIOR: Función de normalización para búsqueda robusta
const normalizeString = (str: string): string => {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\\u0300-\\u036f]/g, ''); // Elimina acentos
};

function HackerMapsDemo() {
  const [state, setState] = useState<FetchState>({ status: 'idle' });
  const [searchTerm, setSearchTerm] = useState('');
  
  // ✅ SENIOR: useDeferredValue para debounce nativo de React 18+
  const deferredSearchTerm = useDeferredValue(searchTerm);

  // ✅ SENIOR: Función de carga con AbortController
  const loadLocations = useCallback(async (signal?: AbortSignal) => {
    setState({ status: 'loading' });
    
    try {
      const response = await fetch('/api/locations', { signal });
      
      if (!response.ok) {
        throw new Error(\`HTTP error: \${response.status}\`);
      }
      
      const data = await response.json();
      setState({ status: 'success', data });
    } catch (err) {
      // ✅ SENIOR: No tratar abort como error
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      
      setState({ 
        status: 'error', 
        message: err instanceof Error ? err.message : 'Error desconocido'
      });
    }
  }, []);

  // ✅ SENIOR: useEffect con cleanup apropiado
  useEffect(() => {
    const controller = new AbortController();
    loadLocations(controller.signal);
    
    // ✅ SENIOR: Cleanup function para evitar memory leaks
    return () => controller.abort();
  }, [loadLocations]);

  // ✅ SENIOR: Filtrado memoizado con búsqueda multi-campo
  const filteredLocations = useMemo(() => {
    if (state.status !== 'success') return [];
    
    const normalizedSearch = normalizeString(deferredSearchTerm);
    
    if (!normalizedSearch) return state.data;
    
    return state.data.filter(location => {
      // ✅ SENIOR: Buscar en múltiples campos
      const searchableText = normalizeString(
        \`\${location.name} \${location.country} \${location.description}\`
      );
      return searchableText.includes(normalizedSearch);
    });
  }, [state, deferredSearchTerm]);

  // ✅ SENIOR: Indicador de búsqueda en progreso
  const isSearching = searchTerm !== deferredSearchTerm;

  return (
    <div className="space-y-6">
      {/* Barra de búsqueda con indicador de búsqueda diferida */}
      <div className="relative">
        <Input
          placeholder="Buscar ubicaciones..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {isSearching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      {/* ✅ SENIOR: UI basada en estado discriminado */}
      {state.status === 'loading' && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">Cargando ubicaciones...</span>
        </div>
      )}

      {state.status === 'error' && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {state.message}
            <Button 
              variant="link" 
              className="ml-2 p-0 h-auto"
              onClick={() => loadLocations()}
            >
              Reintentar
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {state.status === 'success' && (
        <>
          {filteredLocations.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">
                {searchTerm 
                  ? \`No se encontraron ubicaciones para "\${searchTerm}"\`
                  : 'No hay ubicaciones disponibles'}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredLocations.map((location) => (
                <LocationCard key={location.id} location={location} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ✅ PUNTOS CLAVE DE LA SOLUCIÓN SENIOR:
//
// 1. ESTADO DISCRIMINADO: FetchState evita estados imposibles
// 2. ABORT CONTROLLER: Cleanup apropiado para evitar memory leaks
// 3. useDeferredValue: Debounce nativo de React 18+ para búsqueda
// 4. useMemo: Filtrado memoizado que solo recalcula cuando es necesario
// 5. NORMALIZACIÓN: Búsqueda case-insensitive y sin acentos
// 6. MULTI-CAMPO: Busca en nombre, país y descripción
// 7. UX COMPLETA: Estados de loading, error, vacío y éxito`;

function HackerMapsSolution() {
  return (
    <div className="space-y-4">
      <Alert className="bg-blue-500/10 border-blue-500/20">
        <AlertCircle className="h-4 w-4 text-blue-500" />
        <AlertDescription className="text-blue-600">
          Esta solución demuestra manejo de estados discriminados, cleanup con AbortController, y búsqueda optimizada con useDeferredValue.
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
  const [activeTab, setActiveTab] = useState<ExerciseTab>('exercise');

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
                Implementa búsqueda y filtrado de ubicaciones con manejo de estados
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
