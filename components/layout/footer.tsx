import { ArrowUpRight, Cpu, Globe, ShieldCheck, Terminal } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Container } from '@/components/layout/container';
import { Badge } from '@/components/ui/badge';
import { Link } from '@/i18n/routing';
import { PORTFOLIO_SHOWCASE_IMAGES } from '@/lib/visuals';

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
    <footer className="no-print relative overflow-hidden border-t border-border bg-card/85 py-14 text-sm text-muted-foreground backdrop-blur-md">
      <Container className="space-y-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-5">
            <div className="inline-flex items-center gap-2.5">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
                <Terminal className="h-4 w-4" />
              </span>
              <div>
                <p className="font-heading text-lg font-bold text-foreground">{name}</p>
                <p className="font-mono text-xs text-muted-foreground">
                  FULLSTACK &amp; DISTRIBUTED EDGE ARCHITECTURE
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <Badge variant="secondary" className="gap-1.5">
                <Cpu className="h-3 w-3 text-primary" />
                <span>Zero-JSON Query Engine</span>
              </Badge>
              <Badge variant="outline" className="gap-1.5">
                <ShieldCheck className="h-3 w-3 text-success" />
                <span>WCAG AA Contrast</span>
              </Badge>
              <Badge variant="outline" className="gap-1.5">
                <Globe className="h-3 w-3 text-primary" />
                <span>Edge Cached · ETag 304</span>
              </Badge>
            </div>

            <p className="text-xs text-muted-foreground">
              © {year} {name}. {t('rights')} · {t('lastUpdated')}:{' '}
              <span className="font-mono text-foreground">{formattedDate}</span>
            </p>
          </div>

          <div className="space-y-3 lg:col-span-3">
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground">
              Channels &amp; Verification
            </p>
            <div className="flex flex-wrap gap-2">
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
                href="/projects"
                className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <span>All Projects</span>
                <ArrowUpRight className="h-3 w-3" />
              </Link>
              <Link
                href="/certifications"
                className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <span>Credentials</span>
                <ArrowUpRight className="h-3 w-3" />
              </Link>
              <Link
                href="/privacy"
                className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <span>{t('privacy')}</span>
              </Link>
            </div>
          </div>

          <div className="space-y-3 lg:col-span-4">
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground">
              Visual Architecture Reel
            </p>
            <div className="grid grid-cols-4 gap-2">
              {PORTFOLIO_SHOWCASE_IMAGES.slice(0, 4).map((img) => (
                <Link
                  key={img.id}
                  href="/projects"
                  className="group relative aspect-video overflow-hidden rounded-md border border-border bg-muted"
                >
                  <Image
                    src={img.url}
                    alt={img.alt}
                    fill
                    sizes="96px"
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
