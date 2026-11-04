import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

// Same mark as app/icon.svg; colour = --primary in sRGB (ImageResponse can't read CSS tokens).
export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#005fc6',
        color: '#ffffff',
        fontSize: 92,
        fontWeight: 900,
        letterSpacing: -4,
      }}
    >
      JF
    </div>,
    size,
  );
}
