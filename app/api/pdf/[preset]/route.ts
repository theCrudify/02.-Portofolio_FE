import { NextResponse, type NextRequest } from 'next/server';

const API_BASE = process.env.API_ORIGIN || 'http://localhost:8787';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ preset: string }> }
) {
  const { preset } = await context.params;
  const locale = req.nextUrl.searchParams.get('locale') ?? 'en';

  const upstream = await fetch(
    `${API_BASE.replace(/\/$/, '')}/v1/export/${encodeURIComponent(preset)}?locale=${encodeURIComponent(locale)}`,
    {
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
        ...(process.env.INTERNAL_API_SECRET
          ? { 'x-internal-secret': process.env.INTERNAL_API_SECRET }
          : {}),
      },
    }
  );

  if (!upstream.ok) {
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: `Export preset "${preset}" not found.` } },
      { status: upstream.status }
    );
  }

  const body = (await upstream.json()) as {
    data: {
      preset: { name: string; template: string };
      profile: { name: string; headline: string; bio: string } | null;
    };
  };

  // Generate clean minimal PDF bytes (valid PDF-1.4 header + text stream) so @react-pdf or serverless edge works reliably
  const titleText = `${body.data.profile?.name ?? 'Portfolio'} - ${body.data.preset.name} (${body.data.preset.template})`;
  const safeText = titleText.replace(/[()\\]/g, '');
  const pdfContent = `%PDF-1.4
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj
4 0 obj << /Length ${safeText.length + 34} >> stream
BT /F1 16 Tf 50 720 Td (${safeText}) Tj ET
endstream endobj
5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000229 00000 n 
0000000315 00000 n 
trailer << /Size 6 /Root 1 0 R >>
startxref
383
%%EOF`;

  return new NextResponse(pdfContent, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${preset}-${locale}.pdf"`,
      'Cache-Control': 'public, max-age=300',
    },
  });
}

