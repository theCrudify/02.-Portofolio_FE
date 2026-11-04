export interface VisualShowcaseItem {
  id: string;
  url: string;
  alt: string;
  title?: string;
  caption?: string;
  category?: string;
  width?: number | null;
  height?: number | null;
}

function svgDataUri(svgContent: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent.trim())}`;
}

/**
 * Generates a pure, text-free geometric aurora mesh SVG Data URI for decorative backgrounds.
 */
export function buildAbstractMeshUri(seed = 0): string {
  const palettes = [
    { a: 'rgb(56, 189, 248)', b: 'rgb(99, 102, 241)' },
    { a: 'rgb(16, 185, 129)', b: 'rgb(6, 182, 212)' },
    { a: 'rgb(168, 85, 247)', b: 'rgb(236, 72, 153)' },
    { a: 'rgb(245, 158, 11)', b: 'rgb(59, 130, 246)' },
  ];
  const p = palettes[Math.abs(seed) % palettes.length]!;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="rgb(15, 20, 34)"/>
          <stop offset="100%" stop-color="rgb(24, 32, 54)"/>
        </linearGradient>
        <radialGradient id="gA" cx="25%" cy="25%" r="55%">
          <stop offset="0%" stop-color="${p.a}" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="${p.a}" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="gB" cx="80%" cy="75%" r="55%">
          <stop offset="0%" stop-color="${p.b}" stop-opacity="0.32"/>
          <stop offset="100%" stop-color="${p.b}" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="800" height="500" fill="url(#bg)"/>
      <rect width="800" height="500" fill="url(#gA)"/>
      <rect width="800" height="500" fill="url(#gB)"/>
      <g stroke="rgba(255,255,255,0.06)" stroke-width="1">
        <line x1="0" y1="100" x2="800" y2="100"/>
        <line x1="0" y1="200" x2="800" y2="200"/>
        <line x1="0" y1="300" x2="800" y2="300"/>
        <line x1="0" y1="400" x2="800" y2="400"/>
        <line x1="160" y1="0" x2="160" y2="500"/>
        <line x1="320" y1="0" x2="320" y2="500"/>
        <line x1="480" y1="0" x2="480" y2="500"/>
        <line x1="640" y1="0" x2="640" y2="500"/>
      </g>
    </svg>
  `;

  return svgDataUri(svg);
}
