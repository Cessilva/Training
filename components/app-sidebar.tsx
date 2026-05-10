'use client';

import { Plane, Palette, MapPin, Users, GraduationCap, Code2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ExerciseId = 'flight-validation' | 'dark-theme' | 'hacker-maps' | 'customer-list';

interface Exercise {
  id: ExerciseId;
  name: string;
  description: string;
  icon: React.ElementType;
  difficulty: 'Básico' | 'Intermedio' | 'Avanzado';
  concepts: string[];
}

export const exercises: Exercise[] = [
  {
    id: 'flight-validation',
    name: 'Flight Validation',
    description: 'Validación reactiva de formularios',
    icon: Plane,
    difficulty: 'Intermedio',
    concepts: ['useMemo', 'Controlled Components', 'Date Objects'],
  },
  {
    id: 'dark-theme',
    name: 'Dark Theme Switcher',
    description: 'Sistema de temas con Context API',
    icon: Palette,
    difficulty: 'Avanzado',
    concepts: ['Context API', 'localStorage', 'CSS Variables'],
  },
  {
    id: 'hacker-maps',
    name: 'HackerMaps',
    description: 'Búsqueda y filtrado con API mockeada',
    icon: MapPin,
    difficulty: 'Intermedio',
    concepts: ['useEffect', 'AbortController', 'useDeferredValue'],
  },
  {
    id: 'customer-list',
    name: 'Customer List',
    description: 'CRUD con inmutabilidad estricta',
    icon: Users,
    difficulty: 'Básico',
    concepts: ['Inmutabilidad', '.filter()', 'Spread Operator'],
  },
];

interface AppSidebarProps {
  activeExercise: ExerciseId;
  onExerciseChange: (id: ExerciseId) => void;
}

export function AppSidebar({ activeExercise, onExerciseChange }: AppSidebarProps) {
  return (
    <aside className="w-80 border-r border-border bg-card flex flex-col h-screen sticky top-0">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary text-primary-foreground">
            <Code2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg">Senior Training</h1>
            <p className="text-xs text-muted-foreground">React/TypeScript</p>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-muted-foreground">Progreso</span>
          <span className="font-medium">4 ejercicios</span>
        </div>
        <div className="flex gap-1">
          {exercises.map((ex, i) => (
            <div
              key={ex.id}
              className={cn(
                'h-2 flex-1 rounded-full transition-colors',
                i === exercises.findIndex(e => e.id === activeExercise)
                  ? 'bg-primary'
                  : 'bg-muted'
              )}
            />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {exercises.map((exercise) => {
            const Icon = exercise.icon;
            const isActive = activeExercise === exercise.id;
            
            return (
              <button
                key={exercise.id}
                onClick={() => onExerciseChange(exercise.id)}
                className={cn(
                  'w-full text-left p-4 rounded-lg transition-all',
                  'hover:bg-accent hover:shadow-sm',
                  isActive 
                    ? 'bg-primary/10 border border-primary/20 shadow-sm' 
                    : 'border border-transparent'
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    'p-2 rounded-lg',
                    isActive ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  )}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className={cn(
                        'font-medium text-sm truncate',
                        isActive ? 'text-primary' : ''
                      )}>
                        {exercise.name}
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {exercise.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {exercise.concepts.slice(0, 2).map((concept) => (
                        <span 
                          key={concept}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
                        >
                          {concept}
                        </span>
                      ))}
                      {exercise.concepts.length > 2 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                          +{exercise.concepts.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <GraduationCap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Tip del día</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Un Senior no solo escribe código que funciona, sino código que otros pueden entender y mantener.
          </p>
        </div>
      </div>
    </aside>
  );
}
