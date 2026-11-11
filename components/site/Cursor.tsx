'use client';

import React, { useEffect, useRef } from 'react';

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only run on devices with a fine pointer (mouse) and no reduced motion
    const finePointer = window.matchMedia('(pointer:fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!finePointer || reducedMotion) return;

    const root = document.documentElement;
    root.classList.add('cur-on');

    let mx = -100;
    let my = -100;
    let rx = -100;
    let ry = -100;
    let animId: number;

    const onMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mx}px,${my}px,0)`;
      }
      root.classList.remove('cur-out');
    };

    const onMouseLeave = () => {
      root.classList.add('cur-out');
    };

    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${rx}px,${ry}px,0)`;
      }
      animId = requestAnimationFrame(loop);
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      root.classList.toggle('cur-field', !!target.closest('input,select,textarea'));
      const isView = !!target.closest('.case,.art-row,.vcard,.ihc,.ar,.site-row');
      root.classList.toggle('cur-view', isView);
      root.classList.toggle(
        'cur-link',
        !isView && !!target.closest('a,button,summary,[role=tab]')
      );
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseover', onMouseOver);
    animId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseover', onMouseOver);
      cancelAnimationFrame(animId);
      root.classList.remove('cur-on', 'cur-out', 'cur-field', 'cur-view', 'cur-link');
    };
  }, []);

  return (
    <div className="cur" aria-hidden="true">
      <div className="cur-ring" ref={ringRef}>
        <svg viewBox="0 0 100 110" preserveAspectRatio="none">
          <path
            d="M3 108 V54 C3 27 23 9 50 3 C77 9 97 27 97 54 V108 Z"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <span>View</span>
      </div>
      <div className="cur-dot" ref={dotRef} />
    </div>
  );
}

