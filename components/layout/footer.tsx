import { ArrowUpRight, Terminal } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Container } from '@/components/layout/container';
import { Link } from '@/i18n/routing';

export interface FooterProps {
  name: string;
  socials?: Record<string, string>;
  updatedAt?: string;
}

export function Footer({ name, socials = {}, updatedAt }: FooterProps) {
  const t = useTranslations('footer');
  const year = new Date().getFullYear();
  const formattedDate = updatedAt ? updatedAt.slice(0, 10) : null;

  const socialEntries = Object.entries(socials).filter(
    ([, url]) => typeof url === 'string' && url.length > 0,
  );

  return (
    <footer className="no-print relative overflow-hidden border-t border-border bg-card/85 py-12 text-sm text-muted-foreground backdrop-blur-md">
      <Container className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
            <Terminal className="h-4 w-4" />
          </span>
          <div className="space-y-0.5">
            <p className="font-medium text-foreground">
              © {year} {name}. {t('rights')}
            </p>
            {formattedDate ? (
              <p className="text-xs text-muted-foreground">
                {t('lastUpdated')}: <span className="font-mono text-foreground">{formattedDate}</span>
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {socialEntries.map(([platform, url]) => (
            <a
              key={platform}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium capitalize text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span>{platform}</span>
              <ArrowUpRight className="h-3 w-3" />
            </a>
          ))}
          <Link
            href="/privacy"
            className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span>{t('privacy')}</span>
          </Link>
        </div>
      </Container>
    </footer>
  );
}
