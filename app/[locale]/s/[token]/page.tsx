import type { Metadata } from 'next';
import { CvPrintableView, type CvExportPayload } from '@/components/pdf/cv-templates';

export const metadata: Metadata = {
  title: 'Shared Document',
  robots: { index: false, follow: false },
};

const API_BASE = process.env.API_ORIGIN || 'http://localhost:8787';

interface ShareLinkData {
  kind: 'document' | 'preset';
  label: string;
  expiresAt?: string | null;
  document?: { title: string; media?: { url: string } | null } | null;
  export?: CvExportPayload;
}

export default async function ShareTokenPage({
  params,
}: {
  params: Promise<{ locale: string; token: string }>;
}) {
  const { token } = await params;

  let status = 500;
  let payload: ShareLinkData | null = null;

  try {
    const res = await fetch(`${API_BASE.replace(/\/$/, '')}/v1/share/${encodeURIComponent(token)}`, {
      cache: 'no-store',
    });
    status = res.status;
    if (res.ok) {
      const json = (await res.json()) as { data: ShareLinkData };
      payload = json.data;
    }
  } catch {
    status = 500;
  }

  if (status === 410) {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <h1 className="text-2xl font-bold text-foreground">Share Link Expired (410)</h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          This custom CV/document link has expired or been deactivated by the owner.
        </p>
      </div>
    );
  }

  if (!payload) {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <h1 className="text-2xl font-bold text-foreground">Share Link Not Found</h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Please check the URL or request an updated share link.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 rounded-lg border border-border bg-card p-4">
        <div className="text-xs uppercase text-muted-foreground">Shared Portfolio View</div>
        <div className="mt-1 text-lg font-semibold text-foreground">{payload.label}</div>
      </div>

      {payload.kind === 'document' && payload.document?.media?.url ? (
        <div className="space-y-4">
          <a
            href={payload.document.media.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Open / Download {payload.document.title} (PDF)
          </a>
        </div>
      ) : payload.kind === 'preset' && payload.export ? (
        <CvPrintableView data={payload.export} />
      ) : null}
    </div>
  );
}
