import { BookOpen, ExternalLink } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { SpotlightCard } from '@/components/effects/spotlight-card';
import { Section } from '@/components/layout/section';
import { Badge } from '@/components/ui/badge';
import type { PublicPublication, SupportedLocale } from '@/lib/api/types';
import { formatDate } from '@/lib/format';

export interface PublicationsSectionProps {
  publications: PublicPublication[];
  locale: SupportedLocale;
  muted?: boolean;
}

export function PublicationsSection({
  publications,
  locale,
  muted,
}: PublicationsSectionProps) {
  const t = useTranslations('sections.publications');
  if (!publications || publications.length === 0) return null;

  return (
    <Section id="publications" eyebrow={t('eyebrow')} title={t('title')} muted={muted}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {publications.map((pub) => (
          <SpotlightCard key={pub.id} className="group flex flex-col justify-between overflow-hidden p-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="gap-1.5 capitalize">
                    <BookOpen className="h-3 w-3 text-primary" />
                    <span>{pub.type}</span>
                  </Badge>
                  {pub.venue ? (
                    <span className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">
                      {pub.venue}
                    </span>
                  ) : null}
                </div>
                {pub.date ? (
                  <span className="font-mono text-xs text-muted-foreground">
                    {formatDate(pub.date, locale)}
                  </span>
                ) : null}
              </div>

              <h3 className="font-heading text-lg font-bold leading-snug text-foreground md:text-xl">
                {pub.url ? (
                  <a
                    href={pub.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span>{pub.title}</span>
                    <ExternalLink className="h-4 w-4 shrink-0" />
                  </a>
                ) : (
                  pub.title
                )}
              </h3>

              {pub.summary ? (
                <p className="text-sm leading-relaxed text-muted-foreground">{pub.summary}</p>
              ) : null}
            </div>
          </SpotlightCard>
        ))}
      </div>
    </Section>
  );
}
