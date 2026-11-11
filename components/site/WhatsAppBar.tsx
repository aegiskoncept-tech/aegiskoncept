'use client';

import React from 'react';
import Link from 'next/link';
import { trackWhatsAppClick } from '@/lib/analytics';

export default function WhatsAppBar() {
  return (
    <div className="wa-bar">
      <a
        className="btn b-o"
        style={{ color: 'var(--cream)' }}
        href="https://wa.me/917303468073"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackWhatsAppClick('mobile_sticky_bar')}
      >
        WhatsApp Us
      </a>
      <Link className="btn b-l" href="/contact">
        Let&apos;s Talk
      </Link>
    </div>
  );
}

