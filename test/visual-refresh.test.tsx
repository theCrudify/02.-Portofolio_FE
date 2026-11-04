import { describe, expect, it } from 'vitest';
import { matchesQuery } from '@/components/layout/command-palette';
import { simpleIconSlug } from '@/components/project/tech-logo';
import { podiumPlace } from '@/components/sections/achievements-section';

describe('simpleIconSlug', () => {
  it.each([
    ['Node.js', 'nodedotjs'],
    ['Express.js', 'expressdotjs'],
    ['GitHub Actions', 'githubactions'],
    ['C++', 'cplusplus'],
    ['PostgreSQL', 'postgresql'],
  ])('%s -> %s', (name, slug) => {
    expect(simpleIconSlug(name)).toBe(slug);
  });
});

describe('podiumPlace', () => {
  it.each([
    ['1st', 1],
    ['2nd', 2],
    ['Juara 3', 3],
    ['4th', null],
    ['Finalist', null],
    [null, null],
  ] as const)('%s -> %s', (rank, place) => {
    expect(podiumPlace(rank)).toBe(place);
  });
});

describe('matchesQuery', () => {
  it('ignores case, accents and surrounding spaces', () => {
    expect(matchesQuery('Pengalaman', ' penga ')).toBe(true);
    expect(matchesQuery('Résumé', 'resume')).toBe(true);
    expect(matchesQuery('Kontak', 'proyek')).toBe(false);
    expect(matchesQuery('Kontak', '')).toBe(true);
  });
});
