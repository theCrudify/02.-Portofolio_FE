import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Container({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'mx-auto w-full max-w-[1580px] px-4 sm:px-8 md:px-10 lg:px-12 xl:px-16',
        className,
      )}
      {...props}
    />
  );
}
