'use client';

import React, { useEffect, useRef } from 'react';

const WORDS: Array<{ text: string; isEm?: boolean }> = [
  { text: "We're" },
  { text: 'not' },
  { text: 'another' },
  { text: 'agency' },
  { text: 'on' },
  { text: 'your' },
  { text: 'street.' },
  { text: 'We' },
  { text: 'plan.' },
  { text: 'We' },
  { text: 'create.' },
  { text: 'We' },
  { text: 'stay.', isEm: true },
  { text: 'So' },
  { text: 'your' },
  { text: 'business' },
  { text: 'keeps' },
  { text: 'growing,', isEm: true },
  { text: 'month' },
  { text: 'after' },
  { text: 'month,' },
  { text: 'year' },
  { text: 'after' },
  { text: 'year.' },
];

export default function ManifestoScrub() {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const wordsRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      wordsRef.current.forEach((w) => w && w.classList.add('lit'));
      return;
    }

    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(
        1,
        Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.35))
      );
      const k = Math.round(p * WORDS.length);

      wordsRef.current.forEach((w, i) => {
        if (w) w.classList.toggle('lit', i < k);
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className="dk">
      <div className="in sec">
        <p className="scrub sf" ref={containerRef}>
          {WORDS.map((item, idx) => {
            const span = (
              <span
                key={idx}
                ref={(el) => {
                  if (el) wordsRef.current[idx] = el;
                }}
                className="sw"
              >
                {item.text}{' '}
              </span>
            );
            return item.isEm ? <em key={idx}>{span}</em> : span;
          })}
        </p>
      </div>
    </section>
  );
}

