'use client';

import React from 'react';
import Link from 'next/link';
import { trackWhatsAppClick } from '@/lib/analytics';
import { SiteContactSettings, DEFAULT_CONTACT } from '@/lib/siteConfig';

export default function WhatsAppBar({ contact = DEFAULT_CONTACT }: { contact?: SiteContactSettings }) {
  const cleanWa = (contact.whatsapp || '917303468073').replace(/\D/g, '');

  return (
    <div className="wa-bar">
      <a
        className="btn b-o"
        style={{ color: 'var(--cream)' }}
        href={`https://wa.me/${cleanWa}`}
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

