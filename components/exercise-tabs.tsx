'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lightbulb, Code, Play } from 'lucide-react';
import type { ExerciseTab } from '@/lib/types';

interface ExerciseTabsProps {
  activeTab: ExerciseTab;
  onTabChange: (tab: ExerciseTab) => void;
  exerciseContent: React.ReactNode;
  hintsContent: React.ReactNode;
  solutionContent: React.ReactNode;
}

export function ExerciseTabs({
  activeTab,
  onTabChange,
  exerciseContent,
  hintsContent,
  solutionContent,
}: ExerciseTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={(v) => onTabChange(v as ExerciseTab)} className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="exercise" className="flex items-center gap-2">
          <Play className="w-4 h-4" />
          Ejercicio
        </TabsTrigger>
        <TabsTrigger value="hints" className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4" />
          Pistas Senior
        </TabsTrigger>
        <TabsTrigger value="solution" className="flex items-center gap-2">
          <Code className="w-4 h-4" />
          Solución Senior
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="exercise" className="mt-0">
        {exerciseContent}
      </TabsContent>
      
      <TabsContent value="hints" className="mt-0">
        {hintsContent}
      </TabsContent>
      
      <TabsContent value="solution" className="mt-0">
        {solutionContent}
      </TabsContent>
    </Tabs>
  );
}
