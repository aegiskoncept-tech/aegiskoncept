'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ARCH_PATH } from './Icons';

function getTitleFromPathname(pathname: string): string {
  if (!pathname || pathname === '/') return 'AegisKoncept';
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length === 0) return 'AegisKoncept';

  const segment = parts[0];
  if (segment === 'about') return 'About Us';
  if (segment === 'services') {
    if (parts[1]) {
      return parts[1]
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
    }
    return 'Services';
  }
  if (segment === 'our-work') {
    if (parts[1]) {
      return parts[1]
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
    }
    return 'Our Work';
  }
  if (segment === 'videos') return 'Videos';
  if (segment === 'industries') return 'Industries';
  if (segment === 'locations') return 'Locations';
  if (segment === 'insights') return 'Insights';
  if (segment === 'contact') return 'Contact';
  if (segment === 'thank-you') return 'Thank You';

  return parts[parts.length - 1]
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export default function Curtain() {
  const pathname = usePathname();
  const [curTitle, setCurTitle] = useState('AegisKoncept');
  const [isAnimating, setIsAnimating] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip on first load so SSR content is immediately visible
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const title = getTitleFromPathname(pathname);
    setCurTitle(title);
    setIsAnimating(true);

    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 1250);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div
      className={`curtain${isAnimating ? ' go' : ''}`}
      aria-hidden="true"
    >
      <svg className="dome" viewBox="0 0 100 30" preserveAspectRatio="none">
        <path
          d="M0 30.5 C0 13 22 2 50 0 C78 2 100 13 100 30.5 Z"
          fill="#191919"
        />
        <path
          d="M0 30 C0 13 22 2 50 0 C78 2 100 13 100 30"
          fill="none"
          stroke="#D3E45B"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="cbody">
        <div className="cmark">
          <svg viewBox="0 0 100 110" width="46" height="50" aria-hidden="true">
            <path d={ARCH_PATH} fill="var(--lime)" />
          </svg>
        </div>
        <div className="ctitle sf">{curTitle}</div>
      </div>
    </div>
  );
}

