'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export function ThemeToggle({ label = 'Toggle theme' }: { label?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === 'dark';

  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="group relative inline-flex h-9 items-center gap-1 rounded-full border border-border/80 bg-muted/60 p-1 text-xs font-medium text-foreground shadow-2xs backdrop-blur-md transition-all hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span
        className={cn(
          'inline-flex h-7 w-7 items-center justify-center rounded-full transition-all duration-300',
          mounted && !isDark
            ? 'bg-primary text-primary-foreground shadow-xs scale-100'
            : 'text-muted-foreground hover:text-foreground scale-90',
        )}
      >
        <Sun className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-45" />
      </span>
      <span
        className={cn(
          'inline-flex h-7 w-7 items-center justify-center rounded-full transition-all duration-300',
          isDark
            ? 'bg-primary text-primary-foreground shadow-xs scale-100'
            : 'text-muted-foreground hover:text-foreground scale-90',
        )}
      >
        <Moon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-rotate-12" />
      </span>
    </button>
  );
}
