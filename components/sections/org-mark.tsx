import Image from 'next/image';
import type { PublicOrganization } from '@/lib/api/types';
import { cn } from '@/lib/utils';

/** "HIMAVO Micro IT" -> "HM". */
export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter((w) => /^[\p{L}\p{N}]/u.test(w))
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('');
}

/** Organization logo, or its initials on a tinted tile when it has none. */
export function OrgMark({
  organization,
  fallback,
  className,
}: {
  organization: PublicOrganization | null | undefined;
  /** Name used for the initials when there is no organization. */
  fallback?: string;
  className?: string;
}) {
  const name = organization?.name ?? fallback ?? '';
  const box = cn(
    'relative inline-flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-background',
    className,
  );
  if (organization?.logo) {
    return (
      <span className={box}>
        <Image
          src={organization.logo.url}
          alt={organization.logo.alt || name}
          fill
          sizes="64px"
          className="object-contain p-1.5"
        />
      </span>
    );
  }
  return (
    <span
      aria-hidden="true"
      className={cn(box, 'border-primary/25 bg-primary/10 font-heading text-base font-bold text-primary')}
    >
      {initials(name)}
    </span>
  );
}
