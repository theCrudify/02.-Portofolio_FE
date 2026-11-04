'use client';

import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Section } from '@/components/layout/section';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { PublicTestimonial } from '@/lib/api/types';

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
      <Card className="mx-auto max-w-3xl">
        <CardContent className="space-y-6 p-6 md:p-8">
          <Quote className="h-8 w-8 text-primary opacity-40" />
          <blockquote className="text-lg leading-relaxed text-foreground md:text-xl">
            &ldquo;{current.quote}&rdquo;
          </blockquote>
          <div className="flex items-center justify-between gap-4 border-t border-border pt-4">
            <div>
              <p className="font-semibold text-foreground">{current.name}</p>
              <p className="text-sm text-muted-foreground">
                {[current.position, current.company, current.relationship]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
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
        </CardContent>
      </Card>
    </Section>
  );
}
