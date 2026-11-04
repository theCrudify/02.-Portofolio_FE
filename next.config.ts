import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const apiOrigin = process.env.API_ORIGIN || 'http://localhost:8787';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Cloudinary resizes its own images (free credits) instead of Vercel's capped optimizer.
    loader: 'custom',
    loaderFile: './lib/cloudinary-loader.ts',
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
      { protocol: 'https', hostname: 'i.vimeocdn.com' },
      { protocol: 'https', hostname: 'cdn.loom.com' },
    ],
  },
  async rewrites() {
    return [
      // health first: the catch-all below would otherwise send it to /v1/health (404).
      {
        source: '/api/v1/health',
        destination: `${apiOrigin}/health`,
      },
      {
        source: '/api/v1/:path*',
        destination: `${apiOrigin}/v1/:path*`,
      },
    ];
  },
  async headers() {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://res.cloudinary.com https://i.ytimg.com https://i.vimeocdn.com https://cdn.loom.com",
      "media-src 'self' https://res.cloudinary.com",
      "frame-src 'self' https://www.youtube-nocookie.com https://player.vimeo.com https://www.loom.com https://challenges.cloudflare.com",
      "connect-src 'self' https://api.cloudinary.com https://challenges.cloudflare.com https://*.ingest.sentry.io",
      "font-src 'self' data:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ');

    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
