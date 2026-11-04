import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from '@/i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // Protect /admin/* routes except /admin/login (T08)
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login' || pathname.startsWith('/admin/login/')) {
      return NextResponse.next();
    }
    const sessionCookie = request.cookies.get('pf_session');
    if (!sessionCookie?.value) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  const response = intlMiddleware(request);

  // Suggest Bahasa Indonesia banner on first visit to / if Accept-Language contains id (T07)
  if (
    pathname === '/' &&
    !request.cookies.has('NEXT_LOCALE') &&
    (request.headers.get('accept-language') ?? '').toLowerCase().includes('id')
  ) {
    response.headers.set('x-suggest-locale', 'id');
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|apple-icon|.*\\..*).*)'],
};

