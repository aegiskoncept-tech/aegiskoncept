import React from 'react';

export const ARCH_PATH =
  'M8 110 V54 C8 28 28 10 50 0 C72 10 92 28 92 54 V110 H70 V56 C70 42 62 31 50 24 C38 31 30 42 30 56 V110 Z';

export const ARCH_RING_PATH =
  'M3 108 V54 C3 27 23 9 50 3 C77 9 97 27 97 54 V108 Z';

export function ArchMark({
  size = 28,
  fill = 'var(--lime)',
  className = '',
}: {
  size?: number;
  fill?: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 110"
      width={size}
      height={Math.round(size * 1.1)}
      aria-hidden="true"
      className={className}
    >
      <path d={ARCH_PATH} fill={fill} />
    </svg>
  );
}

export function Logo({ size = 28 }: { size?: number }) {
  return (
    <a className="logo clogo" href="/" aria-label="AegisKoncept home">
      <ArchMark size={size} />
      <span className="sf">AegisKoncept</span>
    </a>
  );
}

