import React from 'react';
import Link from 'next/link';
import { Vis } from '@/components/site/Mockups';

export default function NotFound() {
  return (
    <section className="dk" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="in sec">
        <div className="split-r">
          <div className="stack" style={{ gap: 24 }}>
            <span className="lbl">Error 404</span>
            <h1 className="sf d1">Oops. This Page Isn&apos;t Here.</h1>
            <p className="ld">It may have moved, or the link might be wrong.</p>
            <div className="row-btn">
              <Link className="btn b-l" href="/">
                Go Home
              </Link>
              <Link className="btn b-o" href="/services">
                Our Services
              </Link>
              <Link className="btn b-o" href="/contact">
                Contact Us
              </Link>
            </div>
          </div>
          <div>
            <Vis kind="brand" cls="rarch" />
          </div>
        </div>
      </div>
    </section>
  );
}

