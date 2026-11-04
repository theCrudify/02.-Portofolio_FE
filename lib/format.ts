import type { SupportedLocale } from '@/lib/api/types';

export function formatMonthYear(
  dateStr?: string | null,
  locale: SupportedLocale = 'en',
): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;

  return new Intl.DateTimeFormat(locale === 'id' ? 'id-ID' : 'en-US', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function formatDate(
  dateStr?: string | null,
  locale: SupportedLocale = 'en',
): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;

  return new Intl.DateTimeFormat(locale === 'id' ? 'id-ID' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function formatDuration(
  startDateStr: string,
  endDateStr?: string | null,
  locale: SupportedLocale = 'en',
  now: Date = new Date(),
): string {
  const start = new Date(startDateStr);
  const end = endDateStr ? new Date(endDateStr) : now;
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return '';
  }

  const totalMonths = Math.max(
    1,
    (end.getUTCFullYear() - start.getUTCFullYear()) * 12 +
      (end.getUTCMonth() - start.getUTCMonth()) +
      1,
  );

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  const parts: string[] = [];
  if (locale === 'id') {
    if (years > 0) parts.push(`${years} thn`);
    if (months > 0) parts.push(`${months} bln`);
  } else {
    if (years > 0) parts.push(`${years} ${years === 1 ? 'yr' : 'yrs'}`);
    if (months > 0) parts.push(`${months} ${months === 1 ? 'mo' : 'mos'}`);
  }

  return parts.join(' ');
}

export function formatPeriod(
  startDateStr?: string | null,
  endDateStr?: string | null,
  locale: SupportedLocale = 'en',
  now: Date = new Date(),
): string {
  if (!startDateStr) return '';
  const startFormatted = formatMonthYear(startDateStr, locale);
  const presentLabel = locale === 'id' ? 'Sekarang' : 'Present';
  const endFormatted = endDateStr ? formatMonthYear(endDateStr, locale) : presentLabel;
  const duration = formatDuration(startDateStr, endDateStr, locale, now);

  if (!duration) {
    return `${startFormatted} – ${endFormatted}`;
  }
  return `${startFormatted} – ${endFormatted} · ${duration}`;
}


/** A committee is a one-off event: without an end date show its month, not "start – Present". */
export function activityPeriod(
  act: { startDate: string | null; endDate: string | null; type: { code: string } },
  locale: SupportedLocale,
): string {
  if (!act.startDate) return '';
  if (!act.endDate && act.type.code === 'committee') return formatMonthYear(act.startDate, locale);
  return formatPeriod(act.startDate, act.endDate, locale);
}
