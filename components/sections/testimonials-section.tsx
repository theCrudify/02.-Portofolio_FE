'use client';

import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { SpotlightCard } from '@/components/effects/spotlight-card';
import { Section } from '@/components/layout/section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { PublicTestimonial } from '@/lib/api/types';
import { cn } from '@/lib/utils';

export interface TestimonialsSectionProps {
  testimonials: PublicTestimonial[];
  muted?: boolean;
}

export function TestimonialsSection({ testimonials, muted }: TestimonialsSectionProps) {
  const t = useTranslations('sections.testimonials');
  const [index, setIndex] = useState(0);

  if (!testimonials || testimonials.length === 0) return null;

  const current = testimonials[index] ?? testimonials[0]!;

  return (
    <Section id="testimonials" eyebrow={t('eyebrow')} title={t('title')} muted={muted}>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <SpotlightCard
          className={cn(
            'flex flex-col justify-between p-6 md:p-8',
            testimonials.length > 1 ? 'lg:col-span-7' : 'lg:col-span-12',
          )}
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
                <Quote className="h-5 w-5" />
              </span>
              <Badge variant="secondary" className="font-mono text-xs">
                {index + 1} / {testimonials.length}
              </Badge>
            </div>

            <blockquote className="font-heading text-lg leading-relaxed text-foreground md:text-2xl">
              &ldquo;{current.quote}&rdquo;
            </blockquote>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
            <div className="flex items-center gap-3.5">
              {current.avatar ? (
                <div className="relative h-12 w-12 overflow-hidden rounded-full border border-primary/40 bg-muted">
                  <Image
                    src={current.avatar.url}
                    alt={current.avatar.alt || current.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
              ) : null}
              <div>
                <p className="font-heading text-base font-bold text-foreground">{current.name}</p>
                <p className="text-xs text-muted-foreground">
                  {[current.position, current.company, current.relationship]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
              </div>
            </div>

            {testimonials.length > 1 ? (
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label={t('prev')}
                  onClick={() =>
                    setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
                  }
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label={t('next')}
                  onClick={() => setIndex((prev) => (prev + 1) % testimonials.length)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            ) : null}
          </div>
        </SpotlightCard>

        {testimonials.length > 1 ? (
          <div className="space-y-3 lg:col-span-5">
            {testimonials.map((item, idx) => {
              const active = idx === index;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setIndex(idx)}
                  className={cn(
                    'w-full rounded-xl border p-4 text-left transition-all',
                    active
                      ? 'border-primary bg-card shadow-md ring-1 ring-primary/30'
                      : 'border-border/80 bg-card/60 opacity-80 hover:opacity-100',
                  )}
                >
                  <div className="flex items-center gap-3">
                    {item.avatar ? (
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                        <Image
                          src={item.avatar.url}
                          alt={item.avatar.alt || item.name}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </div>
                    ) : null}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-foreground">{item.name}</p>
                      <p className="truncate text-xs text-primary">
                        {[item.position, item.company].filter(Boolean).join(' · ')}
                      </p>
                    </div>
                  </div>
                  <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </button>
              );
            })}
          </div>
        ) : null}
      </div>
    </Section>
  );
}
