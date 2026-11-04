import type { HTMLAttributes, ReactNode } from 'react';
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
        'py-16 md:py-24',
        muted ? 'bg-muted/60' : 'bg-background',
        className,
      )}
      {...props}
    >
      <Container>
        {eyebrow || title || actions ? (
          <div className="mb-10 flex flex-col justify-between gap-4 md:mb-12 md:flex-row md:items-end">
            <div>
              {eyebrow ? (
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-primary">
                  {eyebrow}
                </p>
              ) : null}
              {title ? (
                <h2 className="font-heading text-[28px] font-bold leading-tight tracking-tight text-foreground md:text-[40px]">
                  {title}
                </h2>
              ) : null}
              {subtitle ? (
                <p className="mt-2 max-w-[65ch] text-base text-muted-foreground md:text-lg">
                  {subtitle}
                </p>
              ) : null}
            </div>
            {actions ? <div className="shrink-0">{actions}</div> : null}
          </div>
        ) : null}
        {children}
      </Container>
    </section>
  );
}
