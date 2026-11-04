import { ArrowUpRight, Terminal } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Container } from '@/components/layout/container';
import { SocialIcon } from '@/components/ui/social-icon';
import { Link } from '@/i18n/routing';
import type { PublicProfile } from '@/lib/api/types';

export interface FooterProps {
  name: string;
  socials?: PublicProfile['socials'];
  updatedAt?: string;
}

export function Footer({ name, socials = [], updatedAt }: FooterProps) {
  const t = useTranslations('footer');
  const year = new Date().getFullYear();
  const formattedDate = updatedAt ? updatedAt.slice(0, 10) : null;

  const socialEntries = socials.filter((s) => s.url.length > 0);

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
          {socialEntries.map(({ platform, url }) => (
            <a
              key={platform.code}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium capitalize text-foreground transition-all hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <SocialIcon
                platform={platform}
                className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:scale-110"
              />
              <span>{platform.label}</span>
              <ArrowUpRight className="h-3 w-3 opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
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
