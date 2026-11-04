'use client';

import { Menu, Terminal, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Container } from '@/components/layout/container';
import { LocaleSwitcher } from '@/components/layout/locale-switcher';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';

export interface NavbarProps {
  brandName: string;
}

export function Navbar({ brandName }: NavbarProps) {
  const t = useTranslations('nav');
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { href: '/#about', label: t('about') },
    { href: '/projects', label: t('projects') },
    { href: '/#skills', label: t('skills') },
    { href: '/#experience', label: t('experience') },
    { href: '/certifications', label: t('certifications') },
    { href: '/cv', label: t('cv') },
    { href: '/#contact', label: t('contact') },
  ];

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
      >
        {t('skipToContent')}
      </a>
      <header
        className={cn(
          'no-print sticky top-0 z-40 w-full border-b transition-all duration-200',
          scrolled
            ? 'border-border bg-background/90 shadow-sm backdrop-blur-xl'
            : 'border-border/60 bg-background/75 backdrop-blur-md',
        )}
      >
        <Container className="flex h-18 items-center justify-between gap-4">
          <Link
            href="/"
            className="group inline-flex items-center gap-2.5 font-heading text-lg font-bold tracking-tight text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary transition-transform group-hover:scale-105">
              <Terminal className="h-4 w-4" />
            </span>
            <span>{brandName}</span>
          </Link>

          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-1 rounded-full border border-border/80 bg-muted/50 p-1.5 backdrop-blur-md lg:flex"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:bg-background hover:text-foreground hover:shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <LocaleSwitcher label={t('switchLanguage')} />
            <ThemeToggle label={t('toggleTheme')} />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label={mobileOpen ? t('closeMenu') : t('menu')}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((prev) => !prev)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </Container>

        {mobileOpen ? (
          <div className="border-b border-border bg-background/95 px-4 py-4 backdrop-blur-xl lg:hidden">
            <nav aria-label="Mobile navigation" className="flex flex-col space-y-1.5">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3.5 py-2.5 text-sm font-medium text-foreground hover:bg-accent"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        ) : null}
      </header>
    </>
  );
}
