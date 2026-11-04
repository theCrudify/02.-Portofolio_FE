import fs from 'node:fs';
import path from 'node:path';
import { NextRequest } from 'next/server';
import { describe, expect, it, vi } from 'vitest';
import { POST as revalidatePost } from '@/app/api/revalidate/route';
import { getFontPairClass } from '@/lib/fonts';

vi.mock('next/cache', () => ({
  revalidateTag: vi.fn(),
}));

function getAllFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllFiles(full));
    } else if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) {
      files.push(full);
    }
  }
  return files;
}

describe('T05 · Web Foundation & Design System', () => {
  it('maps fontPair setting to expected CSS class', () => {
    expect(getFontPairClass('geist')).toBe('font-pair-geist');
    expect(getFontPairClass('inter')).toBe('font-pair-inter');
    expect(getFontPairClass('serif-accent')).toBe('font-pair-serif-accent');
    expect(getFontPairClass(undefined)).toBe('font-pair-geist');
  });

  it('POST /api/revalidate rejects invalid secret with 401 and accepts valid secret', async () => {
    process.env.REVALIDATE_SECRET = 'test-revalidate-secret';

    const badReq = new NextRequest('http://localhost:3000/api/revalidate', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-revalidate-secret': 'wrong-secret',
      },
      body: JSON.stringify({ tags: ['site'] }),
    });
    const badRes = await revalidatePost(badReq);
    expect(badRes.status).toBe(401);

    const goodReq = new NextRequest('http://localhost:3000/api/revalidate', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-revalidate-secret': 'test-revalidate-secret',
      },
      body: JSON.stringify({ tags: ['site', 'projects'] }),
    });
    const goodRes = await revalidatePost(goodReq);
    expect(goodRes.status).toBe(200);
    const json = (await goodRes.json()) as { data: { revalidated: string[] } };
    expect(json.data.revalidated).toEqual(['site', 'projects']);
  });

  it('contains no hardcoded hex colors in components/', () => {
    const componentsDir = path.resolve(__dirname, '../components');
    const files = getAllFiles(componentsDir);
    const hexRegex = /#[0-9a-fA-F]{3,8}\b/;

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf-8');
      expect(hexRegex.test(content), `Found hex color in ${file}`).toBe(false);
    }
  });
});
