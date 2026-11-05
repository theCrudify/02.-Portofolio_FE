import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 50%, #4338ca 100%)',
        color: '#ffffff',
        fontSize: 96,
        fontWeight: 900,
        letterSpacing: -4,
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline' }}>
        <span>JF</span>
        <span
          style={{
            width: 14,
            height: 14,
            borderRadius: 7,
            backgroundColor: '#38bdf8',
            marginLeft: 4,
          }}
        />
      </div>
    </div>,
    size,
  );
}
