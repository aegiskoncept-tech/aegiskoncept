'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArchMark, ARCH_PATH } from './Icons';
import { Vis } from './Mockups';

const SERVICES = [
  {
    id: 'website-development-design',
    name: 'Website Design & Development',
    line: 'Good-looking websites that bring you enquiries.',
    vis: 'site',
  },
  {
    id: 'seo',
    name: 'SEO',
    line: 'Show up on Google when people search for you.',
    vis: 'seo',
  },
  {
    id: 'performance-marketing',
    name: 'Google & Meta Ads',
    line: 'Ads on Google, Instagram and Facebook that bring real leads.',
    vis: 'ads',
  },
  {
    id: 'social-media-marketing-management',
    name: 'Social Media Management',
    line: 'We post, we reply to your DMs, and we grow your page.',
    vis: 'dm',
  },
  {
    id: 'video-production',
    name: 'Shoots & Video Production',
    line: 'Reels, ad films and product shoots, made by our own crew.',
    vis: 'vid',
  },
];

export default function Header({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}: {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [activeServiceIdx, setActiveServiceIdx] = useState(0);
  const pathname = usePathname();
  const megaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMegaOpen(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMegaOpen(false);
    setIsMobileMenuOpen(false);
  }, [pathname, setIsMobileMenuOpen]);

  return (
    <header className={`site-h${scrolled ? ' scrolled' : ''}`}>
      <div className="in hrow">
        {/* Left Nav */}
        <nav className="nav navl" aria-label="Main">
          <Link
            href="/about"
            data-nav="about"
            className={pathname === '/about' ? 'active' : ''}
          >
            About
          </Link>

          <div
            className={`dd${megaOpen ? ' open' : ''}`}
            data-nav="services"
            ref={megaRef}
            onMouseEnter={() => setMegaOpen(true)}
            onMouseLeave={() => setMegaOpen(false)}
          >
            <button
              type="button"
              aria-expanded={megaOpen}
              onClick={() => setMegaOpen((prev) => !prev)}
            >
              Services ▾
            </button>

            <div className="mega">
              <div className="mlist">
                {SERVICES.map((s, idx) => (
                  <Link
                    key={s.id}
                    className={`mi${idx === activeServiceIdx ? ' on' : ''}`}
                    href={`/services/${s.id}`}
                    data-i={idx}
                    onMouseEnter={() => setActiveServiceIdx(idx)}
                    onFocus={() => {
                      setActiveServiceIdx(idx);
                      setMegaOpen(true);
                    }}
                  >
                    <span className="mic">
                      <svg viewBox="0 0 100 110" aria-hidden="true">
                        <path d={ARCH_PATH} />
                      </svg>
                    </span>
                    <span className="mt">
                      <b>{s.name}</b>
                      <small>{s.line}</small>
                    </span>
                    <span className="ma" aria-hidden="true">
                      →
                    </span>
                  </Link>
                ))}
              </div>

              <div className="mprev">
                {SERVICES.map((s, idx) => (
                  <div
                    key={s.id}
                    className={`mp${idx === activeServiceIdx ? ' on' : ''}`}
                    data-i={idx}
                  >
                    <Vis kind={s.vis} cls="r43" />
                  </div>
                ))}
                <p className="xs" style={{ color: 'var(--mute-d)' }}>
                  Most clients start with one service and add a second as they grow.
                </p>
                <div className="mcta">
                  <Link
                    className="btn b-l"
                    href="/services"
                    style={{ minHeight: '44px', padding: '0 18px' }}
                  >
                    All services
                  </Link>
                  <Link className="tl" href="/contact">
                    Get a quote
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <Link
            href="/our-work"
            data-nav="our-work"
            className={pathname.startsWith('/our-work') ? 'active' : ''}
          >
            Our Work
          </Link>
          <Link
            href="/videos"
            data-nav="videos"
            className={pathname === '/videos' ? 'active' : ''}
          >
            Videos
          </Link>
        </nav>

        {/* Center Logo */}
        <Link className="logo clogo" href="/" aria-label="AegisKoncept home">
          <ArchMark size={28} />
          <span className="sf">AegisKoncept</span>
        </Link>

        {/* Right Nav */}
        <div className="navr">
          <nav className="nav" aria-label="More">
            <Link
              href="/industries"
              data-nav="industries"
              className={pathname.startsWith('/industries') ? 'active' : ''}
            >
              Industries
            </Link>
            <Link
              href="/insights"
              data-nav="insights"
              className={pathname.startsWith('/insights') ? 'active' : ''}
            >
              Blog
            </Link>
            <Link
              href="/contact"
              data-nav="contact"
              className={pathname === '/contact' ? 'active' : ''}
            >
              Contact
            </Link>
          </nav>

          <div className="h-cta">
            <Link className="btn b-l" href="/contact" style={{ minHeight: '46px' }}>
              Let&apos;s Talk
            </Link>
            <button
              className="burger"
              type="button"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mnav"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            >
              <span className="bl" aria-hidden="true">
                <i />
                <i />
              </span>
              <span className="bt">{isMobileMenuOpen ? 'Close' : 'Menu'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

