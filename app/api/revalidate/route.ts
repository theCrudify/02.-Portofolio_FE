import { revalidateTag } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const secret = request.headers.get('x-revalidate-secret');
  const expectedSecret = process.env.REVALIDATE_SECRET;

  if (!expectedSecret || !secret || secret !== expectedSecret) {
    return NextResponse.json(
      { error: { code: 'UNAUTHENTICATED', message: 'Invalid revalidation secret' } },
      { status: 401 },
    );
  }

  let body: { tags?: unknown } = {};
  try {
    body = (await request.json()) as { tags?: unknown };
  } catch {
    return NextResponse.json(
      { error: { code: 'VALIDATION_ERROR', message: 'Invalid JSON body' } },
      { status: 400 },
    );
  }

  const tags = Array.isArray(body.tags)
    ? body.tags.filter((t): t is string => typeof t === 'string' && t.trim().length > 0)
    : [];

  for (const tag of tags) {
    revalidateTag(tag);
  }

  return NextResponse.json({ data: { revalidated: tags } });
}
