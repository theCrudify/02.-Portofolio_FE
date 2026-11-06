import { NextResponse, type NextRequest } from 'next/server';

/**
 * PDF download: the printable /cv page opens the browser's "Save as PDF" dialog, so the file
 * matches the web CV exactly. (This route used to return a one-line placeholder PDF.)
 * shortcut: the preset's template (one-page, ATS) is not applied; /cv picks the locale's preset.
 */
export function GET(req: NextRequest) {
  const locale = req.nextUrl.searchParams.get('locale') === 'id' ? 'id' : 'en';
  return NextResponse.redirect(new URL(`${locale === 'id' ? '/id' : ''}/cv?print=1`, req.url));
}
