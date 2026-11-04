'use client';

import { Menu, X } from 'lucide-react';
import { motion, useScroll, useSpring } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { CommandPalette } from '@/components/layout/command-palette';
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
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 32,
    restDelta: 0.001,
  });
  const initials = brandName
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

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

  // Highlight the in-page section currently crossing the middle of the viewport.
  const [activeId, setActiveId] = useState<string | null>(null);
  useEffect(() => {
    // Watch every section so the highlight clears over sections without a nav link.
    const els = Array.from(document.querySelectorAll<HTMLElement>('section[id]'));
    if (els.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

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
            <span
              aria-hidden="true"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary font-heading text-sm font-black tracking-tight text-primary-foreground shadow-md shadow-primary/30 transition-transform group-hover:scale-105 group-hover:-rotate-6"
            >
              {initials}
            </span>
            <span className="sr-only sm:not-sr-only">{brandName}</span>
          </Link>

          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-1 rounded-full border border-border/80 bg-muted/50 p-1.5 backdrop-blur-md lg:flex"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={item.href === `/#${activeId}` ? 'true' : undefined}
                className={cn(
                  'rounded-full px-3.5 py-1.5 text-xs font-medium transition-all hover:bg-background hover:text-foreground hover:shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  item.href === `/#${activeId}`
                    ? 'bg-background text-primary shadow-xs'
                    : 'text-muted-foreground',
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <CommandPalette items={navItems} />
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

        <motion.div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-primary"
          style={{ scaleX: progress }}
        />

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
