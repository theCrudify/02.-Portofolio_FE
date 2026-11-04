export interface VisualShowcaseItem {
  id: string;
  url: string;
  alt: string;
  title: string;
  caption: string;
  category: 'ui' | 'architecture' | 'mobile' | 'analytics' | 'cloud' | 'community';
  aspect: 'wide' | 'square' | 'tall';
  width: number;
  height: number;
}

function svgDataUri(svgContent: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent.trim())}`;
}

/**
 * Generates a rich, high-resolution engineering / UI mockup illustration as an SVG Data URI.
 */
export function buildIllustrationUri(opts: {
  title: string;
  subtitle: string;
  badge: string;
  accentA: string;
  accentB: string;
  bgStart?: string;
  bgEnd?: string;
  variant?: 'dashboard' | 'architecture' | 'mobile' | 'terminal' | 'certificate' | 'portrait';
}): string {
  const bgStart = opts.bgStart ?? 'rgb(12, 16, 28)';
  const bgEnd = opts.bgEnd ?? 'rgb(22, 30, 52)';
  const variant = opts.variant ?? 'dashboard';

  let innerGraphic = '';

  if (variant === 'dashboard') {
    innerGraphic = `
      <rect x="70" y="130" width="660" height="310" rx="16" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.14)" stroke-width="1.5"/>
      <circle cx="96" cy="154" r="6" fill="rgb(239,68,68)"/>
      <circle cx="116" cy="154" r="6" fill="rgb(245,158,11)"/>
      <circle cx="136" cy="154" r="6" fill="rgb(16,185,129)"/>
      <line x1="70" y1="176" x2="730" y2="176" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
      <rect x="96" y="198" width="190" height="95" rx="10" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)"/>
      <rect x="304" y="198" width="190" height="95" rx="10" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)"/>
      <rect x="512" y="198" width="192" height="95" rx="10" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)"/>
      <path d="M112 268 L145 240 L180 252 L220 218 L264 226" fill="none" stroke="${opts.accentA}" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M320 270 L360 250 L398 258 L442 222 L476 214" fill="none" stroke="${opts.accentB}" stroke-width="3.5" stroke-linecap="round"/>
      <rect x="532" y="220" width="90" height="12" rx="6" fill="${opts.accentA}"/>
      <rect x="532" y="244" width="140" height="10" rx="5" fill="rgba(255,255,255,0.25)"/>
      <rect x="532" y="264" width="110" height="10" rx="5" fill="rgba(255,255,255,0.15)"/>
      <rect x="96" y="312" width="608" height="104" rx="12" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)"/>
      <path d="M120 392 Q 210 330, 300 368 T 480 342 T 676 328" fill="none" stroke="url(#gradAccent)" stroke-width="4" stroke-linecap="round"/>
    `;
  } else if (variant === 'architecture') {
    innerGraphic = `
      <g stroke="rgba(255,255,255,0.18)" stroke-width="1.5" stroke-dasharray="6 6">
        <line x1="210" y1="240" x2="330" y2="240"/>
        <line x1="470" y1="240" x2="590" y2="240"/>
        <line x1="400" y1="290" x2="400" y2="360"/>
      </g>
      <rect x="80" y="190" width="130" height="100" rx="14" fill="rgba(255,255,255,0.06)" stroke="${opts.accentA}" stroke-width="2"/>
      <text x="145" y="235" fill="white" font-family="sans-serif" font-size="13" font-weight="bold" text-anchor="middle">EDGE CDN</text>
      <text x="145" y="256" fill="rgba(255,255,255,0.65)" font-family="monospace" font-size="11" text-anchor="middle">Cloudflare</text>
      <rect x="330" y="180" width="140" height="115" rx="16" fill="rgba(255,255,255,0.08)" stroke="url(#gradAccent)" stroke-width="2.5"/>
      <text x="400" y="232" fill="white" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">API WORKER</text>
      <text x="400" y="254" fill="rgba(255,255,255,0.7)" font-family="monospace" font-size="11" text-anchor="middle">Hono + Zod</text>
      <rect x="590" y="190" width="130" height="100" rx="14" fill="rgba(255,255,255,0.06)" stroke="${opts.accentB}" stroke-width="2"/>
      <text x="655" y="235" fill="white" font-family="sans-serif" font-size="13" font-weight="bold" text-anchor="middle">POSTGRES</text>
      <text x="655" y="256" fill="rgba(255,255,255,0.65)" font-family="monospace" font-size="11" text-anchor="middle">Neon + Drizzle</text>
      <rect x="290" y="355" width="220" height="70" rx="12" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)"/>
      <text x="400" y="395" fill="rgba(255,255,255,0.85)" font-family="monospace" font-size="12" text-anchor="middle">LRU Memory Cache + ETag 304</text>
    `;
  } else if (variant === 'mobile') {
    innerGraphic = `
      <rect x="190" y="135" width="185" height="310" rx="26" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.22)" stroke-width="2"/>
      <rect x="252" y="148" width="60" height="6" rx="3" fill="rgba(255,255,255,0.3)"/>
      <rect x="210" y="172" width="145" height="80" rx="10" fill="url(#gradAccent)" opacity="0.85"/>
      <rect x="210" y="268" width="145" height="42" rx="8" fill="rgba(255,255,255,0.08)"/>
      <rect x="210" y="322" width="145" height="42" rx="8" fill="rgba(255,255,255,0.08)"/>
      <rect x="210" y="376" width="145" height="46" rx="10" fill="${opts.accentA}" opacity="0.4"/>
      <rect x="415" y="155" width="210" height="290" rx="22" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.16)" stroke-width="1.5"/>
      <circle cx="520" cy="240" r="46" fill="none" stroke="${opts.accentB}" stroke-width="8" stroke-dasharray="210 80"/>
      <text x="520" y="246" fill="white" font-family="sans-serif" font-size="18" font-weight="bold" text-anchor="middle">99.8%</text>
      <rect x="445" y="320" width="150" height="12" rx="6" fill="rgba(255,255,255,0.3)"/>
      <rect x="465" y="346" width="110" height="10" rx="5" fill="rgba(255,255,255,0.16)"/>
    `;
  } else if (variant === 'terminal') {
    innerGraphic = `
      <rect x="80" y="140" width="640" height="295" rx="14" fill="rgba(8, 12, 22, 0.85)" stroke="rgba(255,255,255,0.18)" stroke-width="1.5"/>
      <text x="115" y="195" fill="${opts.accentA}" font-family="monospace" font-size="15">$ wrangler deploy --minify</text>
      <text x="115" y="228" fill="rgba(255,255,255,0.75)" font-family="monospace" font-size="13">✓ Bundled 8 modular domain routers in 42ms</text>
      <text x="115" y="258" fill="rgba(255,255,255,0.75)" font-family="monospace" font-size="13">✓ Verified Zero-JSON flat query schema &amp; ETag cache</text>
      <text x="115" y="288" fill="rgb(52, 211, 153)" font-family="monospace" font-size="13">✓ p95 edge response latency: 11.4ms (300+ PoPs)</text>
      <rect x="115" y="320" width="570" height="80" rx="10" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)"/>
      <text x="140" y="355" fill="white" font-family="monospace" font-size="14" font-weight="bold">THROUGHPUT: 48,500 req/sec · ZERO COLD STARTS</text>
      <text x="140" y="380" fill="${opts.accentB}" font-family="monospace" font-size="12">Status: ACTIVE · Region: Global Anycast</text>
    `;
  } else if (variant === 'certificate') {
    innerGraphic = `
      <rect x="110" y="135" width="580" height="300" rx="18" fill="rgba(255,255,255,0.05)" stroke="url(#gradAccent)" stroke-width="2.5"/>
      <circle cx="400" cy="235" r="44" fill="url(#gradAccent)" opacity="0.25"/>
      <circle cx="400" cy="235" r="30" fill="none" stroke="${opts.accentA}" stroke-width="3"/>
      <path d="M388 235 L397 244 L415 224" fill="none" stroke="white" stroke-width="3.5" stroke-linecap="round"/>
      <rect x="260" y="305" width="280" height="14" rx="7" fill="rgba(255,255,255,0.8)"/>
      <rect x="310" y="332" width="180" height="10" rx="5" fill="rgba(255,255,255,0.35)"/>
      <rect x="340" y="365" width="120" height="26" rx="13" fill="${opts.accentA}" opacity="0.35"/>
    `;
  } else {
    innerGraphic = `
      <circle cx="400" cy="240" r="115" fill="url(#gradAccent)" opacity="0.22"/>
      <circle cx="400" cy="220" r="54" fill="rgba(255,255,255,0.9)"/>
      <path d="M305 365 C305 300 495 300 495 365" fill="rgba(255,255,255,0.85)"/>
      <circle cx="485" cy="165" r="14" fill="rgb(16,185,129)"/>
    `;
  }

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${bgStart}"/>
          <stop offset="100%" stop-color="${bgEnd}"/>
        </linearGradient>
        <linearGradient id="gradAccent" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="${opts.accentA}"/>
          <stop offset="100%" stop-color="${opts.accentB}"/>
        </linearGradient>
        <radialGradient id="glowA" cx="20%" cy="20%" r="50%">
          <stop offset="0%" stop-color="${opts.accentA}" stop-opacity="0.32"/>
          <stop offset="100%" stop-color="${opts.accentA}" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="glowB" cx="85%" cy="80%" r="50%">
          <stop offset="0%" stop-color="${opts.accentB}" stop-opacity="0.28"/>
          <stop offset="100%" stop-color="${opts.accentB}" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="800" height="500" fill="url(#bgGrad)"/>
      <rect width="800" height="500" fill="url(#glowA)"/>
      <rect width="800" height="500" fill="url(#glowB)"/>
      <g stroke="rgba(255,255,255,0.04)" stroke-width="1">
        <line x1="0" y1="100" x2="800" y2="100"/>
        <line x1="0" y1="200" x2="800" y2="200"/>
        <line x1="0" y1="300" x2="800" y2="300"/>
        <line x1="0" y1="400" x2="800" y2="400"/>
        <line x1="160" y1="0" x2="160" y2="500"/>
        <line x1="320" y1="0" x2="320" y2="500"/>
        <line x1="480" y1="0" x2="480" y2="500"/>
        <line x1="640" y1="0" x2="640" y2="500"/>
      </g>
      <rect x="70" y="42" width="160" height="28" rx="14" fill="rgba(255,255,255,0.09)" stroke="rgba(255,255,255,0.18)"/>
      <text x="150" y="60" fill="white" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle">${opts.badge}</text>
      <text x="70" y="96" fill="white" font-family="sans-serif" font-size="24" font-weight="bold">${opts.title}</text>
      <text x="730" y="94" fill="rgba(255,255,255,0.6)" font-family="sans-serif" font-size="13" text-anchor="end">${opts.subtitle}</text>
      ${innerGraphic}
    </svg>
  `;

  return svgDataUri(svg);
}

