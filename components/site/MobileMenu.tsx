'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SERVICES = [
  {
    id: 'website-development-design',
    name: 'Website Design & Development',
    line: 'Good-looking websites that bring you enquiries.',
  },
  {
    id: 'seo',
    name: 'SEO',
    line: 'Show up on Google when people search for you.',
  },
  {
    id: 'performance-marketing',
    name: 'Google & Meta Ads',
    line: 'Ads on Google, Instagram and Facebook that bring real leads.',
  },
  {
    id: 'social-media-marketing-management',
    name: 'Social Media Management',
    line: 'We post, we reply to your DMs, and we grow your page.',
  },
  {
    id: 'video-production',
    name: 'Shoots & Video Production',
    line: 'Reels, ad films and product shoots, made by our own crew.',
  },
];

export default function MobileMenu({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  const [servicesOpen, setServicesOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) {
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [isOpen]);

  // Close when pathname changes
  useEffect(() => {
    setIsOpen(false);
    setServicesOpen(false);
  }, [pathname, setIsOpen]);

  return (
    <nav
      className={`mnav${isOpen ? ' open' : ''}`}
      id="mnav"
      aria-label="Mobile"
      aria-hidden={!isOpen}
    >
      <div className="mn-in">
        <Link
          className="mn-l"
          style={{ '--d': 0 } as React.CSSProperties}
          href="/"
          aria-current={pathname === '/' ? 'page' : undefined}
        >
          <span>Home</span>
          <i>→</i>
        </Link>

        <Link
          className="mn-l"
          style={{ '--d': 1 } as React.CSSProperties}
          href="/about"
          aria-current={pathname === '/about' ? 'page' : undefined}
        >
          <span>About</span>
          <i>→</i>
        </Link>

        {/* Services accordion */}
        <div className={`mn-acc${servicesOpen ? ' open' : ''}`}>
          <button
            className="mn-l mn-tg"
            style={{ '--d': 2 } as React.CSSProperties}
            type="button"
            aria-expanded={servicesOpen}
            onClick={() => setServicesOpen((prev) => !prev)}
          >
            <span>Services</span>
            <i>{servicesOpen ? '−' : '+'}</i>
          </button>
          <div className="mn-sub">
            <div>
              {SERVICES.map((s) => (
                <Link
                  key={s.id}
                  href={`/services/${s.id}`}
                  aria-current={pathname === `/services/${s.id}` ? 'page' : undefined}
                >
                  <b>{s.name}</b>
                  <small>{s.line}</small>
                </Link>
              ))}
              <Link className="mn-all" href="/services">
                See all services →
              </Link>
            </div>
          </div>
        </div>

        <Link
          className="mn-l"
          style={{ '--d': 3 } as React.CSSProperties}
          href="/our-work"
          aria-current={pathname.startsWith('/our-work') ? 'page' : undefined}
        >
          <span>Our Work</span>
          <i>→</i>
        </Link>

        <Link
          className="mn-l"
          style={{ '--d': 4 } as React.CSSProperties}
          href="/videos"
          aria-current={pathname === '/videos' ? 'page' : undefined}
        >
          <span>Videos</span>
          <i>→</i>
        </Link>

        <Link
          className="mn-l"
          style={{ '--d': 5 } as React.CSSProperties}
          href="/industries"
          aria-current={pathname.startsWith('/industries') ? 'page' : undefined}
        >
          <span>Industries</span>
          <i>→</i>
        </Link>

        <Link
          className="mn-l"
          style={{ '--d': 6 } as React.CSSProperties}
          href="/insights"
          aria-current={pathname.startsWith('/insights') ? 'page' : undefined}
        >
          <span>Blog</span>
          <i>→</i>
        </Link>

        <Link
          className="mn-l"
          style={{ '--d': 7 } as React.CSSProperties}
          href="/locations"
          aria-current={pathname.startsWith('/locations') ? 'page' : undefined}
        >
          <span>Locations</span>
          <i>→</i>
        </Link>

        <Link
          className="mn-l"
          style={{ '--d': 8 } as React.CSSProperties}
          href="/contact"
          aria-current={pathname === '/contact' ? 'page' : undefined}
        >
          <span>Contact</span>
          <i>→</i>
        </Link>

        <div className="mn-foot" style={{ '--d': 9 } as React.CSSProperties}>
          <Link className="btn b-l" href="/contact">
            Get a Free Quote
          </Link>
          <a
            className="btn b-o"
            href="https://wa.me/917303468073"
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp Us
          </a>
          <p className="xs" style={{ color: 'var(--mute-d)', marginTop: '6px' }}>
            hello@aegiskoncept.com · Dwarka, New Delhi
          </p>
        </div>
      </div>

      <svg className="mn-deco" viewBox="0 0 100 110" aria-hidden="true">
        <path
          d="M0 110 V54 C0 26 22 8 50 0 C78 8 100 26 100 54 V110"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        />
      </svg>
    </nav>
  );
}

