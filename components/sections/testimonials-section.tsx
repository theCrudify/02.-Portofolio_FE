'use client';

import { ChevronLeft, ChevronRight, Quote, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { SpotlightCard } from '@/components/effects/spotlight-card';
import { Section } from '@/components/layout/section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { PublicTestimonial } from '@/lib/api/types';
import { cn } from '@/lib/utils';
import { DEFAULT_AVATAR_URI, PORTFOLIO_SHOWCASE_IMAGES } from '@/lib/visuals';

export interface TestimonialsSectionProps {
  testimonials: PublicTestimonial[];
  muted?: boolean;
}

export function TestimonialsSection({ testimonials, muted }: TestimonialsSectionProps) {
  const t = useTranslations('sections.testimonials');
  const [index, setIndex] = useState(0);

  if (!testimonials || testimonials.length === 0) return null;

  const current = testimonials[index] ?? testimonials[0]!;
  const currentAvatar =
    current.avatar?.url ??
    PORTFOLIO_SHOWCASE_IMAGES[index % PORTFOLIO_SHOWCASE_IMAGES.length]?.url ??
    DEFAULT_AVATAR_URI;

  return (
    <Section id="testimonials" eyebrow={t('eyebrow')} title={t('title')} muted={muted}>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left 7 Columns: Featured Spotlight Endorsement */}
        <SpotlightCard className="flex flex-col justify-between p-6 md:p-8 lg:col-span-7">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
                <Quote className="h-5 w-5" />
              </span>
              <Badge variant="secondary" className="gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-success" />
                <span>Verified Endorsement {index + 1}/{testimonials.length}</span>
              </Badge>
            </div>

            <blockquote className="font-heading text-lg leading-relaxed text-foreground md:text-2xl">
              &ldquo;{current.quote}&rdquo;
            </blockquote>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
            <div className="flex items-center gap-3.5">
              <div className="relative h-12 w-12 overflow-hidden rounded-full border border-primary/40 bg-muted">
                <Image
                  src={currentAvatar}
                  alt={current.name}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
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

        {/* Right 5 Columns: Interactive Endorsement Wall */}
        <div className="space-y-3 lg:col-span-5">
          {testimonials.map((item, idx) => {
            const active = idx === index;
            const thumbUrl =
              item.avatar?.url ??
              PORTFOLIO_SHOWCASE_IMAGES[(idx + 2) % PORTFOLIO_SHOWCASE_IMAGES.length]?.url ??
              DEFAULT_AVATAR_URI;

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
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                    <Image
                      src={thumbUrl}
                      alt={item.name}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-foreground">{item.name}</p>
                    <p className="truncate text-xs text-primary">
                      {[item.position, item.company].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                  <Badge variant={active ? 'default' : 'outline'} className="font-mono text-xs">
                    0{idx + 1}
                  </Badge>
                </div>
                <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
