import { draftMode } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { error: { code: 'UNAUTHENTICATED', message: 'Admin session required for draft preview.' } },
      { status: 401 }
    );
  }

  const slug = req.nextUrl.searchParams.get('slug') ?? '';
  const disable = req.nextUrl.searchParams.get('disable') === 'true';
  const dm = await draftMode();

  if (disable) {
    dm.disable();
  } else {
    dm.enable();
  }

  const target = slug ? `/en/projects/${encodeURIComponent(slug)}` : '/en';
  return NextResponse.redirect(new URL(target, req.url));
}
