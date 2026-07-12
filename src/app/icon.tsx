import { ImageResponse } from 'next/og';
import LogoMark from '@/components/layout/LogoMark';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'transparent',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#4361ee', // Akzentfarbe (--color-text-accent)
        }}
      >
        <LogoMark size={26} />
      </div>
    ),
    {
      ...size,
    }
  );
}
