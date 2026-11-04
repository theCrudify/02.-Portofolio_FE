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
  const formattedDate = updatedAt ? updatedAt.slice(0, 10) : new Date().toISOString().slice(0, 10);

  const socialEntries = Object.entries(socials).filter(
    ([, url]) => typeof url === 'string' && url.length > 0,
  );

  return (
    <footer className="no-print border-t border-border bg-background py-10 text-sm text-muted-foreground">
      <Container className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div className="space-y-1">
          <p className="font-medium text-foreground">
            © {year} {name}. {t('rights')}
          </p>
          <p className="text-xs text-muted-foreground">
            {t('lastUpdated')}: {formattedDate}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {socialEntries.map(([platform, url]) => (
            <a
              key={platform}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="capitalize transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {platform}
            </a>
          ))}
          <Link
            href="/privacy"
            className="transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {t('privacy')}
          </Link>
        </div>
      </Container>
    </footer>
  );
}

