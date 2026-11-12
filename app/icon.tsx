import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#141311',
          borderRadius: '7px',
          border: '1px solid #2A2824',
        }}
      >
        <svg
          viewBox="0 0 100 110"
          width="20"
          height="22"
        >
          <path
            d="M8 110 V54 C8 28 28 10 50 0 C72 10 92 28 92 54 V110 H70 V56 C70 42 62 31 50 24 C38 31 30 42 30 56 V110 Z"
            fill="#D4E956"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}

