import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BreakdownList } from '@/components/admin/breakdown-list';
import { normalizeAnalytics } from '@/lib/admin/analytics';

describe('normalizeAnalytics', () => {
  it('accepts the older API payload without crashing the breakdown lists', () => {
    const legacy = {
      range: '7d' as const,
      totals: { views: 5, uniqueVisitors: 3, cvDownloads: 1, contactSubmissions: 2 },
      series: [{ date: '2026-11-27', views: 5, visitors: 3 }],
      topPaths: [{ path: '/en', count: 5 }],
    };
    const data = normalizeAnalytics(legacy);
    expect(data.totals).toMatchObject({ views: 5, visitors: 3, messages: 2, linkClicks: 0 });
    expect(data.previous).toBeNull();
    expect(data.since).toBe('2026-11-27');
    render(<BreakdownList title="Traffic Sources" items={data.referrers} />);
    expect(screen.getByText('No data for this period yet.')).toBeTruthy();
  });
});
