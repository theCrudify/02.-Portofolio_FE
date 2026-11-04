import { Trophy } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { SpotlightCard } from '@/components/effects/spotlight-card';
import { Section } from '@/components/layout/section';
import { Badge } from '@/components/ui/badge';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { PublicAchievement, SupportedLocale } from '@/lib/api/types';
import { formatDate } from '@/lib/format';
import { cn } from '@/lib/utils';

export interface AchievementsSectionProps {
  achievements: PublicAchievement[];
  locale: SupportedLocale;
  muted?: boolean;
}

export function AchievementsSection({
  achievements,
  locale,
  muted,
}: AchievementsSectionProps) {
  const t = useTranslations('sections.achievements');
  if (!achievements || achievements.length === 0) return null;

  return (
    <Section id="achievements" eyebrow={t('eyebrow')} title={t('title')} muted={muted}>
      <div
        className={cn(
          'grid grid-cols-1 gap-6',
          achievements.length === 1 ? 'lg:grid-cols-1' : 'md:grid-cols-2',
        )}
      >
        {achievements.map((ach) => (
          <SpotlightCard key={ach.id} className="group overflow-hidden">
            {ach.certificate ? (
              <div className="relative aspect-16/7 w-full overflow-hidden border-b border-border/60 bg-muted">
                <Image
                  src={ach.certificate.url}
                  alt={ach.certificate.alt || ach.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            ) : null}
            <CardHeader className="bg-dot-matrix space-y-2 border-b border-border/60 pb-4">
              <div className="flex items-center justify-between gap-2">
                {ach.rank ? (
                  <Badge variant="default" className="gap-1.5">
                    <Trophy className="h-3 w-3" />
                    <span>{ach.rank}</span>
                  </Badge>
                ) : (
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
                    <Trophy className="h-4 w-4" />
                  </span>
                )}
                {ach.date ? (
                  <span className="rounded-full border border-border bg-background/85 px-3 py-1 font-mono text-xs text-muted-foreground">
                    {formatDate(ach.date, locale)}
                  </span>
                ) : null}
              </div>
              <CardTitle className="pt-1 text-xl">{ach.title}</CardTitle>
              {ach.issuer || ach.eventName ? (
                <p className="text-sm font-semibold text-primary">
                  {[ach.issuer, ach.eventName].filter(Boolean).join(' · ')}
                </p>
              ) : null}
            </CardHeader>
            {ach.description ? (
              <CardContent className="pt-4">
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {ach.description}
                </p>
              </CardContent>
            ) : null}
          </SpotlightCard>
        ))}
      </div>
    </Section>
  );
}
