import type { HTMLAttributes, ReactNode } from 'react';
import { Sparkles } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { cn } from '@/lib/utils';

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  id?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  muted?: boolean;
  /** Render this section in the dark palette regardless of the page theme. */
  inverted?: boolean;
  actions?: ReactNode;
}

export function Section({
  id,
  eyebrow,
  title,
  subtitle,
  muted = false,
  inverted = false,
  actions,
  children,
  className,
  ...props
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'relative overflow-hidden border-b border-border/70 py-12 md:py-16 lg:py-20',
        inverted
          ? 'dark bg-background text-foreground'
          : muted
            ? 'bg-muted/30'
            : 'bg-transparent',
        className,
      )}
      {...props}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 right-1/4 h-64 w-64 rounded-full opacity-20 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, color-mix(in oklab, var(--primary) 45%, transparent) 0%, transparent 70%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 left-1/4 h-64 w-64 rounded-full opacity-15 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, color-mix(in oklab, var(--primary) 35%, transparent) 0%, transparent 70%)',
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-3 left-4 font-mono text-[11px] text-primary/40 select-none sm:left-8"
      >
        +
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-3 right-4 font-mono text-[11px] text-primary/40 select-none sm:right-8"
      >
        +
      </div>

      <Container className="relative z-10">
        {eyebrow || title || actions ? (
          <div className="mb-8 border-b border-border/80 pb-6 md:mb-10">
            {eyebrow ? <SectionEyebrow className="mb-3">{eyebrow}</SectionEyebrow> : null}

            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
              <div className="space-y-2">
                {title ? (
                  <h2 className="font-heading text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl lg:text-4xl">
                    {title}
                  </h2>
                ) : null}
                {subtitle ? (
                  <p className="max-w-[68ch] text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {subtitle}
                  </p>
                ) : null}
              </div>

              {actions ? <div className="shrink-0">{actions}</div> : null}
            </div>
          </div>
        ) : null}
        {children}
      </Container>
    </section>
  );
}

/** Pill label with a fading rule, used above section and page titles. */
export function SectionEyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/35 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary shadow-2xs">
        <Sparkles className="h-3 w-3" />
        <span>{children}</span>
      </span>
      <div
        aria-hidden="true"
        className="h-px flex-1 bg-gradient-to-r from-primary/35 via-border/80 to-transparent"
      />
    </div>
  );
}
