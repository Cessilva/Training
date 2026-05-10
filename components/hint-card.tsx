'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, BookOpen, AlertTriangle } from 'lucide-react';

interface HintCardProps {
  title: string;
  concept: string;
  description: string;
  seniorTip: string;
  difficulty: 'básico' | 'intermedio' | 'avanzado';
}

export function HintCard({ title, concept, description, seniorTip, difficulty }: HintCardProps) {
  const difficultyColor = {
    básico: 'bg-green-500/10 text-green-600 border-green-500/20',
    intermedio: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    avanzado: 'bg-red-500/10 text-red-600 border-red-500/20',
  };

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            {title}
          </CardTitle>
          <Badge variant="outline" className={difficultyColor[difficulty]}>
            {difficulty}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
            <BookOpen className="w-4 h-4" />
            Concepto Evaluado
          </div>
          <p className="text-sm bg-primary/5 px-3 py-2 rounded-md font-mono">{concept}</p>
        </div>
        
        <div>
          <p className="text-sm text-foreground/80">{description}</p>
        </div>
        
        <div className="border-t border-border pt-4">
          <div className="flex items-center gap-2 text-sm font-medium text-primary mb-2">
            <AlertTriangle className="w-4 h-4" />
            Tip Senior
          </div>
          <p className="text-sm text-muted-foreground italic">{seniorTip}</p>
        </div>
      </CardContent>
    </Card>
  );
}
