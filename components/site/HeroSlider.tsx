'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';

export interface SlideData {
  id: string;
  kick: string;
  lines: string[];
  sub: string;
  href: string;
  service: string;
  btnLabel: string;
}

export const SLIDES: SlideData[] = [
  {
    id: 'site',
    kick: 'Website Design & Development',
    lines: ['Websites', 'People Love', 'to Use.'],
    sub: 'Fast, good-looking websites that make it easy for people to contact you.',
    href: '/services/website-development-design',
    service: 'Website',
    btnLabel: 'Explore Websites',
  },
  {
    id: 'seo',
    kick: 'SEO',
    lines: ['Show Up First', 'on Google.'],
    sub: 'Be the business people find when they search on Google and Google Maps.',
    href: '/services/seo',
    service: 'SEO',
    btnLabel: 'Explore SEO',
  },
  {
    id: 'ads',
    kick: 'Google + Meta Ads',
    lines: ['Ads That Bring', 'Real Customers.'],
    sub: 'Ads on Google, Instagram and Facebook, measured on leads, not likes.',
    href: '/services/performance-marketing',
    service: 'Ads (Google / Meta)',
    btnLabel: 'Explore Ads',
  },
  {
    id: 'dm',
    kick: 'Social Media Management',
    lines: ['We Post.', 'We Reply.', 'You Grow.'],
    sub: 'We make your content, post it, and reply to your DMs and comments too.',
    href: '/services/social-media-marketing-management',
    service: 'Social Media',
    btnLabel: 'Explore Social Media',
  },
];

export default function HeroSlider({
  onSlideChange,
}: {
  onSlideChange: (serviceName: string) => void;
}) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [outIdx, setOutIdx] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const isHoveredRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const goToSlide = useCallback(
    (nextIdx: number) => {
      setActiveIdx((current) => {
        const next = (nextIdx + SLIDES.length) % SLIDES.length;
        if (current !== next) {
          setOutIdx(current);
          setTimeout(() => setOutIdx(null), 800);
          onSlideChange(SLIDES[next].service);
          if (typeof window !== 'undefined' && (window as any).__heroBurst) {
            (window as any).__heroBurst();
          }
        }
        return next;
      });
    },
    [onSlideChange]
  );

  // Autoplay
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      if (!isHoveredRef.current) {
        goToSlide(activeIdx + 1);
      }
    }, 7000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, activeIdx, goToSlide]);

  return (
    <div
      className="hleft"
      aria-roledescription="carousel"
      aria-label="Our services"
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
      }}
    >
      <h1 className="h1s">Creative digital marketing agency in Delhi</h1>

      <div className="stagew">
        {SLIDES.map((slide, i) => {
          const isOn = i === activeIdx;
          const isOut = i === outIdx;
          let charCounter = 0;

          return (
            <div
              key={slide.id}
              className={`hs${isOn ? ' on' : ''}${isOut ? ' out' : ''}`}
              id={`slide-${i}`}
              data-svc={slide.service}
              role="tabpanel"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${SLIDES.length}`}
              aria-hidden={!isOn}
            >
              <div className="txt">
                <span className="kick">{slide.kick}</span>
                <p className="h" aria-label={slide.lines.join(' ')}>
                  {slide.lines.map((line, li) => {
                    const words = line.split(' ');
                    const isLastLine = li === slide.lines.length - 1;

                    return (
                      <span key={li} className="ln" aria-hidden="true">
                        <span className={isLastLine ? 'hl' : ''}>
                          {words.map((word, wi) => (
                            <span key={wi} className="w">
                              {word.split('').map((char, ci) => {
                                charCounter++;
                                return (
                                  <span
                                    key={ci}
                                    className="ch"
                                    style={{ '--i': charCounter } as React.CSSProperties}
                                  >
                                    {char}
                                  </span>
                                );
                              })}
                              {wi < words.length - 1 && ' '}
                            </span>
                          ))}
                        </span>
                      </span>
                    );
                  })}
                </p>

                <p className="sub">{slide.sub}</p>

                <div className="row-btn">
                  <Link className="btn b-l" href={slide.href}>
                    {slide.btnLabel}
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="hbar">
        <div role="tablist" aria-label="Choose a service" style={{ display: 'contents' }}>
          {SLIDES.map((slide, i) => (
            <button
              key={slide.id}
              className={`t${i === activeIdx ? ' on' : ''}`}
              type="button"
              role="tab"
              aria-selected={i === activeIdx}
              aria-controls={`slide-${i}`}
              data-i={i}
              onClick={() => goToSlide(i)}
            >
              <b>0{i + 1}</b>
              <span>
                {slide.service === 'Website'
                  ? 'Websites'
                  : slide.service === 'Ads (Google / Meta)'
                  ? 'Ads'
                  : slide.service}
              </span>
            </button>
          ))}
        </div>

        <div className="ctl">
          <button
            type="button"
            className="prev"
            aria-label="Previous slide"
            onClick={() => goToSlide(activeIdx - 1)}
          >
            ←
          </button>
          <button
            type="button"
            className="pp"
            aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
            onClick={() => setIsPlaying((p) => !p)}
          >
            {isPlaying ? '❚❚' : '▶'}
          </button>
          <button
            type="button"
            className="next"
            aria-label="Next slide"
            onClick={() => goToSlide(activeIdx + 1)}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}

