'use client';

export type AnalyticsEventType =
  | 'page_view'
  | 'link_click'
  | 'cv_download'
  | 'export_download'
  | 'share_open'
  | 'video_play';

export interface TrackEventPayload {
  path?: string;
  locale?: 'en' | 'id';
  projectSlug?: string;
  target?: string;
  referrer?: string;
  utmSource?: string;
  utmCampaign?: string;
}

function getStoredUtm(): { utmSource?: string; utmCampaign?: string } {
  if (typeof window === 'undefined') return {};
  try {
    const params = new URLSearchParams(window.location.search);
    const urlSource = params.get('utm_source');
    const urlCampaign = params.get('utm_campaign');
    if (urlSource) {
      sessionStorage.setItem('pf_utm_source', urlSource.slice(0, 60));
    }
    if (urlCampaign) {
      sessionStorage.setItem('pf_utm_campaign', urlCampaign.slice(0, 60));
    }
    const utmSource = sessionStorage.getItem('pf_utm_source') ?? undefined;
    const utmCampaign = sessionStorage.getItem('pf_utm_campaign') ?? undefined;
    return { utmSource, utmCampaign };
  } catch {
    return {};
  }
}

function getExternalReferrer(): string | undefined {
  if (typeof document === 'undefined' || !document.referrer) {
    return undefined;
  }
  try {
    const refUrl = new URL(document.referrer);
    if (refUrl.host === window.location.host) {
      return undefined;
    }
    return document.referrer.slice(0, 300);
  } catch {
    return undefined;
  }
}

export function track(type: AnalyticsEventType, data: TrackEventPayload = {}): void {
  if (typeof window === 'undefined') return;

  const utm = getStoredUtm();
  const payload = {
    type,
    path: data.path ?? window.location.pathname,
    locale:
      data.locale ??
      (window.location.pathname.startsWith('/id') ? ('id' as const) : ('en' as const)),
    ...(data.projectSlug ? { projectSlug: data.projectSlug } : {}),
    ...(data.target ? { target: data.target.slice(0, 60) } : {}),
    ...(data.referrer ?? getExternalReferrer()
      ? { referrer: (data.referrer ?? getExternalReferrer())!.slice(0, 300) }
      : {}),
    ...(data.utmSource ?? utm.utmSource ? { utmSource: data.utmSource ?? utm.utmSource } : {}),
    ...(data.utmCampaign ?? utm.utmCampaign
      ? { utmCampaign: data.utmCampaign ?? utm.utmCampaign }
      : {}),
  };

  const jsonBody = JSON.stringify(payload);
  const endpoint = '/api/v1/events';

  try {
    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      const blob = new Blob([jsonBody], { type: 'application/json' });
      const queued = navigator.sendBeacon(endpoint, blob);
      if (queued) return;
    }
    void fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: jsonBody,
      keepalive: true,
    });
  } catch {
    // Ignore tracking network failures
  }
}

