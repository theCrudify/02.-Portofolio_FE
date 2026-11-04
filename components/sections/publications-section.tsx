import { ExternalLink } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Section } from '@/components/layout/section';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
      <div className="space-y-4">
        {publications.map((pub) => (
          <Card key={pub.id}>
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="capitalize">
                    {pub.type}
                  </Badge>
                  {pub.venue ? (
                    <span className="text-sm font-medium text-primary">{pub.venue}</span>
                  ) : null}
                </div>
                {pub.date ? (
                  <span className="font-mono text-xs text-muted-foreground">
                    {formatDate(pub.date, locale)}
                  </span>
                ) : null}
              </div>
              <CardTitle className="mt-2">
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
              </CardTitle>
            </CardHeader>
            {pub.summary ? (
              <CardContent>
                <p className="max-w-[65ch] text-sm text-muted-foreground">{pub.summary}</p>
              </CardContent>
            ) : null}
          </Card>
        ))}
      </div>
    </Section>
  );
}

