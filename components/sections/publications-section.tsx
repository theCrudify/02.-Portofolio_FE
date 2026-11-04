import { BookOpen, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { SpotlightCard } from '@/components/effects/spotlight-card';
import { Section } from '@/components/layout/section';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import type { PublicPublication, SupportedLocale } from '@/lib/api/types';
import { formatDate } from '@/lib/format';
import { cn } from '@/lib/utils';
import { PORTFOLIO_SHOWCASE_IMAGES } from '@/lib/visuals';

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
        {publications.map((pub, idx) => {
          const visual =
            PORTFOLIO_SHOWCASE_IMAGES[(idx + 3) % PORTFOLIO_SHOWCASE_IMAGES.length] ??
            PORTFOLIO_SHOWCASE_IMAGES[0]!;

          return (
            <SpotlightCard key={pub.id} className="group flex flex-col justify-between overflow-hidden">
              <div>
                <div className="relative aspect-16/7 w-full overflow-hidden border-b border-border/80 bg-muted">
                  <Image
                    src={visual.url}
                    alt={pub.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/45 to-transparent" />
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <Badge variant="secondary" className="gap-1.5 capitalize">
                      <BookOpen className="h-3 w-3 text-primary" />
                      <span>{pub.type}</span>
                    </Badge>
                    {pub.date ? (
                      <span className="rounded-full bg-background/85 px-2.5 py-1 font-mono text-xs text-foreground backdrop-blur-xs">
                        {formatDate(pub.date, locale)}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="space-y-3 p-6">
                  {pub.venue ? (
                    <p className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">
                      {pub.venue}
                    </p>
                  ) : null}

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
              </div>

              {pub.url ? (
                <div className="border-t border-border/70 px-6 py-3">
                  <a
                    href={pub.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'w-full')}
                  >
                    <span>Read Publication</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              ) : null}
            </SpotlightCard>
          );
        })}
      </div>
    </Section>
  );
}
