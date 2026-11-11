'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export interface ReviewOwnerItem {
  id: string;
  owner: [string, string];
  client: string;
  loc: string;
  one: string;
  svcs: string[];
  res?: Array<[string, string]>;
  approvedQuote?: string;
}

export default function ReviewsSpotlight({
  items,
}: {
  items: ReviewOwnerItem[];
}) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const isHoveredRef = useRef(false);
  const containerRef = useRef<HTMLElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const selectReview = (n: number) => {
    const next = (n + items.length) % items.length;
    setActiveIdx(next);
    setIsRunning(false);
    setTimeout(() => {
      if (!isHoveredRef.current) {
        setIsRunning(true);
      }
    }, 50);
  };

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !isRunning) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    timerRef.current = setTimeout(() => {
      if (!isHoveredRef.current) {
        setActiveIdx((cur) => (cur + 1) % items.length);
      }
    }, 6500);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isRunning, activeIdx, items.length]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
      const isVis = entries[0].isIntersecting;
      setIsRunning(isVis);
    });
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      className={`dk rvw${isRunning ? ' run' : ''}`}
      ref={containerRef}
      onMouseEnter={() => {
        isHoveredRef.current = true;
        setIsRunning(false);
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
        setIsRunning(true);
      }}
    >
      <div className="in sec">
        <div className="stack" style={{ gap: '40px' }}>
          <div className="split rv" style={{ alignItems: 'end' }}>
            <h2 className="sf h2">The People Who Trust Us.</h2>
            <p className="ld mu">
              Real owners, real businesses, in India and the UK. Many have been with us for years.
            </p>
          </div>

          <div className="rvw-g">
            {/* Left list of owners */}
            <div className="rvw-l" role="tablist" aria-label="Clients">
              {items.map((c, n) => {
                const isOn = n === activeIdx;
                return (
                  <button
                    key={c.id}
                    className={`rvw-n${isOn ? ' on' : ''}`}
                    role="tab"
                    aria-selected={isOn}
                    data-r={n}
                    type="button"
                    onClick={() => selectReview(n)}
                  >
                    <span className="sf">{c.owner[0]}</span>
                    <small>{c.client}</small>
                    <i aria-hidden="true" />
                  </button>
                );
              })}
            </div>

            {/* Right card */}
            <div className="rvw-s">
              {items.map((c, n) => {
                const isOn = n === activeIdx;
                const initials = c.owner[0]
                  .replace(/&amp;/g, '')
                  .replace(/&/g, '')
                  .split(' ')
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((w) => w[0])
                  .join('');

                return (
                  <article
                    key={c.id}
                    className={`rvw-i${isOn ? ' on' : ''}`}
                    data-r={n}
                    role="tabpanel"
                    aria-label={`${c.owner[0]}, ${c.client}`}
                  >
                    <div className="rvw-top">
                      <span className="rvw-m sf" aria-hidden="true">
                        {initials}
                      </span>
                      <div className="stack" style={{ gap: '2px' }}>
                        <b className="sf h3">{c.owner[0]}</b>
                        <span className="mu sm">
                          {c.owner[1]} · {c.client} · {c.loc}
                        </span>
                      </div>
                    </div>

                    {/* Strict honesty rule: only show quote if approved */}
                    {c.approvedQuote ? (
                      <blockquote className="rvw-q sf">
                        &ldquo;{c.approvedQuote}&rdquo;
                      </blockquote>
                    ) : (
                      <p className="rvw-q sf">{c.one}</p>
                    )}

                    <div className="rvw-b">
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {c.svcs.map((x) => (
                          <span key={x} className="chip">
                            {x}
                          </span>
                        ))}
                      </div>
                      <Link className="tl arr" href={`/our-work/${c.id}`}>
                        Read the story
                      </Link>
                    </div>

                    {c.res && c.res.length > 0 && (
                      <div className="rvw-st">
                        {c.res.slice(0, 3).map(([num, lbl], i) => (
                          <span key={i}>
                            <b className="sf">{num}</b>
                            <small>{lbl}</small>
                          </span>
                        ))}
                      </div>
                    )}
                  </article>
                );
              })}

              <div className="rvw-bar" aria-hidden="true">
                <span />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

