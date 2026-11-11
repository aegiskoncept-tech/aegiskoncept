'use client';

import React, { useEffect, useRef } from 'react';

export default function Overlays() {
  const sprogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const dh = document.documentElement.scrollHeight - window.innerHeight;
      if (sprogRef.current) {
        const progress = dh > 0 ? Math.min(1, Math.max(0, y / dh)) : 0;
        sprogRef.current.style.transform = `scaleX(${progress})`;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <div className="pbar" aria-hidden="true" />
      <div className="sprog" ref={sprogRef} aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
    </>
  );
}

