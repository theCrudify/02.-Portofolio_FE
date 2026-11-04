'use client';

import { ArrowRight, Command, Languages, SunMoon } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Dialog } from '@/components/ui/dialog';
import { usePathname, useRouter } from '@/i18n/routing';
import { cn } from '@/lib/utils';

export interface CommandItem {
  href: string;
  label: string;
}

export interface CommandPaletteProps {
  items: CommandItem[];
}

interface Action {
  id: string;
  label: string;
  icon: typeof ArrowRight;
  run: () => void;
}

/** Case- and accent-insensitive substring match. */
export function matchesQuery(label: string, query: string): boolean {
  const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  return norm(label).includes(norm(query.trim()));
}

export function CommandPalette({ items }: CommandPaletteProps) {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    setCursor(0);
  }, [open]);

  const actions = useMemo<Action[]>(() => {
    const nextLocale = locale === 'en' ? 'id' : 'en';
    return [
      ...items.map((item) => ({
        id: item.href,
        label: item.label,
        icon: ArrowRight,
        run: () => router.push(item.href),
      })),
      {
        id: 'theme',
        label: t('toggleTheme'),
        icon: SunMoon,
        run: () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'),
      },
      {
        id: 'locale',
        label: t('switchLanguage'),
        icon: Languages,
        run: () => {
          document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;
          router.replace(pathname, { locale: nextLocale });
        },
      },
    ];
  }, [items, locale, pathname, resolvedTheme, router, setTheme, t]);

  const results = actions.filter((a) => matchesQuery(a.label, query));
  const active = Math.min(cursor, Math.max(results.length - 1, 0));

  const runAt = (index: number) => {
    const action = results[index];
    if (!action) return;
    setOpen(false);
    action.run();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t('commandPalette')}
        aria-keyshortcuts="Control+K Meta+K"
        className="hidden h-9 items-center gap-1.5 rounded-full border border-border/80 bg-muted/60 px-3 font-mono text-xs text-muted-foreground shadow-2xs transition-colors hover:border-primary/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:inline-flex"
      >
        <Command className="h-3.5 w-3.5" />
        <span>K</span>
      </button>

      {/* Portal: the header's backdrop-filter would otherwise trap this fixed overlay. */}
      {open
        ? createPortal(
            <Dialog
              open={open}
              onOpenChange={setOpen}
              title={t('commandPalette')}
              className="max-w-md rounded-2xl p-4"
            >
              <input
                autoFocus
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setCursor(0);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setCursor((c) =>
                      results.length
                        ? (Math.min(c, results.length - 1) + 1) % results.length
                        : 0,
                    );
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setCursor((c) =>
                      results.length
                        ? (Math.min(c, results.length - 1) - 1 + results.length) %
                          results.length
                        : 0,
                    );
                  } else if (e.key === 'Enter') {
                    e.preventDefault();
                    runAt(active);
                  }
                }}
                placeholder={t('commandPlaceholder')}
                aria-label={t('commandPlaceholder')}
                aria-controls="command-results"
                aria-activedescendant={
                  results[active] ? `cmd-${results[active].id}` : undefined
                }
                role="combobox"
                aria-expanded="true"
                className="h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <ul
                id="command-results"
                role="listbox"
                className="mt-3 max-h-80 space-y-1 overflow-y-auto"
              >
                {results.length === 0 ? (
                  <li className="px-3 py-6 text-center text-sm text-muted-foreground">
                    {t('commandEmpty')}
                  </li>
                ) : (
                  results.map((action, i) => (
                    <li
                      key={action.id}
                      id={`cmd-${action.id}`}
                      role="option"
                      aria-selected={i === active}
                      onMouseEnter={() => setCursor(i)}
                      onClick={() => runAt(i)}
                      className={cn(
                        'flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors',
                        i === active
                          ? 'bg-primary text-primary-foreground'
                          : 'text-foreground',
                      )}
                    >
                      <action.icon className="h-4 w-4 shrink-0" />
                      <span>{action.label}</span>
                    </li>
                  ))
                )}
              </ul>
            </Dialog>,
            document.body,
          )
        : null}
    </>
  );
}
