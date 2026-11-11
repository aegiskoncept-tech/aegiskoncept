import React from 'react';

export default function ArchClip() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <clipPath id="arch-clip" clipPathUnits="objectBoundingBox">
          <path d="M0 1 V.49 C0 .236 .22 .073 .5 0 C.78 .073 1 .236 1 .49 V1 Z" />
        </clipPath>
      </defs>
    </svg>
  );
}

