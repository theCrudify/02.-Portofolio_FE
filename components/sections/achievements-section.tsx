import { Trophy } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { SpotlightCard } from '@/components/effects/spotlight-card';
import { Section } from '@/components/layout/section';
import { Badge } from '@/components/ui/badge';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { PublicAchievement, SupportedLocale } from '@/lib/api/types';
import { formatDate } from '@/lib/format';
import { PORTFOLIO_SHOWCASE_IMAGES } from '@/lib/visuals';

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
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {achievements.map((ach, idx) => {
          const fallbackVisual =
            PORTFOLIO_SHOWCASE_IMAGES[(idx + 4) % PORTFOLIO_SHOWCASE_IMAGES.length];
          const certImg = ach.certificate?.url ?? fallbackVisual?.url ?? '';

          return (
            <SpotlightCard key={ach.id} className="group overflow-hidden">
              <div className="relative aspect-16/7 w-full overflow-hidden border-b border-border/60 bg-muted">
                <Image
                  src={certImg}
                  alt={ach.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <CardHeader className="space-y-2 pb-3">
                <div className="flex items-center justify-between gap-2">
                  {ach.rank ? (
                    <Badge variant="default" className="gap-1">
                      <Trophy className="h-3 w-3" />
                      <span>{ach.rank}</span>
                    </Badge>
                  ) : (
                    <span />
                  )}
                  {ach.date ? (
                    <span className="font-mono text-xs text-muted-foreground">
                      {formatDate(ach.date, locale)}
                    </span>
                  ) : null}
                </div>
                <CardTitle>{ach.title}</CardTitle>
                {ach.issuer || ach.eventName ? (
                  <p className="text-sm font-medium text-primary">
                    {[ach.issuer, ach.eventName].filter(Boolean).join(' · ')}
                  </p>
                ) : null}
              </CardHeader>
              {ach.description ? (
                <CardContent>
                  <p className="text-sm text-muted-foreground">{ach.description}</p>
                </CardContent>
              ) : null}
            </SpotlightCard>
          );
        })}
      </div>
    </Section>
  );
}
