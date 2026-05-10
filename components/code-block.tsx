'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Copy, Eye, EyeOff } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  showRevealButton?: boolean;
}

export function CodeBlock({ code, language = 'typescript', title, showRevealButton = false }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [revealed, setRevealed] = useState(!showRevealButton);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-lg border border-border bg-muted/30 overflow-hidden">
      {title && (
        <div className="px-4 py-2 border-b border-border bg-muted/50 flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
          <div className="flex items-center gap-2">
            {showRevealButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRevealed(!revealed)}
                className="h-7 px-2"
              >
                {revealed ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5 mr-1" />
                    Ocultar
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5 mr-1" />
                    Revelar Solución Senior
                  </>
                )}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              className="h-7 px-2"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </Button>
          </div>
        </div>
      )}
      
      <div className={`relative ${!revealed ? 'blur-sm select-none' : ''}`}>
        <pre className="p-4 overflow-x-auto text-sm">
          <code className={`language-${language}`}>{code}</code>
        </pre>
        {!revealed && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50">
            <Button onClick={() => setRevealed(true)} variant="secondary">
              <Eye className="w-4 h-4 mr-2" />
              Revelar Solución Senior
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
