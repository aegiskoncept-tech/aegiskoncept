'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';

const LOGOS = [
  { file: '26a50833', alt: 'Thrive Gym', h: 58 },
  { file: 'bada290e', alt: 'West Coast Services', h: 58 },
  { file: '3dd9ad49', alt: 'Eco Utilities', h: 34 },
  { file: '56e25337', alt: 'UK Barber', h: 62 },
  { file: '88f9434f', alt: 'Pot & Bloom', h: 44 },
  { file: 'a5f3fa1c', alt: 'The Attic Storey', h: 62 },
  { file: 'f03c9f15', alt: 'The Drive Clinic', h: 38 },
  { file: '1539c868', alt: 'KMD Group', h: 60 },
  { file: 'e0c7efa9', alt: 'West London Cleaners', h: 52 },
  { file: '2306283a', alt: 'Shigeru Beauty', h: 40 },
];

export default function LogoMarquee() {
  const marqRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = marqRef.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    let lastY = window.scrollY;
    let vel = 0;
    let animId: number;

    const onScroll = () => {
      const y = window.scrollY;
      vel = vel * 0.8 + (y - lastY) * 0.2;
      lastY = y;
      const skew = Math.max(-10, Math.min(10, -vel * 0.25));
      el.style.transform = `skewX(${skew.toFixed(2)}deg)`;
    };

    const settle = () => {
      if (Math.abs(vel) > 0.05) {
        vel *= 0.9;
        const skew = Math.max(-10, Math.min(10, -vel * 0.25));
        el.style.transform = `skewX(${skew.toFixed(2)}deg)`;
      }
      animId = requestAnimationFrame(settle);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    animId = requestAnimationFrame(settle);

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <section className="dk logos">
      <div className="in" style={{ paddingBlock: '36px 6px' }}>
        <p className="xs mu">Brands that trust us</p>
      </div>
      <div className="marq lg" ref={marqRef} role="list" aria-label="Our clients">
        <div>
          {/* First loop */}
          {LOGOS.map((l) => (
            <span key={l.file} className="lgi" role="listitem">
              <Image
                src={`/assets/client-logos/${l.file}.png`}
                alt={l.alt}
                width={Math.round(l.h * 2.2)}
                height={l.h}
                style={{ height: `${l.h}px`, width: 'auto' }}
                loading="eager"
              />
            </span>
          ))}
          {/* Duplicate loop for seamless infinite marquee */}
          {LOGOS.map((l) => (
            <span key={`${l.file}-dup`} className="lgi" role="presentation">
              <Image
                src={`/assets/client-logos/${l.file}.png`}
                alt=""
                width={Math.round(l.h * 2.2)}
                height={l.h}
                style={{ height: `${l.h}px`, width: 'auto' }}
                loading="eager"
              />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

