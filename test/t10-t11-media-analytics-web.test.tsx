import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import cloudinaryLoader from '@/lib/cloudinary-loader';
import { StatCard } from '@/components/admin/stat-card';
import { ViewsChart } from '@/components/admin/views-chart';

describe('T10 & T11 · Media Loader & Analytics Web Components', () => {
  it('cloudinaryLoader injects f_auto,c_limit,w_{width},q_auto into Cloudinary upload URLs', () => {
    const out = cloudinaryLoader({
      src: 'https://res.cloudinary.com/demo/image/upload/v1234/sample.jpg',
      width: 800,
    });
    expect(out).toBe(
      'https://res.cloudinary.com/demo/image/upload/f_auto,c_limit,w_800,q_auto/v1234/sample.jpg'
    );

    const external = cloudinaryLoader({
      src: 'https://i.ytimg.com/vi/abc/hqdefault.jpg',
      width: 400,
    });
    expect(external).toBe('https://i.ytimg.com/vi/abc/hqdefault.jpg');
  });

  it('StatCard and ViewsChart render analytics metrics and bars properly', () => {
    render(
      <div>
        <StatCard label="Total Views" value={1240} subtext="+12% vs last month" />
        <ViewsChart
          series={[
            { date: '2026-04-09', views: 50, visitors: 32 },
            { date: '2026-04-10', views: 85, visitors: 60 },
          ]}
        />
      </div>
    );
    expect(screen.getByText('Total Views')).toBeTruthy();
    expect(screen.getByText('1240')).toBeTruthy();
    expect(screen.getByText('04-09')).toBeTruthy();
    expect(screen.getByText('04-10')).toBeTruthy();
  });
});