export const DEFAULT_AVATAR_URI = buildIllustrationUri({
  title: 'Jidan Fatahillah',
  subtitle: 'Fullstack & Cloud Architect',
  badge: 'OPEN TO WORK',
  accentA: 'rgb(56, 189, 248)',
  accentB: 'rgb(129, 140, 248)',
  variant: 'portrait',
});

export const PORTFOLIO_SHOWCASE_IMAGES: VisualShowcaseItem[] = [
  {
    id: 'showcase-pos-dashboard',
    url: buildIllustrationUri({
      title: 'OmniPOS Realtime Register',
      subtitle: 'Offline-First IndexedDB + WebSockets',
      badge: 'UI / POS SYSTEM',
      accentA: 'rgb(56, 189, 248)',
      accentB: 'rgb(59, 130, 246)',
      variant: 'dashboard',
    }),
    alt: 'OmniPOS Realtime Register Interface',
    title: 'OmniPOS Multi-Branch Dashboard',
    caption: 'Real-time point-of-sale interface with sub-50ms barcode scan response and offline queue indicator.',
    category: 'ui',
    aspect: 'wide',
    width: 1200,
    height: 750,
  },
  {
    id: 'showcase-edge-arch',
    url: buildIllustrationUri({
      title: 'Global Edge Mesh Topology',
      subtitle: 'Cloudflare Workers + Neon Serverless',
      badge: 'ARCHITECTURE',
      accentA: 'rgb(16, 185, 129)',
      accentB: 'rgb(6, 182, 212)',
      variant: 'architecture',
    }),
    alt: 'Global Edge Mesh Architecture',
    title: 'Zero-Cold-Start Edge Architecture',
    caption: 'Distributed Hono API topology with ETag conditional caching and regional read replicas.',
    category: 'architecture',
    aspect: 'wide',
    width: 1200,
    height: 750,
  },
  {
    id: 'showcase-mobile-checkout',
    url: buildIllustrationUri({
      title: 'Mobile POS & QR Pay',
      subtitle: 'PWA Touch Interface',
      badge: 'MOBILE APPS',
      accentA: 'rgb(168, 85, 247)',
      accentB: 'rgb(236, 72, 153)',
      variant: 'mobile',
    }),
    alt: 'Mobile POS and QR Payment App',
    title: 'Mobile Checkout & Inventory Scanner',
    caption: 'Responsive tablet and mobile PWA with instant QRIS dynamic payment generation.',
    category: 'mobile',
    aspect: 'square',
    width: 900,
    height: 900,
  },
  {
    id: 'showcase-telemetry-cli',
    url: buildIllustrationUri({
      title: 'Edge Telemetry Pipeline',
      subtitle: '48.5k req/s Benchmark',
      badge: 'ANALYTICS',
      accentA: 'rgb(245, 158, 11)',
      accentB: 'rgb(239, 68, 68)',
      variant: 'terminal',
    }),
    alt: 'Edge Telemetry Pipeline Benchmark',
    title: 'Cookieless Privacy Telemetry Engine',
    caption: 'High-throughput event ingestion pipeline with SHA-256 daily rotating visitor hashes.',
    category: 'analytics',
    aspect: 'wide',
    width: 1200,
    height: 750,
  },
  {
    id: 'showcase-cloud-k8s',
    url: buildIllustrationUri({
      title: 'Multi-Region Cloud Cluster',
      subtitle: 'Zero-Downtime Blue/Green Deploy',
      badge: 'CLOUD & DEVOPS',
      accentA: 'rgb(99, 102, 241)',
      accentB: 'rgb(14, 165, 233)',
      variant: 'architecture',
    }),
    alt: 'Multi-Region Cloud Cluster Diagram',
    title: 'Automated CI/CD & Cloud Observability',
    caption: 'GitHub Actions deployment pipeline with automated schema migrations and health probes.',
    category: 'cloud',
    aspect: 'square',
    width: 900,
    height: 900,
  },
  {
    id: 'showcase-finops-ui',
    url: buildIllustrationUri({
      title: 'FinOps Revenue & Ledger',
      subtitle: 'Automated Double-Entry Reconciliation',
      badge: 'FINTECH UI',
      accentA: 'rgb(20, 184, 166)',
      accentB: 'rgb(59, 130, 246)',
      variant: 'dashboard',
    }),
    alt: 'FinOps Revenue and Ledger Dashboard',
    title: 'Real-Time Financial Settlement Board',
    caption: 'Interactive multi-currency ledger with anomaly detection and instant CSV/PDF audit export.',
    category: 'ui',
    aspect: 'wide',
    width: 1200,
    height: 750,
  },
  {
    id: 'showcase-ai-copilot',
    url: buildIllustrationUri({
      title: 'AI Code Review Copilot',
      subtitle: 'Streaming AST & Semantic Diff',
      badge: 'AI / LLM OPS',
      accentA: 'rgb(236, 72, 153)',
      accentB: 'rgb(139, 92, 246)',
      variant: 'terminal',
    }),
    alt: 'AI Code Review Copilot Interface',
    title: 'Streaming Semantic PR Analyzer',
    caption: 'Automated pull-request security and performance reviewer powered by edge streaming.',
    category: 'analytics',
    aspect: 'square',
    width: 900,
    height: 900,
  },
  {
    id: 'showcase-community-summit',
    url: buildIllustrationUri({
      title: 'Jakarta TypeScript Summit',
      subtitle: 'Keynote & Live Coding Workshop',
      badge: 'COMMUNITY',
      accentA: 'rgb(251, 146, 60)',
      accentB: 'rgb(250, 204, 21)',
      variant: 'certificate',
    }),
    alt: 'Jakarta TypeScript Summit Speaker Session',
    title: 'Engineering Community & Workshops',
    caption: 'Live architecture workshop on building modular edge APIs and high-performance Next.js apps.',
    category: 'community',
    aspect: 'wide',
    width: 1200,
    height: 750,
  },
];

