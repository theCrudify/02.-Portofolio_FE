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
  actions?: ReactNode;
}

export function Section({
  id,
  eyebrow,
  title,
  subtitle,
  muted = false,
  actions,
  children,
  className,
  ...props
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'relative overflow-hidden border-b border-border/80 py-16 md:py-24',
        muted ? 'bg-muted/35' : 'bg-background/70',
        className,
      )}
      {...props}
    >
      {/* Decorative Ambient Orbs & Blueprint Frame */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 right-1/4 h-72 w-72 rounded-full blur-3xl opacity-25"
        style={{
          background:
            'radial-gradient(circle, color-mix(in oklab, var(--primary) 50%, transparent) 0%, transparent 70%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 left-1/4 h-72 w-72 rounded-full blur-3xl opacity-20"
        style={{
          background:
            'radial-gradient(circle, color-mix(in oklab, var(--primary) 40%, transparent) 0%, transparent 70%)',
        }}
      />

      {/* Structural Crosshair Ornaments */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-3 left-4 font-mono text-xs text-muted-foreground/40 select-none sm:left-8"
      >
        +
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-3 right-4 font-mono text-xs text-muted-foreground/40 select-none sm:right-8"
      >
        +
      </div>

      <Container className="relative z-10">
        {eyebrow || title || actions ? (
          <div className="mb-10 rounded-2xl border border-border/80 bg-card/80 p-6 shadow-sm backdrop-blur-md md:mb-12 md:p-8">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  {eyebrow ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
                      <Sparkles className="h-3 w-3" />
                      <span>{eyebrow}</span>
                    </span>
                  ) : null}
                  {id ? (
                    <span className="rounded-full border border-border bg-muted/70 px-2.5 py-1 font-mono text-xs text-muted-foreground">
                      SYS // {id.toUpperCase()}
                    </span>
                  ) : null}
                  <span className="hidden items-center gap-1.5 rounded-full border border-border bg-background/80 px-2.5 py-1 font-mono text-xs text-muted-foreground sm:inline-flex">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" />
                    <span>VERIFIED MODULE</span>
                  </span>
                </div>

                {title ? (
                  <h2 className="font-heading text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl lg:text-[42px]">
                    {title}
                  </h2>
                ) : null}
                {subtitle ? (
                  <p className="max-w-[70ch] text-base leading-relaxed text-muted-foreground md:text-lg">
                    {subtitle}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {actions ? <div className="shrink-0">{actions}</div> : null}
              </div>
            </div>
          </div>
        ) : null}
        {children}
      </Container>
    </section>
  );
}
