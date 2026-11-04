import { describe, expect, it } from 'vitest';
import { simpleIconSlug } from '@/components/project/tech-logo';
import { podiumPlace } from '@/components/sections/achievements-section';

describe('simpleIconSlug', () => {
  it.each([
    ['Node.js', 'nodedotjs'],
    ['Express.js', 'expressdotjs'],
    ['GitHub Actions', 'githubactions'],
    ['.NET / C#', 'dotnet'],
    ['Prisma ORM', 'prisma'],
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
