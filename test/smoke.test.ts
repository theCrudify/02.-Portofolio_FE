import { describe, expect, it } from 'vitest';
import { cn } from '@/lib/utils';

describe('portfolio-web scaffold', () => {
  it('merges class names properly', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
  });
});

